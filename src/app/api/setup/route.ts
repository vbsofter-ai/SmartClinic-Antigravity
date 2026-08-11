import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();

    // 1. Create Tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS clinics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        doctor_name VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        logo_url TEXT,
        working_hours VARCHAR(100) DEFAULT '9:00 AM - 10:00 PM',
        slot_duration INT DEFAULT 20,
        subscription_status VARCHAR(50) DEFAULT 'TRIAL',
        trial_ends_at DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clinic_id INT NOT NULL,
        name VARCHAR(150) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        license_number VARCHAR(100),
        phone VARCHAR(50),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clinic_id INT NOT NULL,
        patient_code VARCHAR(50) NOT NULL,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        age INT,
        gender VARCHAR(20),
        blood_group VARCHAR(10),
        chronic_diseases TEXT,
        allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clinic_id INT NOT NULL,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time VARCHAR(20) NOT NULL,
        booking_type ENUM('REMOTE', 'IN_CLINIC') DEFAULT 'IN_CLINIC',
        status ENUM('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'WAITING',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clinic_id INT NOT NULL,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        appointment_id INT,
        visit_date DATE NOT NULL,
        symptoms TEXT,
        diagnosis TEXT,
        lab_requests TEXT,
        doctor_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS prescription_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        prescription_id INT NOT NULL,
        drug_name VARCHAR(255) NOT NULL,
        dosage VARCHAR(100),
        frequency VARCHAR(100),
        timing VARCHAR(100),
        duration VARCHAR(100),
        notes VARCHAR(255),
        FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS financial_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clinic_id INT NOT NULL,
        type ENUM('REVENUE', 'EXPENSE', 'PURCHASE') NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT,
        transaction_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS seo_keywords_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        log_date DATE NOT NULL,
        keywords_generated INT DEFAULT 0,
        schema_updated TINYINT(1) DEFAULT 1,
        notes VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // 2. Seed Default Settings if empty
    const [settingRows]: any = await connection.query('SELECT COUNT(*) as count FROM system_settings');
    if (settingRows[0].count === 0) {
      await connection.query(`
        INSERT INTO system_settings (setting_key, setting_value) VALUES
        ('adsense_enabled', 'true'),
        ('adsense_publisher_id', 'pub-9876543210987654'),
        ('adsense_terms_accepted', 'true'),
        ('adsterra_enabled', 'true'),
        ('adsterra_banner_code', '<div class="p-4 bg-slate-800 text-center text-xs text-cyan-400 border border-cyan-500/30 rounded-lg">إعلان Adsterra المعتمد للنسخة المجانية</div>'),
        ('paypal_client_id', 'sandbox_paypal_client_id_smartclinic_123'),
        ('paymob_api_key', 'paymob_secret_key_smartclinic_456'),
        ('lemonsqueezy_store_id', 'smartclinic_ls_789'),
        ('fawry_merchant_code', 'FAWRY_SMARTCLINIC_999');
      `);
    }

    // 3. Seed Default Demo Clinic if empty
    const [clinicRows]: any = await connection.query('SELECT COUNT(*) as count FROM clinics');
    if (clinicRows[0].count === 0) {
      const trialEnds = new Date();
      trialEnds.setDate(trialEnds.getDate() + 14);
      
      const [res]: any = await connection.query(`
        INSERT INTO clinics (name, specialty, doctor_name, phone, address, logo_url, subscription_status, trial_ends_at)
        VALUES ('عيادة الشفاء المتخصصة', 'باطنة (Internal Medicine)', 'د. محمد عاطف', '01012345678', 'القاهرة - مدينة نصر - شارع الطيران', 'https://cdn-icons-png.flaticon.com/512/3063/3063176.png', 'TRIAL', ?);
      `, [trialEnds]);

      const clinicId = res.insertId;

      // Add doctor
      await connection.query(`
        INSERT INTO doctors (clinic_id, name, specialty, license_number, phone, email)
        VALUES (?, 'د. محمد عاطف', 'باطنة (Internal Medicine)', 'EGY-MED-99882', '01012345678', 'dr.atef@smartclinic.com');
      `, [clinicId]);

      // Add sample patients
      const [p1]: any = await connection.query(`
        INSERT INTO patients (clinic_id, patient_code, name, phone, age, gender, blood_group, chronic_diseases, allergies)
        VALUES (?, 'PAT-1001', 'أحمد محمود علي', '01122334455', 42, 'ذكر', 'A+', 'ارتفاع ضغط الدم', 'لا يوجد');
      `, [clinicId]);

      const [p2]: any = await connection.query(`
        INSERT INTO patients (clinic_id, patient_code, name, phone, age, gender, blood_group, chronic_diseases, allergies)
        VALUES (?, 'PAT-1002', 'سارة عبد الله حسان', '01233445566', 29, 'أنثى', 'O+', 'لا يوجد', 'حساسية البنسلين');
      `, [clinicId]);

      // Add sample appointments
      const today = new Date().toISOString().split('T')[0];
      await connection.query(`
        INSERT INTO appointments (clinic_id, doctor_id, patient_id, appointment_date, appointment_time, booking_type, status, notes)
        VALUES 
        (?, 1, ?, ?, '10:00 AM', 'IN_CLINIC', 'WAITING', 'استشارة متابعة وتأكيد علاج الضغط'),
        (?, 1, ?, ?, '10:30 AM', 'REMOTE', 'WAITING', 'حجز عن بعد - أعراض صداع ومغص');
      `, [clinicId, p1.insertId, today, clinicId, p2.insertId, today]);

      // Add sample financial transactions
      await connection.query(`
        INSERT INTO financial_transactions (clinic_id, type, category, amount, description, transaction_date)
        VALUES 
        (?, 'REVENUE', 'كشف وعيادة', 350.00, 'إيراد كشف جديد - أحمد محمود علي', ?),
        (?, 'REVENUE', 'استشارة أونلاين', 250.00, 'إيراد كشف عن بعد - سارة عبد الله', ?),
        (?, 'EXPENSE', 'مستلزمات طبية', 120.00, 'شراء قفازات وطباعة روشتات', ?),
        (?, 'EXPENSE', 'كهرباء وإنترنت', 200.00, 'فاتورة إنترنت وتكييف العيادة', ?);
      `, [clinicId, today, clinicId, today, clinicId, today, clinicId, today]);
    }

    connection.release();
    return NextResponse.json({ success: true, message: 'SmartClinic database tables and demo seed initialized successfully!' });
  } catch (error: any) {
    console.error('Setup API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
