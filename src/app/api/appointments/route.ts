import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get('clinicId') || '1';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const [rows]: any = await pool.query(`
      SELECT a.*, p.name as patient_name, p.phone as patient_phone, p.patient_code, p.age, p.gender, d.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.clinic_id = ? AND a.appointment_date = ?
      ORDER BY a.id ASC
    `, [clinicId, date]);

    return NextResponse.json({ success: true, appointments: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clinic_id, doctor_id, patient_name, patient_phone, appointment_date, appointment_time, booking_type, notes } = body;

    const cId = clinic_id || 1;
    const dId = doctor_id || 1;

    // 1. Conflict Check: Ensure no double-booking for the doctor at the exact same date & time slot
    const [conflictRows]: any = await pool.query(`
      SELECT id FROM appointments 
      WHERE clinic_id = ? AND doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'CANCELLED'
    `, [cId, dId, appointment_date, appointment_time]);

    if (conflictRows.length > 0) {
      return NextResponse.json({
        success: false,
        conflict: true,
        message: `الموعد (${appointment_time}) محجوز بالفعل للطبيب في هذا التاريخ! يرجى اختيار توقيت آخر لمنع التعارض.`
      }, { status: 400 });
    }

    // 2. Find or create patient
    let patientId: number;
    const [existingPatient]: any = await pool.query(`
      SELECT id FROM patients WHERE clinic_id = ? AND phone = ?
    `, [cId, patient_phone]);

    if (existingPatient.length > 0) {
      patientId = existingPatient[0].id;
    } else {
      const code = 'PAT-' + Math.floor(1000 + Math.random() * 9000);
      const [newP]: any = await pool.query(`
        INSERT INTO patients (clinic_id, patient_code, name, phone, age, gender)
        VALUES (?, ?, ?, ?, 30, 'غير محدد')
      `, [cId, code, patient_name, patient_phone]);
      patientId = newP.insertId;
    }

    // 3. Book appointment
    const [appRes]: any = await pool.query(`
      INSERT INTO appointments (clinic_id, doctor_id, patient_id, appointment_date, appointment_time, booking_type, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, 'WAITING', ?)
    `, [cId, dId, patientId, appointment_date, appointment_time, booking_type || 'IN_CLINIC', notes || '']);

    return NextResponse.json({
      success: true,
      appointmentId: appRes.insertId,
      message: 'تم حجز الموعد بنجاح وبدون أي تعارض مع مواعيد الطبيب!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { appointment_id, status } = body;

    await pool.query(`
      UPDATE appointments SET status = ? WHERE id = ?
    `, [status, appointment_id]);

    return NextResponse.json({ success: true, message: `تم تحديث حالة الموعد إلى (${status}) بنجاح` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
