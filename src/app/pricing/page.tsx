'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Zap,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentGateway, setPaymentGateway] = useState('paymob');
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'trial',
      name: 'الخطوة المجانية (Free Trial)',
      price: '0 ج.م',
      period: 'لمدة 14 يوماً',
      badge: 'الافتراضية للجدد',
      features: [
        'إمكانية إدارة عيادة واحدة',
        'حجز مواعيد أونلاين وداخلي',
        'طباعة روشتات PDF باللوجو',
        'تحميل أدوية التخصص تلقائياً',
        'يتضمن إعلانات AdSense & Adsterra'
      ],
      buttonText: 'الخطة المفعلة حالياً',
      highlighted: false
    },
    {
      id: 'pro',
      name: 'الخطة الاحترافية (Pro Clinic)',
      price: '499 ج.م',
      period: 'شهرياً',
      badge: 'الأكثر شعبية',
      features: [
        'جميع ميزات النسخة المجانية',
        'إزالة الإعلانات نهائياً',
        'دعم أطباء متعددين بنفس العيادة',
        'نظام تشخيص بالذكاء الاصطناعي الكامل',
        'تقارير مالية وأرباح وخسائر متقدمة',
        'تحديث SEO / GEO / AEO يومي مخصص'
      ],
      buttonText: 'ترقية الحساب الآن',
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'خطة المراكز والمستشفيات (Enterprise)',
      price: '1,299 ج.م',
      period: 'شهرياً',
      badge: 'تكامل كامل',
      features: [
        'عدد لا محدود من الأطباء والعيادات',
        'ربط واتساب وإشعارات SMS تلقائية',
        'دعم فني مباشر على مدار الساعة',
        'سيرفر خاص ودعم بوابات الدفع المباشرة'
      ],
      buttonText: 'طلب الترقية الخاصة',
      highlighted: false
    }
  ];

  const handleCheckout = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    setCheckoutResult(null);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: paymentGateway,
          plan: selectedPlan.id,
          clinic_id: 1,
          amount: selectedPlan.price
        })
      });

      const data = await res.json();
      if (data.success) {
        setCheckoutResult(data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>خطط الاشتراكات وبوابات الدفع</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">اختر الخطة المناسبة لعيادتك</h1>
        <p className="text-sm text-slate-400">إتاحة النظام مجانياً 14 يوماً للعيادات الجديدة مع دعم إمكانية الترقية وبوابات الدفع المتعددة</p>
      </div>

      {/* PLANS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-8 rounded-3xl space-y-6 flex flex-col justify-between transition-all border ${
              plan.highlighted
                ? 'glass-panel border-cyan-500 shadow-2xl shadow-cyan-500/10 relative overflow-hidden scale-105'
                : 'glass-card border-slate-800'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-0 bg-cyan-500 text-slate-950 font-black text-[10px] uppercase px-4 py-1 rounded-br-2xl">
                {plan.badge}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 pt-4 border-t border-slate-800">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedPlan(plan)}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all ${
                plan.highlighted
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* MULTI PAYMENT GATEWAYS CHECKOUT MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">ترقية الحساب: {selectedPlan.name}</h3>
                <p className="text-xs text-slate-400">المبلغ المطلوب: {selectedPlan.price}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-white text-xs">إلغاء</button>
            </div>

            {/* Select Gateway */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">اختر بوابة الدفع المناسبة لك:</label>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentGateway('paymob')}
                  className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all ${
                    paymentGateway === 'paymob'
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>Paymob (فيزا / ميزة)</span>
                  <CreditCard className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentGateway('paypal')}
                  className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all ${
                    paymentGateway === 'paypal'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>PayPal (دولي)</span>
                  <Globe className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentGateway('lemonsqueezy')}
                  className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all ${
                    paymentGateway === 'lemonsqueezy'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>LemonSqueezy</span>
                  <Zap className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentGateway('fawry')}
                  className={`p-3 rounded-2xl text-xs font-bold border flex items-center justify-between transition-all ${
                    paymentGateway === 'fawry'
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>كود فوري (Fawry)</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Checkout Result Box */}
            {checkoutResult && (
              <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 space-y-2 text-xs">
                <div className="font-bold text-cyan-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{checkoutResult.message}</span>
                </div>
                <p className="text-slate-300">{checkoutResult.instructions}</p>
                <div className="font-mono text-[11px] text-cyan-400">رقم الحركة المرجعي: {checkoutResult.txnId}</div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-black text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جاري الاتصال ببوابة الدفع...</span>
              ) : (
                <>
                  <span>بدء عملية الدفع والترقية</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
