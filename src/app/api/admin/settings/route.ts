import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await pool.query('SELECT * FROM system_settings');
    const settings: Record<string, string> = {};
    rows.forEach((r: any) => {
      settings[r.setting_key] = r.setting_value;
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // key-value object of settings to update

    for (const [key, value] of Object.entries(body)) {
      await pool.query(`
        INSERT INTO system_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = ?
      `, [key, String(value), String(value)]);
    }

    return NextResponse.json({ success: true, message: 'تم تحديث إعدادات النظام وشبكات الإعلانات وبوابات الدفع بنجاح!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
