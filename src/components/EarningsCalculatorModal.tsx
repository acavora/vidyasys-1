import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Percent, 
  TrendingUp, 
  Coins, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface EarningsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreateListing: () => void;
}

export const EarningsCalculatorModal: React.FC<EarningsCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenCreateListing,
}) => {
  const [notesRentals, setNotesRentals] = useState<number>(25);
  const [avgNoteRentalPrice, setAvgNoteRentalPrice] = useState<number>(79);

  const [projectsCount, setProjectsCount] = useState<number>(2);
  const [avgProjectPrice, setAvgProjectPrice] = useState<number>(1399);

  const [tutorHours, setTutorHours] = useState<number>(8);
  const [tutorHourlyRate, setTutorHourlyRate] = useState<number>(350);

  // Math
  const notesRevenue = notesRentals * avgNoteRentalPrice;
  const projectRevenue = projectsCount * avgProjectPrice;
  const tutorRevenue = tutorHours * tutorHourlyRate;
  const grossMonthly = notesRevenue + projectRevenue + tutorRevenue;

  const studentTakeHome = Math.round(grossMonthly * 0.9); // 90%
  const vidyasysFee = grossMonthly - studentTakeHome; // 10%
  const semesterGross = studentTakeHome * 4; // 4 months per semester

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="earnings-calculator-dialog"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
              <Percent className="w-3.5 h-3.5 text-emerald-600" />
              Transparent 10% Commission Marketplace
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Vidyasys Business Model & Student Earnings Calculator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              See how much you can earn each semester by sharing your academic hard work with college juniors.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs bg-white">
          {/* Business Model Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">1. Notes Rentals</span>
              <p className="text-sm font-bold text-slate-900 mt-1">10% Platform Fee</p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Students earn 90% each time a junior rents notes for midsem/endsem.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">2. Project Marketplace</span>
              <p className="text-sm font-bold text-slate-900 mt-1">10% Safe Escrow</p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Rent source code or hardware prototype kits with secure security deposit escrow.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold uppercase">3. Peer Tutoring</span>
              <p className="text-sm font-bold text-slate-900 mt-1">10% Booking Fee</p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Top students set hourly rates and keep 90% with instant automated payout.
              </p>
            </div>
          </div>

          {/* Interactive Calculator Sliders */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Simulate Your Monthly Student Income
            </h3>

            {/* Slider 1: Notes */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Notes Rented per Month:
                </span>
                <span className="font-bold text-indigo-700">{notesRentals} rentals</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={notesRentals}
                onChange={(e) => setNotesRentals(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0 rentals</span>
                <span>Est. ₹{notesRevenue.toLocaleString()} gross (@ ₹{avgNoteRentalPrice}/rental)</span>
                <span>100 rentals</span>
              </div>
            </div>

            {/* Slider 2: Projects */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                  Capstone / Hardware Projects Sold or Rented:
                </span>
                <span className="font-bold text-cyan-700">{projectsCount} projects</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={projectsCount}
                onChange={(e) => setProjectsCount(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0</span>
                <span>Est. ₹{projectRevenue.toLocaleString()} gross (@ ₹{avgProjectPrice}/project)</span>
                <span>10 projects</span>
              </div>
            </div>

            {/* Slider 3: Tutoring */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex justify-between text-slate-700">
                <span className="flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Peer Tutoring Hours per Month:
                </span>
                <span className="font-bold text-emerald-700">{tutorHours} hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={tutorHours}
                onChange={(e) => setTutorHours(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>0 hrs</span>
                <span>Est. ₹{tutorRevenue.toLocaleString()} gross (@ ₹{tutorHourlyRate}/hr)</span>
                <span>30 hrs</span>
              </div>
            </div>
          </div>

          {/* Result Calculation Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-slate-50 to-indigo-50 border border-emerald-300">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <span className="text-slate-500 text-[11px] uppercase font-semibold">Your Net Monthly Payout (90%)</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1">
                  ₹{studentTakeHome.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Paid directly to your UPI/Bank</p>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] uppercase font-semibold">Est. Semester Payout (4 Mos)</span>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  ₹{semesterGross.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Covers your semester hostel/expenses</p>
              </div>

              <div>
                <span className="text-slate-500 text-[11px] uppercase font-semibold">Vidyasys 10% Platform Fee</span>
                <p className="text-xl sm:text-2xl font-bold text-indigo-700 mt-1">
                  ₹{vidyasysFee.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Covers DRM, cloud storage & escrow</p>
              </div>
            </div>
          </div>

          {/* Future Revenue Stream Explainer */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Future Roadmap Revenue (Colleges & Premium Listings)
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Beyond transaction commissions, Vidyasys expands through annual institutional partnerships with colleges (for campus-wide academic repository analytics and verified LMS integration) and featured spotlight listings for student startups and capstones.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
          >
            Close Calculator
          </button>

          <button
            id="open-listing-from-calc-btn"
            onClick={() => {
              onClose();
              onOpenCreateListing();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer"
          >
            <span>Start Listing My Notes or Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
