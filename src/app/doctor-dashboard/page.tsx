'use client';

import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  UserCheck, 
  Bell, 
  Cpu, 
  Pill, 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  Activity,
  UserPlus,
  Clock,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { generateAIDiagnosis, DiagnosisSuggestion } from '@/lib/aiDiagnosis';
import { SPECIALTY_MEDICATIONS } from '@/lib/specialtyMedications';

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeAppt, setActiveAppt] = useState<any>(null);
  const [clinic, setClinic] = useState<any>(null);

  // Vitals & Symptoms
  const [vitals, setVitals] = useState({ temp: '37.2', bp: '120/80', pulse: '76' });
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [labRequests, setLabRequests] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<DiagnosisSuggestion[]>([]);

  // Prescription Items
  const [rxItems, setRxItems] = useState<any[]>([]);
  const [customDrug, setCustomDrug] = useState({
    drug_name: '',
    dosage: '1 قرص',
    frequency: 'مرتان يومياً',
    timing: 'بعد الأكل',
    duration: '7 أيام',
    notes: ''
  });

  // Alerts & Modals
  const [callAlert, setCallAlert] = useState<string | null>(null);
  const [showRxModal, setShowRxModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cRes = await fetch('/api/clinics');
      const cData = await cRes.json();
      if (cData.success && cData.clinics.length > 0) {
        setClinic(cData.clinics[0]);
      }

      const aRes = await fetch('/api/appointments?clinicId=1');
      const aData = await aRes.json();
      if (aData.success) {
        setAppointments(aData.appointments);
        if (aData.appointments.length > 0) {
          setActiveAppt(aData.appointments[0]);
        }
      }
    } catch (e) {}
  };

  // Call Next Patient Alert Trigger
  const callNextPatient = (appt: any) => {
    setActiveAppt(appt);
    setCallAlert(`تنبيه بالخارج وفي العيون: المريض التالي هو (${appt.patient_name}) - موعد: ${appt.appointment_time}`);
    
    // Play subtle chime sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}

    setTimeout(() => setCallAlert(null), 5000);
  };

  // Auto AI Diagnosis Trigger
  const handleSymptomsChange = (val: string) => {
    setSymptoms(val);
    if (val.trim().length >= 3) {
      const results = generateAIDiagnosis(val, vitals);
      setAiSuggestions(results);
    } else {
      setAiSuggestions([]);
    }
  };

  const applyAISuggestion = (sug: DiagnosisSuggestion) => {
    setDiagnosis(sug.condition);
    if (sug.recommendedTests.length > 0) {
      setLabRequests(sug.recommendedTests.join(' - '));
    }
  };

  const addPresetMedication = (med: any) => {
    setRxItems(prev => [
      ...prev,
      {
        drug_name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        timing: med.timing,
        duration: med.duration,
        notes: med.notes
      }
    ]);
  };

  const addCustomMedication = () => {
    if (!customDrug.drug_name) return;
    setRxItems(prev => [...prev, { ...customDrug }]);
    setCustomDrug({
      drug_name: '',
      dosage: '1 قرص',
      frequency: 'مرتان يومياً',
      timing: 'بعد الأكل',
      duration: '7 أيام',
      notes: ''
    });
  };

  const removeMedication = (index: number) => {
    setRxItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveRx = async () => {
    if (!activeAppt) return;
    setIsSaving(true);

    try {
      const body = {
        clinic_id: clinic?.id || 1,
        doctor_id: 1,
        patient_id: activeAppt.patient_id,
        appointment_id: activeAppt.id,
        visit_date: new Date().toISOString().split('T')[0],
        symptoms,
        diagnosis,
        lab_requests: labRequests,
        doctor_notes: doctorNotes,
        items: rxItems
      };

      const res = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setShowRxModal(true);
        fetchData();
      }
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  const currentSpecialtyMeds = SPECIALTY_MEDICATIONS[clinic?.specialty] || SPECIALTY_MEDICATIONS["باطنة (Internal Medicine)"];

  return (
    <div className="space-y-6">
      
      {/* CALL NEXT PATIENT ALERT BANNER */}
      {callAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 animate-pulse text-amber-300" />
            <span className="font-bold text-sm sm:text-base">{callAlert}</span>
          </div>
          <button onClick={() => setCallAlert(null)} className="p-1 rounded-lg hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* WORKSPACE TOP BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">شاشة الطبيب والسجل السريري (Doctor Workspace)</h1>
            <p className="text-xs text-slate-400">تصميم مريح للعين وتقليل الإجهاد مع محرك تشخيص تلقائي بالذكاء الاصطناعي</p>
          </div>
        </div>

        {/* Doctor Status Badge */}
        {clinic && (
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="font-bold text-slate-200">{clinic.doctor_name}</div>
              <div className="text-cyan-400 font-semibold">{clinic.specialty}</div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RIGHT SIDE: PATIENT QUEUE (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <span>قائمة الانتظار بالخارج</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {appointments.length} مريض
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">لا يوجد مرضى في الانتظار حالياً</div>
              ) : (
                appointments.map((appt) => {
                  const isSelected = activeAppt?.id === appt.id;
                  return (
                    <div
                      key={appt.id}
                      onClick={() => setActiveAppt(appt)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {appt.patient_code || 'PAT-100'}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          appt.booking_type === 'REMOTE'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {appt.booking_type === 'REMOTE' ? 'أونلاين عن بعد' : 'حجز العيادة'}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm mb-1">{appt.patient_name}</h4>
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{appt.appointment_time}</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            callNextPatient(appt);
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold transition-all border border-cyan-500/30 flex items-center gap-1"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>تنبيه بالدور التالي</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* LEFT SIDE: CLINICAL EXAMINATION & RX BUILDER (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeAppt ? (
            <div className="space-y-6">
              
              {/* Active Patient Vitals & Info Bar */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-white">{activeAppt.patient_name}</h2>
                    <p className="text-xs text-slate-400">كود المريض: {activeAppt.patient_code} | العمر: {activeAppt.age || 35} سنة | التليفون: {activeAppt.patient_phone}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    حالة الزيارة: {activeAppt.status === 'WAITING' ? 'قيد الكشف' : activeAppt.status}
                  </span>
                </div>

                {/* Vitals Inputs */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">درجة الحرارة (&deg;C)</span>
                    <input
                      type="text"
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                      className="w-full bg-transparent font-mono text-cyan-400 font-bold text-sm focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">ضغط الدم (Blood Pressure)</span>
                    <input
                      type="text"
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      className="w-full bg-transparent font-mono text-cyan-400 font-bold text-sm focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">النبض (Pulse / min)</span>
                    <input
                      type="text"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      className="w-full bg-transparent font-mono text-cyan-400 font-bold text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Symptoms Intake & AI Preliminary Auto-Diagnosis */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>الأعراض الشكوى الرئيسية (Chief Complaints)</span>
                  </h3>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                    <Cpu className="w-3.5 h-3.5 text-purple-400" />
                    <span>محرك الذكاء الاصطناعي مفعل</span>
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="مثال: يشتكي المريض من صداع حاد، سخونية مرتفعة، ومغص بالمعدة..."
                  value={symptoms}
                  onChange={(e) => handleSymptomsChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />

                {/* AI Diagnosis Suggestions Panel */}
                {aiSuggestions.length > 0 && (
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
                    <div className="text-xs font-bold text-purple-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>اقتراح التشخيص المبدئي التلقائي (Smart Preliminary Auto-Diagnosis)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {aiSuggestions.map((sug, i) => (
                        <div
                          key={i}
                          onClick={() => applyAISuggestion(sug)}
                          className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 cursor-pointer space-y-1.5 transition-all text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{sug.condition}</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">ICD: {sug.icdCode}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-tight">{sug.summary}</p>
                          <div className="text-[10px] text-cyan-400 font-semibold pt-1 border-t border-slate-800">
                            اضغط للاعتماد وإدراج الفحوصات
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diagnosis & Lab Requests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">التشخيص النهائي (Diagnosis)</label>
                    <input
                      type="text"
                      placeholder="التشخيص الطبي السريري"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">التحاليل والفحوصات المطلوبة (Labs & Imaging)</label>
                    <input
                      type="text"
                      placeholder="مثال: صورة دم كاملة CBC / رسم قلب ECG"
                      value={labRequests}
                      onChange={(e) => setLabRequests(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Prescription Builder */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Pill className="w-5 h-5 text-cyan-400" />
                    <span>جدول الأدوية والروشتة الإلكترونية</span>
                  </h3>
                  <span className="text-xs text-cyan-400 font-medium">مدرج أدوية تخصص: {clinic?.specialty}</span>
                </div>

                {/* Quick Add Preset Drugs */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold block">الأدوية المقترحة لتخصص العيادة (اضغط للإضافة الفورية):</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {currentSpecialtyMeds.map((med) => (
                      <button
                        key={med.id}
                        onClick={() => addPresetMedication(med)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-cyan-300 font-medium whitespace-nowrap transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{med.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Medication Row Input */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-300 block">إضافة دواء جديد مخصص:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    <input
                      type="text"
                      placeholder="اسم الدواء"
                      value={customDrug.drug_name}
                      onChange={(e) => setCustomDrug({ ...customDrug, drug_name: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="الجرعة (مثال: 1 قرص)"
                      value={customDrug.dosage}
                      onChange={(e) => setCustomDrug({ ...customDrug, dosage: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="التكرار (كل 12 ساعة)"
                      value={customDrug.frequency}
                      onChange={(e) => setCustomDrug({ ...customDrug, frequency: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="التوقيت (بعد الأكل)"
                      value={customDrug.timing}
                      onChange={(e) => setCustomDrug({ ...customDrug, timing: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="المدة (7 أيام)"
                      value={customDrug.duration}
                      onChange={(e) => setCustomDrug({ ...customDrug, duration: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                    <button
                      onClick={addCustomMedication}
                      className="py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>

                {/* Added Drugs Table */}
                {rxItems.length > 0 && (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-right text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">اسم الدواء</th>
                          <th className="p-3">الجرعة</th>
                          <th className="p-3">التكرار</th>
                          <th className="p-3">التوقيت</th>
                          <th className="p-3">المدة</th>
                          <th className="p-3 text-center">حذف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {rxItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            <td className="p-3 font-bold text-white">{item.drug_name}</td>
                            <td className="p-3">{item.dosage}</td>
                            <td className="p-3">{item.frequency}</td>
                            <td className="p-3">{item.timing}</td>
                            <td className="p-3">{item.duration}</td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => removeMedication(idx)}
                                className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Submit & Generate Rx Button */}
                <button
                  onClick={handleSaveRx}
                  disabled={isSaving || rxItems.length === 0}
                  className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>{isSaving ? 'جاري الحفظ...' : 'حفظ الروشتة وعرض الطباعة PDF'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-4">
              <AlertCircle className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
              <h3 className="text-xl font-bold text-white">اختر مريضاً من قائمة الانتظار للبدء بالكشف</h3>
            </div>
          )}

        </div>
      </div>

      {/* PRINTABLE RX PREVIEW MODAL */}
      {showRxModal && activeAppt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-8 space-y-6 shadow-2xl relative border border-slate-200">
            
            <button
              onClick={() => setShowRxModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* PRINTABLE RX CONTAINER */}
            <div id="printable-rx" className="space-y-6">
              
              {/* HEADER: Clinic Logo, Clinic Name, Doctor Name */}
              <div className="flex items-center justify-between border-b-2 border-cyan-600 pb-4">
                <div className="flex items-center gap-4">
                  {clinic?.logo_url && (
                    <img src={clinic.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
                  )}
                  <div>
                    <h2 className="text-2xl font-black text-cyan-900">{clinic?.name || 'عيادة الشفاء المتخصصة'}</h2>
                    <p className="text-sm text-cyan-700 font-bold">{clinic?.specialty}</p>
                  </div>
                </div>

                <div className="text-left">
                  <h3 className="text-lg font-bold text-slate-900">{clinic?.doctor_name}</h3>
                  <p className="text-xs text-slate-600">ترخيص رقم: EGY-MED-99882</p>
                  <p className="text-xs text-slate-500">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                </div>
              </div>

              {/* PATIENT INFO BAR */}
              <div className="grid grid-cols-4 gap-2 bg-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-700">
                <div>المريض: <span className="font-bold text-slate-900">{activeAppt.patient_name}</span></div>
                <div>العمر: <span className="font-bold text-slate-900">{activeAppt.age || 35} سنة</span></div>
                <div>الكود: <span className="font-bold text-slate-900">{activeAppt.patient_code}</span></div>
                <div>نوع الزيارة: <span className="font-bold text-slate-900">{activeAppt.booking_type}</span></div>
              </div>

              {/* DIAGNOSIS & SYMPTOMS SUMMARY */}
              {diagnosis && (
                <div className="text-xs space-y-1">
                  <span className="font-bold text-cyan-800">التشخيص الطبي (Diagnosis): </span>
                  <span className="text-slate-900 font-semibold">{diagnosis}</span>
                </div>
              )}

              {/* RX SYMBOL & MEDICATIONS TABLE */}
              <div className="space-y-2">
                <div className="text-3xl font-black text-cyan-800 font-serif">Rx</div>
                <table className="w-full text-right text-xs border-collapse">
                  <thead>
                    <tr className="bg-cyan-900 text-white font-bold">
                      <th className="p-2 border">اسم الدواء</th>
                      <th className="p-2 border">الجرعة</th>
                      <th className="p-2 border">التكرار</th>
                      <th className="p-2 border">التوقيت</th>
                      <th className="p-2 border">المدة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rxItems.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2 font-bold text-slate-900 border">{item.drug_name}</td>
                        <td className="p-2 border">{item.dosage}</td>
                        <td className="p-2 border">{item.frequency}</td>
                        <td className="p-2 border">{item.timing}</td>
                        <td className="p-2 border">{item.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* LAB REQUESTS */}
              {labRequests && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900">الفحوصات والتحاليل المطلوبة: </span>
                  <span className="text-amber-800">{labRequests}</span>
                </div>
              )}

              {/* FOOTER: Phone, Address, QR Code */}
              <div className="border-t-2 border-slate-300 pt-4 flex items-center justify-between text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-900">تليفون العيادة: {clinic?.phone || '01012345678'}</p>
                  <p>العنوان: {clinic?.address || 'القاهرة - مدينة نصر'}</p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-400 block">كود التحقق الإلكتروني</span>
                  <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center text-[8px] font-mono rounded">
                    QR-VERIFIED
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                <span>طباعة الروشتة / تصدير PDF</span>
              </button>
              <button
                onClick={() => setShowRxModal(false)}
                className="px-6 py-3 rounded-xl font-bold bg-slate-200 hover:bg-slate-300 text-slate-800"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
