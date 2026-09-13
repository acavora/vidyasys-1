import React, { useState } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Ticket, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck,
  MapPin,
  Clock,
  Award
} from 'lucide-react';
import { OrderRecord } from '../types';
import { downloadReceiptPdf, formatOrderTypeLabel } from '../utils/pdfReceiptGenerator';
import { VidyasysEmblem } from './VidyasysLogo';

interface ReceiptVoucherModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptVoucherModal: React.FC<ReceiptVoucherModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !order) return null;

  const pointsEarned = Math.round(order.amount * 0.1);

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadReceiptPdf(order);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const handleCopyPass = () => {
    const code = order.passCode || order.orderNumber;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="receipt-voucher-dialog"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
      >
        {/* Top Actions Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wide">Vidyasys Official Academic Voucher</span>
            <span className="text-[10px] font-bold text-blue-400 bg-slate-800 px-1.5 py-0.5 rounded">Learn, Share, Build &amp; Grow</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Generating PDF...' : 'Download PDF Receipt'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50/60">
          {/* Paper Style Voucher Container */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 relative overflow-hidden">
            {/* Watermark/Seal Accent */}
            <div className="absolute top-2 right-4 opacity-5 pointer-events-none select-none text-slate-900 font-extrabold text-7xl font-mono">
              VIT
            </div>

            {/* Receipt Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <VidyasysEmblem className="w-8 h-8" />
                  <div>
                    <div className="flex items-baseline leading-none">
                      <span className="text-base font-black tracking-tight text-[#0a2356]">Vidya</span>
                      <span className="text-base font-black tracking-tight text-[#0277fa]">sys</span>
                      <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Receipt</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Vidyalankar Educational Campus Node, Wadala (E), Mumbai - 400037
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#0277fa] font-semibold pt-1">
                  {order.collegeName}
                </p>
              </div>

              <div className="sm:text-right space-y-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {order.status === 'upcoming_session' ? 'Confirmed Pass' : order.status === 'active_rental' ? 'Active Rental' : 'Completed'}
                </span>
                <p className="font-mono text-xs font-bold text-slate-800 pt-1">
                  {order.orderNumber}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{order.date}</span>
                </p>
              </div>
            </div>

            {/* 2-Column Info Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student Profile</span>
                <p className="font-bold text-slate-900 text-sm">{order.studentName}</p>
                <p className="text-slate-600">Roll No: <strong className="text-slate-800">{order.studentRoll}</strong></p>
                <p className="text-indigo-600 truncate">{order.studentEmail}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Transaction Data</span>
                <p className="text-slate-600">Payment: <strong className="text-slate-800">{order.paymentMethod}</strong></p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pass Code:</span>
                  <button
                    onClick={handleCopyPass}
                    className="flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                    title="Click to copy pass"
                  >
                    <Ticket className="w-3 h-3" />
                    <span>{order.passCode || 'PASS-COLLEGE-892'}</span>
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>
                <p className="text-slate-500 text-[11px]">Academic ID & Pass verified</p>
              </div>
            </div>

            {/* Itemized Service Box */}
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100/80 px-4 py-2 text-slate-700 font-bold grid grid-cols-12 gap-2 text-[11px]">
                <span className="col-span-7">Academic Service & Item Description</span>
                <span className="col-span-3">Access / Venue</span>
                <span className="col-span-2 text-right">Amount</span>
              </div>

              <div className="p-4 grid grid-cols-12 gap-2 items-start bg-white">
                <div className="col-span-7 space-y-1">
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold rounded bg-indigo-50 text-indigo-700 uppercase">
                    {formatOrderTypeLabel(order.itemType)}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {order.itemTitle}
                  </h4>
                </div>

                <div className="col-span-3 text-slate-600">
                  <p className="font-medium text-slate-800">
                    {order.notesOrVenue || (order.itemType.includes('tutor') ? 'Library Pod' : 'Digital DRM Access')}
                  </p>
                </div>

                <div className="col-span-2 text-right">
                  <p className="font-bold text-slate-900 text-sm">
                    ₹{order.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg text-indigo-800">
                  <Award className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold">+{pointsEarned} Scholar Points </span>
                    <span className="text-[11px] text-indigo-700">credited to your student wallet</span>
                  </div>
                </div>

                <div className="space-y-1 sm:text-right min-w-[160px]">
                  <div className="flex justify-between sm:justify-end gap-4 text-slate-500 text-[11px]">
                    <span>Campus Subsidy:</span>
                    <span className="text-emerald-600 font-medium">₹0.00</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-4 text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Paid:</span>
                    <span className="text-indigo-900 text-base font-black">₹{order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions & Campus Verification Stamp */}
            <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Official Campus Meetup & Digital DRM License</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Present this voucher and your student ID card at the designated campus venue (Library Pods or M-Block Lab). Digital note rentals remain bound to your verified NoteBridge reader.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 text-center sm:text-left">
            Need an invoice for university reimbursement or scholarship claim? Download this PDF summary receipt.
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Downloading...' : 'Download PDF Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
