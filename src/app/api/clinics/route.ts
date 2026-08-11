import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM clinics ORDER BY id DESC');
    return NextResponse.json({ success: true, clinics: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, specialty, doctor_name, phone, address, logo_url } = body;

    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 14);

    const [res]: any = await pool.query(`
      INSERT INTO clinics (name, specialty, doctor_name, phone, address, logo_url, subscription_status, trial_ends_at)
      VALUES (?, ?, ?, ?, ?, ?, 'TRIAL', ?)
    `, [name, specialty, doctor_name, phone, address, logo_url || 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', trialEnds]);

    const clinicId = res.insertId;

    // Create doctor
    await pool.query(`
      INSERT INTO doctors (clinic_id, name, specialty, phone)
      VALUES (?, ?, ?, ?)
    `, [clinicId, doctor_name, specialty, phone]);

    return NextResponse.json({ success: true, clinicId, message: 'تم فتح العيادة وتفعيل الفترة التجريبية (14 يوماً) بنجاح!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
