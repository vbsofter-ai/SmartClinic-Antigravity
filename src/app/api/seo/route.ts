import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generateSEOGeoContent } from '@/lib/seoGeoEngine';

export async function GET() {
  try {
    const seoData = generateSEOGeoContent();

    // Log SEO daily optimization trigger
    const today = new Date().toISOString().split('T')[0];
    await pool.query(`
      INSERT INTO seo_keywords_log (log_date, keywords_generated, schema_updated, notes)
      VALUES (?, ?, 1, 'Daily automated SEO/GEO/AEO keyword injection & schema sync completed')
      ON DUPLICATE KEY UPDATE keywords_generated = keywords_generated + 1
    `, [today, seoData.keywords.length]);

    return NextResponse.json({
      success: true,
      lastOptimized: new Date().toISOString(),
      seoData,
      message: 'تم تحديث وتحسين الكلمات المفتاحية و SEO / GEO / AEO تلقائياً بنجاح!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
