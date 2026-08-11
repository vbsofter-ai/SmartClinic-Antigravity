'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Megaphone } from 'lucide-react';

export default function AdContainer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  if (!settings) return null;

  const adsenseEnabled = settings.adsense_enabled === 'true';
  const adsterraEnabled = settings.adsterra_enabled === 'true';

  if (!adsenseEnabled && !adsterraEnabled) return null;

  return (
    <div className="my-6 max-w-7xl mx-auto px-4">
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Megaphone className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">إشعار النسخة المجانية</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">AdSense & Adsterra Active</span>
            </div>
            <p className="text-xs text-slate-400">إعلانات مفعّلة لدعم استمرارية التطبيق مجاناً (يمكن إلغاؤها عند الترقية للنسخة المدفوعة)</p>
          </div>
        </div>

        {/* Ad Units Container */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {adsenseEnabled && (
            <div className="px-4 py-2 rounded-xl bg-slate-800/90 border border-cyan-500/30 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Google AdSense ID: {settings.adsense_publisher_id}</span>
            </div>
          )}

          {adsterraEnabled && (
            <div 
              className="text-xs text-cyan-400"
              dangerouslySetInnerHTML={{ __html: settings.adsterra_banner_code || '' }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
