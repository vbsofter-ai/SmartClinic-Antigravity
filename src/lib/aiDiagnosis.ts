export interface DiagnosisSuggestion {
  condition: string;
  icdCode: string;
  confidence: number; // 0 to 100
  summary: string;
  recommendedTests: string[];
  suggestedMedications: string[];
}

export function generateAIDiagnosis(symptoms: string, vitals?: { temp?: string; bp?: string; pulse?: string }): DiagnosisSuggestion[] {
  const query = symptoms.toLowerCase();
  const suggestions: DiagnosisSuggestion[] = [];

  // Check temperature elevation
  const isFeverish = query.includes('حرارة') || query.includes('سخونية') || query.includes('fever') || (vitals?.temp && parseFloat(vitals.temp) >= 38.0);
  
  if (query.includes('صداع') || query.includes('headache')) {
    if (vitals?.bp && parseInt(vitals.bp.split('/')[0]) >= 140) {
      suggestions.push({
        condition: "ارتفاع ضغط الدم الشرياني (Hypertension)",
        icdCode: "I10",
        confidence: 88,
        summary: "صداع متكرر مصحوب بارتفاع في ضغط الدم الشرياني المقاس بالعيادة.",
        recommendedTests: ["رسم قلب (ECG)", "تحليل وظائف كلى (Creatinine & Urea)", "تحليل دهون ثلاثية وكوليسترول"],
        suggestedMedications: ["Amlodipine 5mg", "Bisoprolol 5mg"]
      });
    } else if (isFeverish) {
      suggestions.push({
        condition: "عدوى الجهاز التنفسي العلوي الحادة (Acute URTI)",
        icdCode: "J06.9",
        confidence: 85,
        summary: "أعراض ارتفاع الحرارة والصداع تشير إلى التهاب فيروسي أو بكتيري بالجهاز التنفسي.",
        recommendedTests: ["صورة دم كاملة (CBC)", "مسحة حلق (Throat Swab)"],
        suggestedMedications: ["Paracetamol 500mg", "Amoxicillin / Clavulanate 1g"]
      });
    } else {
      suggestions.push({
        condition: "صداع التوتر النصفى أو العصبى (Tension / Migraine Headache)",
        icdCode: "G44.2",
        confidence: 80,
        summary: "صداع ناتج عن التوتر الإجهادي أو الشقيقة.",
        recommendedTests: ["فحص قاع العين", "قياس قياسي لمستوى السكر في الدم"],
        suggestedMedications: ["Ketoprofen 150mg", "Paracetamol 500mg"]
      });
    }
  }

  if (query.includes('كحة') || query.includes('سعال') || query.includes('cough') || query.includes('ضيق تنفس')) {
    suggestions.push({
      condition: "التهاب الشعب الهوائية الحاد (Acute Bronchitis)",
      icdCode: "J20.9",
      confidence: 86,
      summary: "سعال حاد مع احتمالية تهيج في الشعب الهوائية.",
      recommendedTests: ["أشعة سينية على الصدر (Chest X-Ray)", "مستوى أكسجين الدم (SpO2)"],
      suggestedMedications: ["Cefprozil 500mg", "موسع شعب هوائية (Salbutamol Spray)"]
    });
  }

  if (query.includes('بطن') || query.includes('مغص') || query.includes('إسهال') || query.includes('ترجيع') || query.includes('معدة')) {
    suggestions.push({
      condition: "التهاب المعدة والأمعاء الحاد / نزلات معوية (Acute Gastroenteritis)",
      icdCode: "A09",
      confidence: 89,
      summary: "تقلصات واضطراب في الجهاز الهضمي مع احتمال نزلة معوية أو بكتيرية.",
      recommendedTests: ["تحليل براز كامل (Stool Analysis)", "تحليل أملاح ومؤشرات جفاف"],
      suggestedMedications: ["Metronidazole 500mg", "Omeprazole 20mg", "محلول تعويض الجفاف"]
    });
  }

  if (query.includes('ألم بالظهر') || query.includes('مفاصل') || query.includes('رقبة') || query.includes('joint pain')) {
    suggestions.push({
      condition: "التهاب المفاصل والفقرات الفقري (Lumbar Spondylosis / Arthritis)",
      icdCode: "M47.8",
      confidence: 84,
      summary: "آلام في الجهاز العضلي الهيكلي الناتج عن الإجهاد أو الالتهاب المفصلي.",
      recommendedTests: ["أشعة رنين مغناطيسي أو سينية على الفقرات (X-Ray Spine)", "تحليل سرعة الترسيب (ESR)"],
      suggestedMedications: ["Celecoxib 200mg", "Methocarbamol 500mg (باسط عضلات)"]
    });
  }

  if (query.includes('حرقان بول') || query.includes('مغص كلوى') || query.includes('جناب')) {
    suggestions.push({
      condition: "التهاب مجرى البول والحصوات الكلوية (Urinary Tract Infection / Renal Colic)",
      icdCode: "N39.0",
      confidence: 90,
      summary: "أعراض حرقان بالبول وألم في الخصر تشير إلى التهاب بول أو أملاح كلوية.",
      recommendedTests: ["تحليل بول كامل (Urine Analysis)", "موجات صوتية على البطن والحوض (Abdominal US)"],
      suggestedMedications: ["Ciprofloxacin 500mg", "فوار يوريفين للأملاح"]
    });
  }

  // Default fallback if no specific match
  if (suggestions.length === 0) {
    suggestions.push({
      condition: "فحص تقييمي عام - أعراض غير محددة (General Evaluation)",
      icdCode: "Z00.0",
      confidence: 75,
      summary: "أعراض سريرية تتطلب فحصاً فيزيائياً وملاحظة العلامات الحيوية.",
      recommendedTests: ["تحليل صورة دم كاملة (CBC)", "تحليل سكر عشوائي (RBS)"],
      suggestedMedications: ["Paracetamol 500mg (عند اللزوم)", "مكملات فيتامين سي وزينك"]
    });
  }

  return suggestions;
}
