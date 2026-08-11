'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  CalendarCheck, 
  FileCheck2, 
  TrendingUp, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  CreditCard, 
  PlusCircle, 
  ArrowLeft,
  CheckCircle2,
  BellRing,
  Pill,
  Award,
  Search,
  Globe2
} from 'lucide-react';
import { SPECIALTY_MEDICATIONS, CLINIC_SPECIALTIES } from '@/lib/specialtyMedications';

export default function HomePage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(CLINIC_SPECIALTIES[1]); // الباطنة

  const selectedMeds = SPECIALTY_MEDICATIONS[selectedSpecialty] || SPECIALTY_MEDICATIONS["باطنة (Internal Medicine)"];

  return (
    <div className="space-y-16 py-4">
      
      {/* HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 p-8 sm:p-14 border border-cyan-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>الجيل الأحدث 2026 - نظام إدارة العيادات والمراكز الطبية بالذكاء الاصطناعي</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            نظام <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">SmartClinic</span> لإدارة العيادات والروشتات والماليات
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed">
            تنظيم وحجز المواعيد عن بعد وداخل العيادة بدون تعارض، إعداد روشتات إلكترونية فائقة الاحترافية متكيفة مع تخصصك تلقائياً، ملف طبي شامل للمريض، محرك اقتراح تشخيص بالذكاء الاصطناعي، وإدارة مالية متكاملة.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-base bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>افتح عيادتك مجاناً (14 يوماً)</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <Link
              href="/doctor-dashboard"
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold text-base bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 transition-all"
            >
              <Stethoscope className="w-5 h-5 text-cyan-400" />
              <span>تجربة شاشة الطبيب المريحة</span>
            </Link>
          </div>

          {/* Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>منع تعارض المواعيد</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>أدوية مدمجة حسب التخصص</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>روشتة PDF باللوجو</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>بوابات دفع ومتعدد الأطباء</span>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALTY-AUTOMATED MEDICATIONS DEMO SHOWCASE */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white">تحميل تلقائي لأدوية تخصص العيادة</h2>
          <p className="text-sm text-slate-400">عند إنشاء عيادتك واختيار تخصصك، يقدم لك النظام شريط الأدوية والجرعات المقترحة والمجهزة مسبقاً لتوفير وقت الطبيب في كتابة الروشتة.</p>
        </div>

        {/* Specialty Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar justify-start md:justify-center">
          {CLINIC_SPECIALTIES.slice(0, 7).map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Loaded Drugs Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedMeds.map((med) => (
            <div key={med.id} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{med.name}</h4>
                    <span className="text-xs text-cyan-400 font-semibold">{med.specialty}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {med.dosage}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">التوقيت</span>
                  <span className="font-semibold">{med.timing}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">التكرار</span>
                  <span className="font-semibold">{med.frequency}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                ملاحظات: {med.notes}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CORE SYSTEM FEATURES MATRIX */}
      <section className="space-y-8 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white">منظومة شاملة للقيادة الطبية والمالية</h2>
          <p className="text-sm text-slate-400">دراسة شاملة لأنظمة السوق لتقديم التطبيق الأكثر تكاملاً وسلاسة في عيادتك.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">حجز مواعيد أونلاين وداخلي بدون تعارض</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              منع التضارب بين حجز المرضى عن بُعد والحجز المباشر بالاستقبال، مع خوارزمية ذكية لمواعيد وساعات عمل أطباء العيادة.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">شاشة طبيب سلسة وتقتراح تشخيص بالذكاء الاصطناعي</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              تصميم هادئ مريح للعين، إدخال الأعراض والمؤشرات الحيوية، واقتراح تشخيص مبدئي تلقائي مساند للقرار الطبي.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <FileCheck2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">روشتات PDF فاخرة باللوجو واسم العيادة</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              تنسيق روشتة فاخرة تحتوي على هيدر باللوجو واسم الطبيب وتفاصيل المريض وتوصيات الفحوصات وفوتر بالعنوان والتليفونات وكود QR.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">إدارة الحسابات والماليات الشاملة</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              تسجيل كافة الإيرادات والمصروفات والمشتريات وتوليد فواتير رسمية وتقارير أرباح وخسائر بالرسوم البيانية.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">بوابات دفع عالمية ومحلية</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              دعم بوابات الدفع PayPal و Paymob و LemonSqueezy و Fawry مع نظام فترات تجريبية مجانية 14 يوماً للمستخدمين الجدد.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl glass-card space-y-4 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">تحديث SEO / GEO / AEO يومي آلي</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              تحسين محركات البحث والذكاء الاصطناعي (ChatGPT, Gemini, Perplexity) تلقائياً يومياً لإظهار عيادتك في صدارة النتائج.
            </p>
          </div>

        </div>
      </section>

      {/* QUICK ONBOARDING CALLOUT */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-900/80 via-slate-900 to-blue-900/80 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-right">
          <h3 className="text-2xl sm:text-3xl font-black text-white">جاهز لإنشاء حساب عيادتك مجاناً؟</h3>
          <p className="text-slate-300 text-sm">أدخل بياناتك، تخصصك، واللوجو وسيتكفل النظام بتهيئة الأدوية وشاشة الطبيب فوراً.</p>
        </div>
        <Link
          href="/onboarding"
          className="px-8 py-4 rounded-2xl font-black text-base bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-xl shadow-cyan-400/20 active:scale-95 transition-all whitespace-nowrap"
        >
          ابدأ الإعداد الآن (مجاناً 14 يوماً)
        </Link>
      </section>

    </div>
  );
}
