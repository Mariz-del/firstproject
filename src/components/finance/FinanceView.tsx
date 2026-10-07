import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { FeeInvoice, FeeStatus } from '../../types/school';
import { formatKES } from '../../utils/currency';
import {
  CreditCard,
  Coins,
  Receipt,
  FileCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export const FinanceView: React.FC = () => {
  const {
    invoices,
    recordPayment,
    setSelectedInvoiceForReceipt,
    stats,
  } = useSchool();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [payingInvoice, setPayingInvoice] = useState<FeeInvoice | null>(null);

  // Payment form state
  const [payAmount, setPayAmount] = useState<number>(20000);
  const [payMethod, setPayMethod] = useState<string>('M-PESA Paybill 522123');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchSearch =
      !searchTerm ||
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleOpenPay = (inv: FeeInvoice) => {
    const balance = inv.totalAmount - inv.paidAmount;
    setPayAmount(balance);
    setPayingInvoice(inv);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice) return;

    recordPayment(payingInvoice.id, payAmount, payMethod);
    setPaymentSuccessMsg(`Payment of ${formatKES(payAmount)} recorded for ${payingInvoice.studentName}.`);
    setPayingInvoice(null);
    setTimeout(() => setPaymentSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Tuition & Fee Billing Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage semester billings, campus lab/transport fee schedules, and issue authenticated fiscal receipts.
          </p>
        </div>
      </div>

      {/* KPI Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Invoiced</span>
            <Coins className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-xl md:text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatKES(stats.feesCollectedTotal + stats.feesPendingTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {invoices.length} active term invoices issued
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Collected to Date</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl md:text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {formatKES(stats.feesCollectedTotal)}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">
            {Math.round((stats.feesCollectedTotal / (stats.feesCollectedTotal + stats.feesPendingTotal || 1)) * 100)}% collection efficiency
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Receivables</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-xl md:text-2xl font-bold font-mono tabular-nums text-rose-700">
            {formatKES(stats.feesPendingTotal)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Due by October 15, 2026
          </div>
        </div>
      </div>

      {paymentSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{paymentSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status segmented buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {[
            { id: 'all', label: 'All Invoices' },
            { id: 'paid', label: 'Fully Paid' },
            { id: 'partial', label: 'Partial' },
            { id: 'overdue', label: 'Overdue' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === item.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice # or student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Student & Cohort</th>
                <th className="py-3 px-4 text-right">Billed Amount</th>
                <th className="py-3 px-4 text-right">Paid to Date</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No fee invoices match the current filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const balance = inv.totalAmount - inv.paidAmount;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-700">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{inv.studentName}</div>
                        <div className="text-[11px] text-slate-400">{inv.grade}</div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900 font-medium">
                        {formatKES(inv.totalAmount)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 font-medium">
                        {formatKES(inv.paidAmount)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold">
                        {balance === 0 ? (
                          <span className="text-slate-400">KSh 0</span>
                        ) : (
                          <span className="text-rose-700">{formatKES(balance)}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {inv.dueDate}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold capitalize ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-800'
                              : inv.status === 'partial'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {balance > 0 && (
                            <button
                              onClick={() => handleOpenPay(inv)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
                            >
                              Collect Fee
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoiceForReceipt(inv)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 border border-slate-200"
                          >
                            <Receipt className="w-3.5 h-3.5 text-slate-500" />
                            <span>Receipt</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-slate-900">
              Record Fee Payment
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Invoice #{payingInvoice.invoiceNumber} · {payingInvoice.studentName} ({payingInvoice.grade})
            </p>

            <form onSubmit={handleExecutePayment} className="mt-4 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Outstanding Balance:</span>
                <span className="text-base font-bold font-mono text-rose-700">
                  {formatKES(payingInvoice.totalAmount - payingInvoice.paidAmount)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Amount (KSh)
                </label>
                <input
                  type="number"
                  min="1"
                  max={payingInvoice.totalAmount - payingInvoice.paidAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="M-PESA Paybill 522123">M-PESA Paybill 522123</option>
                  <option value="M-PESA Buy Goods / Till Number">M-PESA Buy Goods / Till Number</option>
                  <option value="Equity Bank Direct Deposit">Equity Bank Direct Deposit</option>
                  <option value="KCB Bank Transfer">KCB Bank Transfer</option>
                  <option value="Co-operative Bank Direct Deposit">Co-operative Bank Direct Deposit</option>
                  <option value="Credit / Debit Card (Visa / Mastercard)">Credit / Debit Card</option>
                  <option value="Banker's Cheque / Cash (Bursar Cashier)">Banker's Cheque / Cash</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Confirm & Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
