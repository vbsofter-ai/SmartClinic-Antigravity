import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get('clinicId') || '1';

    const [transactions]: any = await pool.query(`
      SELECT * FROM financial_transactions WHERE clinic_id = ? ORDER BY transaction_date DESC, id DESC
    `, [clinicId]);

    // Calculate Totals
    let totalRevenue = 0;
    let totalExpenses = 0;
    let totalPurchases = 0;

    transactions.forEach((tx: any) => {
      const amt = parseFloat(tx.amount);
      if (tx.type === 'REVENUE') totalRevenue += amt;
      if (tx.type === 'EXPENSE') totalExpenses += amt;
      if (tx.type === 'PURCHASE') totalPurchases += amt;
    });

    const netProfit = totalRevenue - (totalExpenses + totalPurchases);

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        totalExpenses,
        totalPurchases,
        netProfit
      },
      transactions
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clinic_id, type, category, amount, description, transaction_date } = body;

    await pool.query(`
      INSERT INTO financial_transactions (clinic_id, type, category, amount, description, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [clinic_id || 1, type, category, amount, description, transaction_date || new Date().toISOString().split('T')[0]]);

    return NextResponse.json({ success: true, message: 'تم تسليط وتسجيل العملية المالية بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
