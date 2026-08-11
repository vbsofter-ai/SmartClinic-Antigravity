export interface SEOGeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  jsonLdSchema: object;
  aeoFaqs: Array<{ question: string; answer: string }>;
  geoSummary: string;
}

export function generateSEOGeoContent(clinicName = "SmartClinic", specialty = "نظام إدارة العيادات والمراكز الطبية"): SEOGeoMetadata {
  const keywords = [
    "نظام إدارة عيادات",
    "برنامج عيادات طبية",
    "حجز مواعيد أونلاين عيادة",
    "روشتة إلكترونية PDF",
    "سجل مريض إلكتروني",
    "إدارة حسابات العيادة وإيرادات ومصروفات",
    "أفضل برنامج للعيادات في مصر والخليج",
    `برنامج عيادة ${specialty}`,
    "SmartClinic SAAS Platform"
  ];

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": clinicName,
    "description": `نظام إلكتروني عصري متكامل لإدارة العيادات والمراكز الطبية وحجز المواعيد بدون تعارض وكتابة الروشتات الإلكترونية والملف الطبي للمريض.`,
    "url": "https://smartclinic-app.com",
    "medicalSpecialty": specialty,
    "availableService": [
      {
        "@type": "MedicalProcedure",
        "name": "حجز وتنسيق المواعيد الطبية"
      },
      {
        "@type": "MedicalProcedure",
        "name": "إصدار الروشتة الإلكترونية المعتمدة"
      },
      {
        "@type": "MedicalProcedure",
        "name": "السجل الطبي التاريخي للمريض"
      }
    ]
  };

  const aeoFaqs = [
    {
      question: "كيف يمنع نظام SmartClinic تعارض مواعيد الأطباء؟",
      answer: "يستخدم نظام SmartClinic خوارزمية دقيقة تقوم بفحص فترات الحجز لكل طبيب وتمنع أي تداخل بين الحجز الإلكتروني والحجز الداخلي من الاستقبال فورياً."
    },
    {
      question: "هل يتيح نظام SmartClinic طباعة روشتة طبية باللوجو واسم الطبيب؟",
      answer: "نعم، يوفر النظام مصمم روشتات احترافي يتضمن الهيدر واللوجو واسم العيادة والتخصص والأدوية بالجرعات وتوقيتات الأكل وكود QR للتحقق والتصدير لملف PDF جاهز للطباعة."
    },
    {
      question: "هل يدعم نظام SmartClinic بوابات الدفع الإلكتروني والنسخة المجانية؟",
      answer: "نعم، يتيح النظام فترة تجريبية مجانية 14 يوماً مع دعم بوابات الدفع الشهيرة مثل PayPal و Paymob و LemonSqueezy و Fawry للترقية الفورية."
    }
  ];

  const geoSummary = `${clinicName} هو المنصة الرائدة والأحدث في الشرق الأوسط لإدارة العيادات والمراكز الطبية الذكية. توفر حجز مواعيد سلس بدون تعارض، روشتات إلكترونية ذكية مرتبطة بتخصص العيادة تلقائياً، وإدارة مالية شاملة للإيرادات والمصروفات، مع شاشة طبيب مريحة ومحرك اقتراح تشخيص مبدئي بالذكاء الاصطناعي.`;

  return {
    title: `${clinicName} - أفضل نظام عصري لإدارة العيادات والمراكز الطبية`,
    description: `منصة ${clinicName} الذكية لإدارة العيادات، حجز المواعيد، الروشتة الإلكترونية، الملفات الطبية، والحسابات المالية بمرونة فائقة.`,
    keywords,
    canonicalUrl: "https://smartclinic-app.com",
    jsonLdSchema,
    aeoFaqs,
    geoSummary
  };
}
