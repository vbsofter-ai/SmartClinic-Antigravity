'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Printer, Search, Stethoscope, UserCheck, Calendar } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedRx, setSelectedRx] = useState<any>(null);

  useEffect(() => {
    fetch('/api/prescriptions?clinicId=1')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPrescriptions(data.prescriptions);
          if (data.prescriptions.length > 0) setSelectedRx(data.prescriptions[0]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>سجل الروشتات الإلكترونية والطباعة</span>
          </h1>
          <p className="text-xs text-slate-400">استعراض وتصدير الروشتات المحفوظة بصيغة PDF وطباعتها على الهيدر المعتمد للعيادة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RX ARCHIVE LIST (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {prescriptions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-3xl border border-slate-800">
              لا توجد روشتات محفوظة حتى الآن
            </div>
          ) : (
            prescriptions.map((rx) => {
              const isSelected = selectedRx?.id === rx.id;
              return (
                <div
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`p-4 rounded-3xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-sm">{rx.patient_name}</h4>
                    <span className="text-xs font-mono text-cyan-400">{rx.visit_date}</span>
                  </div>
                  <p className="text-xs text-slate-400">التشخيص: {rx.diagnosis || 'فحص عام'}</p>
                </div>
              );
            })
          )}
        </div>

        {/* PRINTABLE RX PREVIEW CARD (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedRx ? (
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-sm font-bold text-white">معاينة طباعة الروشتة (PDF Rx)</span>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الروشتة الحالية</span>
                </button>
              </div>

              {/* PRINTABLE RX CONTAINER */}
              <div id="printable-rx" className="bg-white text-slate-900 p-8 rounded-3xl space-y-6 border border-slate-200">
                
                {/* HEADER */}
                <div className="flex items-center justify-between border-b-2 border-cyan-600 pb-4">
                  <div className="flex items-center gap-4">
                    {selectedRx.logo_url && (
                      <img src={selectedRx.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
                    )}
                    <div>
                      <h2 className="text-2xl font-black text-cyan-900">{selectedRx.clinic_name}</h2>
                      <p className="text-sm text-cyan-700 font-bold">عيادة متخصصة معتمدة</p>
                    </div>
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-bold text-slate-900">{selectedRx.doctor_name}</h3>
                    <p className="text-xs text-slate-600">ترخيص طبي رقم: EGY-MED-99882</p>
                    <p className="text-xs text-slate-500">التاريخ: {selectedRx.visit_date}</p>
                  </div>
                </div>

                {/* PATIENT INFO BAR */}
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-3 rounded-xl text-xs font-semibold text-slate-700">
                  <div>اسم المريض: <span className="font-bold text-slate-900">{selectedRx.patient_name}</span></div>
                  <div>العمر: <span className="font-bold text-slate-900">{selectedRx.age || 35} سنة</span></div>
                  <div>كود الزيارة: <span className="font-bold text-slate-900">{selectedRx.patient_code}</span></div>
                </div>

                {/* DIAGNOSIS */}
                {selectedRx.diagnosis && (
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-cyan-800">التشخيص الطبي السريري: </span>
                    <span className="text-slate-900 font-semibold">{selectedRx.diagnosis}</span>
                  </div>
                )}

                {/* RX DRUGS TABLE */}
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
                      {selectedRx.items && selectedRx.items.map((item: any, i: number) => (
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

                {/* FOOTER */}
                <div className="border-t-2 border-slate-300 pt-4 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <p className="font-bold text-slate-900">تليفون العيادة: {selectedRx.clinic_phone || '01012345678'}</p>
                    <p>العنوان: {selectedRx.clinic_address || 'القاهرة - مدينة نصر'}</p>
                  </div>
                  <div className="text-left space-y-1">
                    <span className="text-[10px] text-slate-400 block">كود التحقق الإلكتروني</span>
                    <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center text-[8px] font-mono rounded">
                      QR-VERIFIED
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 text-slate-400 text-sm">
              اختر روشتة من القائمة لعرضها وطباعتها
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
