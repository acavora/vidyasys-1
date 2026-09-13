import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  Code, 
  Package, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Star, 
  ExternalLink, 
  FileText, 
  Clock, 
  ShoppingBag, 
  Info,
  Layers,
  Percent,
  Check
} from 'lucide-react';
import { ProjectItem } from '../types';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onConfirmPurchase: (project: ProjectItem, mode: 'rent_code' | 'rent_hardware' | 'buy_full') => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onConfirmPurchase,
}) => {
  if (!project) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'bom' | 'code' | 'terms'>('overview');
  const [purchaseMode, setPurchaseMode] = useState<'rent_code' | 'rent_hardware' | 'buy_full'>(
    project.hasHardwareKit ? 'rent_hardware' : 'rent_code'
  );

  // Price calculations
  let basePrice = 0;
  let deposit = 0;

  if (purchaseMode === 'rent_code') {
    basePrice = project.rentPricePerWeek * 2; // 2 weeks rental
  } else if (purchaseMode === 'rent_hardware') {
    basePrice = project.rentPricePerWeek * 2;
    deposit = project.hardwareKitDeposit || 1000;
  } else {
    basePrice = project.buyPrice;
  }

  const creatorShare = Math.round(basePrice * 0.9);
  const platformFee = basePrice - creatorShare;
  const totalAmount = basePrice + deposit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="project-detail-modal-dialog"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                {project.category.replace('_', ' ').toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
                {project.collegeName}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                {project.rating.toFixed(2)} Rating
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {project.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Developed by <strong className="text-slate-800">{project.author.name}</strong> • Capstone Year {project.yearCreated}
            </p>
          </div>

          <button
            id="close-project-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-white border-b border-slate-200 text-xs font-medium">
          <button
            id="proj-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-cyan-600 text-cyan-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Architecture & Highlights
          </button>

          {project.billOfMaterials && project.billOfMaterials.length > 0 && (
            <button
              id="proj-tab-bom"
              onClick={() => setActiveTab('bom')}
              className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
                activeTab === 'bom'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Hardware Bill of Materials (BOM)
            </button>
          )}

          {project.githubSnippet && (
            <button
              id="proj-tab-code"
              onClick={() => setActiveTab('code')}
              className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
                activeTab === 'code'
                  ? 'border-cyan-600 text-cyan-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Source Code Preview
            </button>
          )}

          <button
            id="proj-tab-terms"
            onClick={() => setActiveTab('terms')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer ${
              activeTab === 'terms'
                ? 'border-cyan-600 text-cyan-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rental & Escrow Terms
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-white">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  Project Description
                </h4>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  Key Features & Deliverables Included
                </h4>
                <div className="mt-2 space-y-2">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  Tech Stack & Engineering Tools
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-cyan-800 border border-slate-200 font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bom' && project.billOfMaterials && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Hardware Components List (BOM)</h4>
                  <p className="text-xs text-slate-500">All components tested and verified for hardware rental.</p>
                </div>
                {project.hasHardwareKit && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    Assembled Kit in Stock
                  </span>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="p-3">Component / Sub-Assembly</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Approx Retail Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {project.billOfMaterials.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-3 font-medium text-slate-900">{item.item}</td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-right">₹{item.approxCost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'code' && project.githubSnippet && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-800 font-medium">
                  <Code className="w-4 h-4 text-cyan-600" />
                  Verified Code Repository Excerpt
                </span>
                <span className="text-slate-500">Includes compile instructions & test suite</span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre>{project.githubSnippet}</pre>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-slate-900">Vidyasys Escrow & Deposit Protection</h5>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    For hardware kit rentals, your security deposit (₹{deposit}) is held securely in escrow and automatically refunded to your original payment method once the student creator verifies the returned kit.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Truck className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-slate-900">Campus Handover or Express Courier</h5>
                  <p className="mt-1 text-slate-600 leading-relaxed">
                    Choose safe physical handover at the campus innovation lab or student center, or request local campus courier with tracked delivery.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Options Selector */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Select Purchase or Rental Mode:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Rent Code */}
              {project.forRent && (
                <div
                  id="mode-rent-code"
                  onClick={() => setPurchaseMode('rent_code')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    purchaseMode === 'rent_code'
                      ? 'bg-cyan-50 border-cyan-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="font-semibold text-slate-700">Rent Source & Sandbox</p>
                  <p className="text-lg font-bold text-cyan-700 mt-1">
                    ₹{project.rentPricePerWeek * 2}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    14-day full repository & report access
                  </p>
                </div>
              )}

              {/* Rent Hardware Kit */}
              {project.hasHardwareKit && (
                <div
                  id="mode-rent-hardware"
                  onClick={() => setPurchaseMode('rent_hardware')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                    purchaseMode === 'rent_hardware'
                      ? 'bg-cyan-50 border-cyan-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-600 text-white uppercase">
                    Hardware Kit
                  </span>
                  <p className="font-semibold text-slate-700">Rent Physical Hardware</p>
                  <p className="text-lg font-bold text-emerald-700 mt-1">
                    ₹{project.rentPricePerWeek * 2}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    + ₹{project.hardwareKitDeposit} refundable deposit
                  </p>
                </div>
              )}

              {/* Buy Source */}
              {project.forSale && (
                <div
                  id="mode-buy-full"
                  onClick={() => setPurchaseMode('buy_full')}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    purchaseMode === 'buy_full'
                      ? 'bg-cyan-50 border-cyan-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <p className="font-semibold text-slate-700">Buy Lifetime Source</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    ₹{project.buyPrice}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Full IP transfer, CAD files, schematics
                  </p>
                </div>
              )}
            </div>

            {/* Split breakdown */}
            <div className="mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">
                  Student Team gets <strong className="text-emerald-700">90% (₹{creatorShare})</strong> • Platform escrow fee <strong className="text-cyan-700">10% (₹{platformFee})</strong>
                </span>
              </div>
              {deposit > 0 && (
                <span className="text-amber-700 text-[11px] font-medium">
                  *₹{deposit} security deposit refunded on return
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500">Total payable today:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">₹{totalAmount}</span>
              {deposit > 0 && (
                <span className="text-xs text-slate-500 font-normal">
                  (Includes ₹{deposit} refundable deposit)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-project-checkout-btn"
              onClick={() => onConfirmPurchase(project, purchaseMode)}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {purchaseMode === 'buy_full' ? 'Purchase Source Code' : 'Rent Project'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
