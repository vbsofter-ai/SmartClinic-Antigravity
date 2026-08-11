'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Stethoscope, 
  Calendar, 
  Users, 
  FileText, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  PlusCircle, 
  Clock,
  Layers,
  CreditCard
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [clinic, setClinic] = useState<any>(null);

  useEffect(() => {
    fetch('/api/clinics')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.clinics.length > 0) {
          setClinic(data.clinics[0]);
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/', icon: Sparkles },
    { name: 'شاشة الطبيب', href: '/doctor-dashboard', icon: Stethoscope },
    { name: 'حجز المواعيد', href: '/appointments', icon: Calendar },
    { name: 'سجل المرضى', href: '/patients', icon: Users },
    { name: 'الروشتات', href: '/prescriptions', icon: FileText },
    { name: 'المالية والحسابات', href: '/financials', icon: DollarSign },
    { name: 'الاشتراكات والدفع', href: '/pricing', icon: CreditCard },
    { name: 'لوحة الأدمن', href: '/admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/90 border-b border-slate-800 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Clinic Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  SmartClinic
                </span>
                <span className="block text-xs text-cyan-400 font-medium">نظام العيادات الذكي</span>
              </div>
            </Link>

            {clinic && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-200">{clinic.name}</span>
                <span className="text-slate-400">({clinic.specialty?.split(' ')[0]})</span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* CTA & Trial Badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>فترة تجريبية مجانية (14 يوماً)</span>
            </div>

            <Link
              href="/onboarding"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>فتح عيادة جديدة</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
