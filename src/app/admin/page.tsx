'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Megaphone, 
  CreditCard, 
  Globe2, 
  Building2, 
  Users, 
  DollarSign, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function AdminPage() {
  const [settings, setSettings] = useState<any>({
    adsense_enabled: 'true',
    adsense_publisher_id: 'pub-9876543210987654',
    adsense_terms_accepted: 'true',
    adsterra_enabled: 'true',
    adsterra_banner_code: '<div class="p-4 bg-slate-800 text-center text-xs text-cyan-400 border border-cyan-500/30 rounded-lg">إعلان Adsterra المعتمد للنسخة المجانية</div>',
    paypal_client_id: 'sandbox_paypal_client_id_smartclinic_123',
    paymob_api_key: 'paymob_secret_key_smartclinic_456',
    lemonsqueezy_store_id: 'smartclinic_ls_789',
    fawry_merchant_code: 'FAWRY_SMARTCLINIC_999'
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [seoResult, setSeoResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && Object.keys(data.settings).length > 0) {
          setSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      const data = await res.json();
      if (data.success) {
        setMsg(data.message);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e: any) {
      setMsg(`خطأ: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const triggerDailySEO = async () => {
    try {
      const res = await fetch('/api/seo');
      const data = await res.json();
      if (data.success) {
        setSeoResult(data);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>لوحة تحكم السوبر أدمن وإدارة المنصة</span>
          </h1>
          <p className="text-xs text-slate-400">التحكم في شبكات الإعلانات (AdSense / Adsterra)، بوابات الدفع، وتحديثات SEO / GEO / AEO اليومية</p>
        </div>

        <button
          onClick={triggerDailySEO}
          className="px-4 py-2.5 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>تشغيل محرك SEO / GEO / AEO الآن</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* SEO RUNNER RESULT */}
      {seoResult && (
        <div className="p-5 rounded-3xl bg-cyan-950/60 border border-cyan-500/40 space-y-3">
          <div className="font-bold text-sm text-cyan-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>{seoResult.message}</span>
          </div>
          <div className="text-xs text-slate-300">
            تم تحسين <strong className="text-white">({seoResult.seoData?.keywords.length})</strong> كلمة مفتاحية طبية وتوليد محتوى GEO لمزودي الذكاء الاصطناعي (ChatGPT, Gemini, Perplexity).
          </div>
        </div>
      )}

      {/* SETTINGS FORM */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* SECTION 1: ADSENSE & ADSTERRA CONTROL */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-cyan-400" />
              <span>إدارة شبكات الإعلانات (Google AdSense & Adsterra) للنسخة المجانية</span>
            </h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              تأكيد قبول شروط أدسينس
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Google AdSense Settings */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">إعلانات Google AdSense</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.adsense_enabled === 'true'}
                    onChange={(e) => setSettings({ ...settings, adsense_enabled: String(e.target.checked) })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">معرف الناشر AdSense Publisher ID</label>
                <input
                  type="text"
                  value={settings.adsense_publisher_id || ''}
                  onChange={(e) => setSettings({ ...settings, adsense_publisher_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="terms"
                  checked={settings.adsense_terms_accepted === 'true'}
                  onChange={(e) => setSettings({ ...settings, adsense_terms_accepted: String(e.target.checked) })}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500"
                />
                <label htmlFor="terms">الموافقة التلقائية والتوافق مع شروط وسياسات Google AdSense المحدثة</label>
              </div>
            </div>

            {/* Adsterra Settings */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">إعلانات Adsterra</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.adsterra_enabled === 'true'}
                    onChange={(e) => setSettings({ ...settings, adsterra_enabled: String(e.target.checked) })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">كود الإعلان / البانر الخاص بـ Adsterra</label>
                <textarea
                  rows={2}
                  value={settings.adsterra_banner_code || ''}
                  onChange={(e) => setSettings({ ...settings, adsterra_banner_code: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: PAYMENT GATEWAYS CONFIG */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-4">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <span>إعدادات وتراخيص بوابات الدفع (PayPal, Paymob, LemonSqueezy, Fawry)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">PayPal Client ID</label>
              <input
                type="text"
                value={settings.paypal_client_id || ''}
                onChange={(e) => setSettings({ ...settings, paypal_client_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Paymob API Key</label>
              <input
                type="text"
                value={settings.paymob_api_key || ''}
                onChange={(e) => setSettings({ ...settings, paymob_api_key: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">LemonSqueezy Store ID</label>
              <input
                type="text"
                value={settings.lemonsqueezy_store_id || ''}
                onChange={(e) => setSettings({ ...settings, lemonsqueezy_store_id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Fawry Merchant Code</label>
              <input
                type="text"
                value={settings.fawry_merchant_code || ''}
                onChange={(e) => setSettings({ ...settings, fawry_merchant_code: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'جاري حفظ الإعدادات...' : 'حفظ إعدادات لوحة التحكم بالكامل'}</span>
        </button>

      </form>

    </div>
  );
}
