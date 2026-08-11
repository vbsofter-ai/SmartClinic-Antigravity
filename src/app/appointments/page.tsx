'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  UserPlus, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter,
  Globe,
  Building,
  Plus
} from 'lucide-react';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    patient_phone: '',
    appointment_date: selectedDate,
    appointment_time: '11:00 AM',
    booking_type: 'IN_CLINIC',
    notes: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?clinicId=1&date=${selectedDate}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, clinic_id: 1, doctor_id: 1 })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg('');
          fetchAppointments();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'حدث تعارض في الموعد!');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
            <span>جدول وإدارة المواعيد وحجز المرضى</span>
          </h1>
          <p className="text-xs text-slate-400">حجز أونلاين وداخلي مع خوارزمية الحماية الفورية من تعارض الأوقات</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>حجز موعد جديد (بدون تعارض)</span>
        </button>
      </div>

      {/* Date Picker & Filter Bar */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-cyan-400" />
          <span>تاريخ اليوم:</span>
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Appointments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-sm glass-panel rounded-3xl border border-slate-800">
            لا توجد مواعيد حجز مسجلة لليوم ({selectedDate})
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="p-5 rounded-3xl glass-card border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-cyan-300 font-mono border border-slate-700">
                  {appt.appointment_time}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  appt.booking_type === 'REMOTE'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {appt.booking_type === 'REMOTE' ? 'حجز عن بعد' : 'حجز داخلي'}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white text-base">{appt.patient_name}</h4>
                <p className="text-xs text-slate-400">تليفون: {appt.patient_phone || '01012345678'}</p>
              </div>

              {appt.notes && (
                <p className="text-xs text-slate-300 bg-slate-950/50 p-2 rounded-xl border border-slate-800/60">
                  ملاحظات: {appt.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">الطبيب: {appt.doctor_name}</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold">
                  {appt.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* BOOKING MODAL WITH CONFLICT CHECKING */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleBookAppointment} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">حجز موعد كشف جديد (فحص التعارض التلقائي)</h3>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">اسم المريض *</label>
              <input
                type="text"
                required
                placeholder="اسم المريض بالكامل"
                value={formData.patient_name}
                onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">رقم التليفون *</label>
              <input
                type="text"
                required
                placeholder="01012345678"
                value={formData.patient_phone}
                onChange={(e) => setFormData({ ...formData, patient_phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">التاريخ</label>
                <input
                  type="date"
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">توقيت الموعد</label>
                <select
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">نوع الحجز</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, booking_type: 'IN_CLINIC' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.booking_type === 'IN_CLINIC'
                      ? 'bg-cyan-500 text-white border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  حجز داخلي بالعيادة
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, booking_type: 'REMOTE' })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    formData.booking_type === 'REMOTE'
                      ? 'bg-purple-500 text-white border-purple-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  حجز أونلاين عن بُعد
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs"
              >
                تأكيد الحجز ومراجعة عدم التعارض
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-3 rounded-xl font-bold bg-slate-800 text-slate-300 text-xs"
              >
                إلغاء
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
