'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Stethoscope, 
  UserCheck, 
  Phone, 
  MapPin, 
  Image as ImageIcon, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  CheckCircle2,
  Pill
} from 'lucide-react';
import { CLINIC_SPECIALTIES, SPECIALTY_MEDICATIONS } from '@/lib/specialtyMedications';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: CLINIC_SPECIALTIES[1], // باطنة
    doctor_name: '',
    phone: '',
    address: '',
    logo_url: 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png',
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('تم إنشاء العيادة وتفعيل التخصص والأدوية التلقائية بنجاح! يتم التوجيه الآن...');
        setTimeout(() => {
          router.push('/doctor-dashboard');
        }, 1500);
      } else {
        setMessage(`خطأ: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`خطأ في الإرسال: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const previewMeds = SPECIALTY_MEDICATIONS[formData.specialty] || SPECIALTY_MEDICATIONS["باطنة (Internal Medicine)"];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>معالج إعداد العيادة الجديدة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">إدخال بيانات وتخصص العيادة واللوجو</h1>
        <p className="text-sm text-slate-400">بناءً على اختيار تخصص العيادة، سيتم ادراج دليل الأدوية والجرعات الخاصة بها تلقائياً</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 p-8 rounded-3xl glass-panel space-y-6 border border-slate-800">
          
          {message && (
            <div className={`p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 ${
              message.includes('خطأ') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Clinic Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>اسم العيادة / المركز الطبي *</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: عيادة النور التخصصية"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Specialty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-cyan-400" />
              <span>تخصص العيادة الرئيسي * (لتحميل الأدوية التلقائية)</span>
            </label>
            <select
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {CLINIC_SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Doctor Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>اسم الطبيب الرئيسي *</span>
            </label>
            <input
              type="text"
              required
              placeholder="مثال: د. محمد عاطف"
              value={formData.doctor_name}
              onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Phone & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>تليفون العيادة</span>
              </label>
              <input
                type="text"
                placeholder="01012345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>عنوان العيادة التفصيلي</span>
              </label>
              <input
                type="text"
                placeholder="القاهرة - مدينة نصر - شارع الطيران"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Logo URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>رابط اللوجو (Logo URL) لطباعته في هيدر الروشتات</span>
            </label>
            <input
              type="text"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>جاري حفظ العيادة وتجهيز الأدوية...</span>
            ) : (
              <>
                <span>تفعيل العيادة والتوجيه لشاشة الطبيب</span>
                <ArrowLeft className="w-5 h-5" />
              </>
            )}
          </button>

        </form>

        {/* Live Specialty Medication Preview Panel */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Pill className="w-5 h-5" />
            <span>معاينة الأدوية المدرجة تلقائياً</span>
          </div>

          <p className="text-xs text-slate-400">
            بمجرد فتح الحساب كـ <strong className="text-white">({formData.specialty})</strong>، سيتم إتاحة الأدوية التالية فوراً للطبيب:
          </p>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {previewMeds.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-slate-200">{m.name}</div>
                <div className="text-[11px] text-cyan-400 font-semibold">{m.dosage} - {m.frequency}</div>
                <div className="text-[10px] text-slate-400">{m.timing} | {m.duration}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
