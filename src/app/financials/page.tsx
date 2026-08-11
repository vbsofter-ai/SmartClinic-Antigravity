'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  PlusCircle, 
  FileSpreadsheet, 
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function FinancialsPage() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalPurchases: 0,
    netProfit: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);

  // Add Transaction Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'REVENUE',
    category: 'كشف وعيادة',
    amount: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFinancials();
  }, []);

  const fetchFinancials = async () => {
    try {
      const res = await fetch('/api/financials?clinicId=1');
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setTransactions(data.transactions);
      }
    } catch (e) {}
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) return;

    try {
      const res = await fetch('/api/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, clinic_id: 1 })
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setFormData({
          type: 'REVENUE',
          category: 'كشف وعيادة',
          amount: '',
          description: '',
          transaction_date: new Date().toISOString().split('T')[0]
        });
        fetchFinancials();
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-cyan-400" />
            <span>النظام المالي وإدارة الإيرادات والمصروفات</span>
          </h1>
          <p className="text-xs text-slate-400">متابعة الأرباح والخسائر، فواتير المشتريات، والميزانية اليومية والشهرية للعيادة</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تسجيل معاملة مالية جديدة</span>
        </button>
      </div>

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenues */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي الإيرادات</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {summary.totalRevenue.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-500 block">إجمالي التحصيلات النقدية والأونلاين</span>
        </div>

        {/* Total Expenses */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي المصروفات</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400">
            {summary.totalExpenses.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-500 block">فواتير الكهرباء والإنترنت والصيانة</span>
        </div>

        {/* Total Purchases */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي المشتريات الطبية</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400">
            {summary.totalPurchases.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-slate-500 block">مستلزمات وأجهزة وطباعة روشتات</span>
        </div>

        {/* Net Profit */}
        <div className="p-6 rounded-3xl glass-card border border-cyan-500/30 space-y-2 bg-gradient-to-br from-cyan-950/40 to-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400">صافي الأرباح (Net Profit)</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {summary.netProfit.toLocaleString()} ج.م
          </div>
          <span className="text-[11px] text-cyan-300 block font-semibold">الميزانية الخالية من الالتزامات</span>
        </div>

      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
          <span>سجل المعاملات والحركات المالية اليومية</span>
        </h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-right text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">التاريخ</th>
                <th className="p-3">نوع المعاملة</th>
                <th className="p-3">البند / التصنيف</th>
                <th className="p-3">المبلغ</th>
                <th className="p-3">الوصف والتفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono text-slate-400">{tx.transaction_date}</td>
                  <td className="p-3 font-bold">
                    {tx.type === 'REVENUE' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        إيراد (+)
                      </span>
                    )}
                    {tx.type === 'EXPENSE' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        مصروف (-)
                      </span>
                    )}
                    {tx.type === 'PURCHASE' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        مشتريات (-)
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-bold text-white">{tx.category}</td>
                  <td className="p-3 font-mono font-bold text-sm">
                    {parseFloat(tx.amount).toLocaleString()} ج.م
                  </td>
                  <td className="p-3 text-slate-400">{tx.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddTransaction} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-white">تسجيل الحركة المالية في العيادة</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">نوع المعاملة</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              >
                <option value="REVENUE">إيراد (+) (كشف، استشارة، تحاليل)</option>
                <option value="EXPENSE">مصروف (-) (إيجار، كهرباء، إنترنت)</option>
                <option value="PURCHASE">مشتريات (-) (مستلزمات طبية وأجهزة)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">التصنيف / البند</label>
              <input
                type="text"
                required
                placeholder="مثال: كشف جديد / أدوات طبية"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">المبلغ (بالجنيه)</label>
              <input
                type="number"
                required
                placeholder="350"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">الوصف والتفاصيل</label>
              <input
                type="text"
                placeholder="تفاصيل العملية المالية"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs"
              >
                تأكيد وحفظ الحركة المالية
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-3 rounded-xl font-bold bg-slate-800 text-slate-300 text-xs"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
