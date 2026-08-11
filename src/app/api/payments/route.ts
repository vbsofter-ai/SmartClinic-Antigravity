import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gateway, plan, clinic_id, amount, currency } = body;

    // Simulate multi-gateway payment response with reference transaction ID
    const txnId = 'TXN-' + gateway.toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000);

    let checkoutUrl = '#';
    let instructions = '';

    if (gateway === 'paypal') {
      checkoutUrl = `https://www.sandbox.paypal.com/checkoutnow?token=EC-DEMO-${txnId}`;
      instructions = 'تم فتح نافذة PayPal التفاعلية بنجاح.';
    } else if (gateway === 'paymob') {
      checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/778899?payment_token=PAYMOB_TOKEN_${txnId}`;
      instructions = 'تم توليد كود الدفع كارت / ميزة عبر بوابة Paymob.';
    } else if (gateway === 'lemonsqueezy') {
      checkoutUrl = `https://smartclinic.lemonsqueezy.com/checkout/buy/pro-plan?checkout[custom][clinic_id]=${clinic_id}`;
      instructions = 'تم توجيه الاشتراكات الدولية عبر بوابة LemonSqueezy.';
    } else if (gateway === 'fawry') {
      const fawryRef = Math.floor(900000000 + Math.random() * 100000000);
      instructions = `رقم مرجع فوري للدفع في أي منفذ فوري هو: (${fawryRef})`;
    }

    return NextResponse.json({
      success: true,
      txnId,
      gateway,
      plan,
      amount,
      currency: currency || 'EGP',
      checkoutUrl,
      instructions,
      message: `تم بدء عملية الدفع عبر بوابة (${gateway.toUpperCase()}) بنجاح`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
