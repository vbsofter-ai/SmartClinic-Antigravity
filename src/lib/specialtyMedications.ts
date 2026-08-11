export interface MedicationPreset {
  id: string;
  name: string;
  specialty: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  notes: string;
}

export const SPECIALTY_MEDICATIONS: Record<string, MedicationPreset[]> = {
  "باطنة (Internal Medicine)": [
    { id: "int_1", name: "Amoxicillin / Clavulanate 1g", specialty: "باطنة", dosage: "1 قرص", frequency: "كل 12 ساعة", timing: "بعد الأكل", duration: "7 أيام", notes: "مضاد حيوي واسع المجال" },
    { id: "int_2", name: "Omeprazole 20mg", specialty: "باطنة", dosage: "1 كبسولة", frequency: "مرة يومياً", timing: "قبل الإفطار بـ 30 دقيقة", duration: "14 يوم", notes: "لحماية وتخفيف حموضة المعدة" },
    { id: "int_3", name: "Metformin 500mg", specialty: "باطنة", dosage: "1 قرص", frequency: "مرتان يومياً", timing: "مع وجبة الطعام", duration: "مستمر", notes: "لتنظيم مستوى السكر في الدم" },
    { id: "int_4", name: "Paracetamol 500mg", specialty: "باطنة", dosage: "1-2 قرص", frequency: "عند اللزوم (كل 6 ساعات)", timing: "بعد الأكل", duration: "5 أيام", notes: "مسكن خفيف ومخفض للحرارة" },
    { id: "int_5", name: "Spironolactone 25mg", specialty: "باطنة", dosage: "1 قرص", frequency: "مرة صباحاً", timing: "بعد الإفطار", duration: "30 يوم", notes: "مدر للبول ومخفف للانتفاخ" }
  ],
  "أطفال (Pediatrics)": [
    { id: "ped_1", name: "Cefprozil Syrup 250mg/5ml", specialty: "أطفال", dosage: "5 مل", frequency: "كل 12 ساعة", timing: "بعد الأكل", duration: "7 أيام", notes: "مضاد حيوي لطيف للأطفال" },
    { id: "ped_2", name: "Ibuprofen Oral Suspension 100mg/5ml", specialty: "أطفال", dosage: "5 مل", frequency: "عند اللزوم (كل 8 ساعات)", timing: "بعد الأكل", duration: "3 أيام", notes: "مسكن وخافض حرارة للأطفال" },
    { id: "ped_3", name: "Simethicone Drops", specialty: "أطفال", dosage: "10 قطرات", frequency: "3 مرات يومياً", timing: "بعد الرضاعة", duration: "5 أيام", notes: "لتخفيف مغص وغازات الرضع" },
    { id: "ped_4", name: "Zinc Sulfate Drops 10mg", specialty: "أطفال", dosage: "1 مل", frequency: "مرة يومياً", timing: "بين الوجبات", duration: "14 يوم", notes: "مكمل غذائي بعد النزلات المعوية" }
  ],
  "قلب وأوعية دموية (Cardiology)": [
    { id: "card_1", name: "Atorvastatin 20mg", specialty: "قلب", dosage: "1 قرص", frequency: "مرة واحدة مسائاً", timing: "قبل النوم", duration: "مستمر", notes: "لتخفيض الكوليسترول والدهون الثلاثية" },
    { id: "card_2", name: "Amlodipine 5mg", specialty: "قلب", dosage: "1 قرص", frequency: "مرة صباحاً", timing: "بعد الإفطار", duration: "مستمر", notes: "لعلاج ضغط الدم المرتفع" },
    { id: "card_3", name: "Bisoprolol 5mg (Concor)", specialty: "قلب", dosage: "1 قرص", frequency: "مرة صباحاً", timing: "قبل الإفطار", duration: "مستمر", notes: "لتنظيم ضربات القلب وضغط الدم" },
    { id: "card_4", name: "Aspirin Protect 100mg", specialty: "قلب", dosage: "1 قرص", frequency: "مرة يومياً", timing: "بعد الغداء", duration: "مستمر", notes: "لحماية وتجلط الأوعية الدموية" }
  ],
  "عظام ومفاصل (Orthopedics)": [
    { id: "orth_1", name: "Celecoxib 200mg", specialty: "عظام", dosage: "1 كبسولة", frequency: "مرتان يومياً", timing: "بعد الأكل", duration: "10 أيام", notes: "مضاد لالتهاب المفاصل وآلام الظهر" },
    { id: "orth_2", name: "Calcium + Vitamin D3 1000IU", specialty: "عظام", dosage: "1 قرص", frequency: "مرة يومياً", timing: "بعد الغداء", duration: "60 يوم", notes: "تقوية العظام ومقاومة الهشاشة" },
    { id: "orth_3", name: "Methocarbamol 500mg (Muscle Relaxant)", specialty: "عظام", dosage: "1 قرص", frequency: "3 مرات يومياً", timing: "بعد الأكل", duration: "5 أيام", notes: "باسط للعضلات وتخفيف التشنجات" }
  ],
  "جلدية وتجميل (Dermatology)": [
    { id: "derm_1", name: "Fusidic Acid Cream 2%", specialty: "جلدية", dosage: "دهان موضعي", frequency: "مرتان يومياً", timing: "بعد تنظيف البشرة", duration: "7 أيام", notes: "كريم مضاد بكتيري للالتهابات" },
    { id: "derm_2", name: "Desloratadine 5mg", specialty: "جلدية", dosage: "1 قرص", frequency: "مرة مسائاً", timing: "قبل النوم", duration: "10 أيام", notes: "مضاد للحساسية والحكة الجلدية" },
    { id: "derm_3", name: "Hydrocortisone 1% Ointment", specialty: "جلدية", dosage: "دهان خفيف", frequency: "مرة يومياً", timing: "مسائاً", duration: "5 أيام", notes: "لتخفيف الأكزيما والتهيج الحاد" }
  ],
  "طب وجراحة الأسنان (Dentistry)": [
    { id: "dent_1", name: "Amoxicillin 500mg + Metronidazole 250mg", specialty: "أسنان", dosage: "1 قرص من كل نوع", frequency: "كل 8 ساعات", timing: "بعد الأكل", duration: "5 أيام", notes: "علاج التهابات الخراج واللثة" },
    { id: "dent_2", name: "Ketoprofen 150mg SR", specialty: "أسنان", dosage: "1 قرص", frequency: "مرتان يومياً", timing: "بعد الأكل مباشرة", duration: "4 أيام", notes: "مسكن حاد لآلام الأسنان" },
    { id: "dent_3", name: "Chlorhexidine 0.12% Mouthwash", specialty: "أسنان", dosage: "مضمضة 15 مل", frequency: "مرتان يومياً", timing: "بعد غسيل الأسنان", duration: "7 أيام", notes: "مطهر ومضاد لبكتيريا الفم" }
  ],
  "أنف وأذن وحنجرة (ENT)": [
    { id: "ent_1", name: "Ciprofloxacin Eye/Ear Drops 0.3%", specialty: "أنف وأذن", dosage: "3 قطرات بالحرارة", frequency: "كل 8 ساعات", timing: "في الأذن المتضررة", duration: "7 أيام", notes: "قطرة لعلاج التهابات الأذن" },
    { id: "ent_2", name: "Fluticasone Furoate Nasal Spray", specialty: "أنف وأذن", dosage: "بختان في كل فتحة أنف", frequency: "مرة يومياً", timing: "صباحاً", duration: "30 يوم", notes: "بخاخ لعلاج حساسية الأنسجة والجيوب" }
  ],
  "نساء وتوليد (Gynecology)": [
    { id: "gyn_1", name: "Folic Acid 5mg", specialty: "نساء وتوليد", dosage: "1 قرص", frequency: "مرة يومياً", timing: "بعد الإفطار", duration: "مستمر", notes: "حمض الفوليك لدعم صحة الحامل والجنين" },
    { id: "gyn_2", name: "Ferrous Gluconate 300mg (Iron)", specialty: "نساء وتوليد", dosage: "1 كبسولة", frequency: "مرة يومياً", timing: "مع عصير برتقال قبل الأكل", duration: "60 يوم", notes: "لعلاج فقر الدم والأنيميا" }
  ]
};

export const CLINIC_SPECIALTIES = [
  "عام / ممارس عام (General Practice)",
  "باطنة (Internal Medicine)",
  "أطفال (Pediatrics)",
  "قلب وأوعية دموية (Cardiology)",
  "عظام ومفاصل (Orthopedics)",
  "جلدية وتجميل (Dermatology)",
  "طب وجراحة الأسنان (Dentistry)",
  "أنف وأذن وحنجرة (ENT)",
  "نساء وتوليد (Gynecology)",
  "مخ وأعصاب (Neurology)",
  "أمراض العيون (Ophthalmology)"
];
