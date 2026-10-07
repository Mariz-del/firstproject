import React from 'react';
import { useSchool } from '../../context/SchoolContext';
import { formatKES } from '../../utils/currency';
import {
  CreditCard,
  Printer,
  X,
  CheckCircle2,
  Coins,
  ShieldCheck,
} from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedInvoiceForReceipt, setSelectedInvoiceForReceipt } = useSchool();

  if (!selectedInvoiceForReceipt) return null;

  const inv = selectedInvoiceForReceipt;
  const balance = inv.totalAmount - inv.paidAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
        {/* Controls - Hidden in print */}
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Official Bursar Payment Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={() => setSelectedInvoiceForReceipt(null)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Receipt Content */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 uppercase">
                JARAMOGI OGINGA ODINGA UNIVERSITY OF SCIENCE AND TECHNOLOGY
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Directorate of Finance & Accounts · Bursar Cashier Office
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                KRA PIN / Tax Reg ID: P051829103K · Main Campus Bondo, Kenya
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Official Payment Receipt
              </div>
              <div className="text-xs font-mono font-bold text-slate-900 mt-2">
                {inv.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Date: {inv.lastPaymentDate || inv.dueDate}
              </div>
            </div>
          </div>

          {/* Student details */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500">Student Account:</span>{' '}
              <strong className="text-slate-900 text-sm">{inv.studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Enrolled Grade:</span>{' '}
              <span className="font-semibold text-slate-800">{inv.grade}</span>
            </div>
            <div>
              <span className="text-slate-500">Fiscal Status:</span>{' '}
              <span className="font-bold text-emerald-700 uppercase">{inv.status}</span>
            </div>
          </div>

          {/* Line items table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-right font-mono">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inv.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-4 text-slate-800">{item.description}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-900 font-medium">
                      {formatKES(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end space-y-1.5 text-xs pt-2">
            <div className="flex justify-between w-72 text-slate-600">
              <span>Gross Tuition Charges:</span>
              <span className="font-mono tabular-nums font-semibold">{formatKES(inv.totalAmount)}</span>
            </div>
            <div className="flex justify-between w-72 text-emerald-700 font-semibold">
              <span>Total Amount Remitted:</span>
              <span className="font-mono tabular-nums font-bold">{formatKES(inv.paidAmount)}</span>
            </div>
            <div className="flex justify-between w-72 text-slate-900 font-bold border-t border-slate-200 pt-2 text-sm">
              <span>Outstanding Balance:</span>
              <span className="font-mono tabular-nums text-slate-950">
                {balance === 0 ? 'KSh 0' : formatKES(balance)}
              </span>
            </div>
          </div>

          {/* Payment Method & Authorization */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500">Authorized Payment Instrument:</div>
              <div className="font-semibold text-slate-800">
                {inv.paymentMethod || 'M-PESA Paybill 522123 / Bank Slip'}
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Electronic Receipt · JOOUST Bursar Office</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
