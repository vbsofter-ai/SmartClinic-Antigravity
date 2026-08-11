import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get('clinicId') || '1';

    const [prescriptions]: any = await pool.query(`
      SELECT p.*, pat.name as patient_name, pat.patient_code, pat.age, pat.gender, d.name as doctor_name, c.name as clinic_name, c.logo_url, c.address as clinic_address, c.phone as clinic_phone
      FROM prescriptions p
      JOIN patients pat ON p.patient_id = pat.id
      JOIN doctors d ON p.doctor_id = d.id
      JOIN clinics c ON p.clinic_id = c.id
      WHERE p.clinic_id = ?
      ORDER BY p.id DESC
    `, [clinicId]);

    // Attach items for each prescription
    for (let rx of prescriptions) {
      const [items]: any = await pool.query(`
        SELECT * FROM prescription_items WHERE prescription_id = ?
      `, [rx.id]);
      rx.items = items;
    }

    return NextResponse.json({ success: true, prescriptions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clinic_id, doctor_id, patient_id, appointment_id, visit_date, symptoms, diagnosis, lab_requests, doctor_notes, items } = body;

    const cId = clinic_id || 1;
    const dId = doctor_id || 1;

    const [rxRes]: any = await pool.query(`
      INSERT INTO prescriptions (clinic_id, doctor_id, patient_id, appointment_id, visit_date, symptoms, diagnosis, lab_requests, doctor_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [cId, dId, patient_id, appointment_id || null, visit_date || new Date().toISOString().split('T')[0], symptoms, diagnosis, lab_requests, doctor_notes]);

    const prescriptionId = rxRes.insertId;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        await pool.query(`
          INSERT INTO prescription_items (prescription_id, drug_name, dosage, frequency, timing, duration, notes)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [prescriptionId, item.drug_name, item.dosage, item.frequency, item.timing, item.duration, item.notes || '']);
      }
    }

    // Also update appointment status to COMPLETED if linked
    if (appointment_id) {
      await pool.query(`UPDATE appointments SET status = 'COMPLETED' WHERE id = ?`, [appointment_id]);
    }

    return NextResponse.json({ success: true, prescriptionId, message: 'تم كشف الروشتة وإصدارها بنجاح!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
