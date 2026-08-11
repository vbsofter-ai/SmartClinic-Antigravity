'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, HeartPulse, ShieldAlert, FileText, Plus } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    fetch('/api/prescriptions?clinicId=1')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.prescriptions.length > 0) {
          // Extract unique patient list
          const pMap = new Map();
          data.prescriptions.forEach((rx: any) => {
            if (!pMap.has(rx.patient_id)) {
              pMap.set(rx.patient_id, {
                id: rx.patient_id,
                name: rx.patient_name,
                patient_code: rx.patient_code,
                age: rx.age || 35,
                gender: rx.gender || 'غير محدد',
                phone: rx.clinic_phone || '01012345678',
                prescriptions: [rx]
              });
            } else {
              pMap.get(rx.patient_id).prescriptions.push(rx);
            }
          });
          const list = Array.from(pMap.values());
          setPatients(list);
          if (list.length > 0) setSelectedPatient(list[0]);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPatients = patients.filter(p => 
    p.name.includes(searchTerm) || p.patient_code.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span>سجل المرضى والملف الطبي التاريخي</span>
          </h1>
          <p className="text-xs text-slate-400">متابعة السجل المرضي الكامل، التشخيصات السابقة، الروشتات الصادرة، والأمراض المزمنة</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            placeholder="بحث باسم المريض أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PATIENT LIST (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs glass-panel rounded-3xl border border-slate-800">
              لا يوجد مرضى مسجلين حتى الآن
            </div>
          ) : (
            filteredPatients.map((p) => {
              const isSelected = selectedPatient?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`p-4 rounded-3xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {p.patient_code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">العمر: {p.age} سنة | التليفون: {p.phone}</p>
                </div>
              );
            })
          )}
        </div>

        {/* PATIENT PROFILE DETAILED TIMELINE (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedPatient ? (
            <div className="space-y-6">
              
              {/* Profile Card */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{selectedPatient.name}</h2>
                      <p className="text-xs text-slate-400">كود المريض: {selectedPatient.patient_code}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">العمر</span>
                    <span className="font-bold text-white">{selectedPatient.age} سنة</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">الجنس</span>
                    <span className="font-bold text-white">{selectedPatient.gender}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">فصيلة الدم</span>
                    <span className="font-bold text-rose-400">A+</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">الأمراض المزمنة</span>
                    <span className="font-bold text-amber-400">ارتفاع ضغط الدم</span>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>تاريخ الزيارات والروشتات الإلكترونية</span>
                </h3>

                <div className="space-y-4">
                  {selectedPatient.prescriptions.map((rx: any) => (
                    <div key={rx.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                        <span className="font-bold text-cyan-400">تاريخ الكشف: {rx.visit_date}</span>
                        <span className="text-slate-400">الطبيب المعالج: {rx.doctor_name}</span>
                      </div>

                      <div className="text-xs space-y-1">
                        <div>
                          <strong className="text-slate-300">التشخيص: </strong>
                          <span className="text-white font-bold">{rx.diagnosis || 'فحص عام'}</span>
                        </div>
                        {rx.symptoms && (
                          <div>
                            <strong className="text-slate-300">الأعراض: </strong>
                            <span className="text-slate-400">{rx.symptoms}</span>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      {rx.items && rx.items.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[11px] font-bold text-cyan-300 block mb-1.5">الأدوية المكتوبة في هذه الروشتة:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {rx.items.map((item: any, idx: number) => (
                              <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                                <span className="font-bold text-white">{item.drug_name}</span>
                                <span className="text-slate-400 text-[11px]">{item.dosage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 text-slate-400 text-sm">
              اختر مريضاً من القائمة الجانبية لعرض ملفه الطبي وسجل روشتاته
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
