import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { SubjectBranch, CampusId, Campus } from '../types';

interface HeroBannerProps {
  activeTab: 'notes' | 'projects' | 'tutors' | 'resources' | 'partnership';
  setActiveTab: (tab: 'notes' | 'projects' | 'tutors' | 'resources' | 'partnership') => void;
  selectedBranch: SubjectBranch | 'All';
  setSelectedBranch: (branch: SubjectBranch | 'All') => void;
  selectedCampus?: CampusId;
  setSelectedCampus?: (campus: CampusId) => void;
  campuses?: Campus[];
  onOpenEarningsModal: () => void;
  onOpenAiCopilot?: () => void;
  onOpenStudyRoom?: () => void;
}

const BRANCHES: (SubjectBranch | 'All')[] = [
  'All',
  'Computer Science',
  'Electronics & Comm.',
  'Mechanical',
  'Electrical',
  'Mathematics & AI',
  'Civil & Biotech',
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedBranch,
  setSelectedBranch,
  selectedCampus = 'all',
  setSelectedCampus,
}) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Campus Selection & Context Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Select Campus:
            </span>
            {setSelectedCampus && (
              <>
                <button
                  id="hero-select-vit-btn"
                  onClick={() => setSelectedCampus('vit')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedCampus === 'vit'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>⭐ Vidyalankar VIT (Degree)</span>
                </button>

                <button
                  id="hero-select-vp-btn"
                  onClick={() => setSelectedCampus('vp')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedCampus === 'vp'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>⭐ Vidyalankar VP (Polytechnic)</span>
                </button>

                <button
                  id="hero-select-all-btn"
                  onClick={() => setSelectedCampus('all')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedCampus === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span>All Colleges</span>
                </button>
              </>
            )}
          </div>

          {/* Quick stats counter */}
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <strong>1,650+</strong> Notes
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <strong>340+</strong> Project Kits
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <strong>78+</strong> Tutors
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Campus Verified
            </span>
          </div>
        </div>

        {/* Dynamic Context Header */}
        <div className="py-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#0277fa] text-xs font-bold mb-1.5">
                <span>Vidyasys Platform</span>
                <span className="text-slate-300">•</span>
                <span>Learn, Share, Build &amp; Grow</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0a2356]">
                {selectedCampus === 'vit'
                  ? 'Vidyasys • Vidyalankar Institute of Technology (VIT)'
                  : selectedCampus === 'vp'
                  ? 'Vidyasys • Vidyalankar Polytechnic (VP)'
                  : 'Vidyasys — Student Academic & Peer Exchange'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                {selectedCampus === 'vit'
                  ? 'Connecting students across VIT Wadala. Rent verified topper notes, Autonomous Mumbai University PYQs, hardware project kits, and book 1-on-1 senior tutors.'
                  : selectedCampus === 'vp'
                  ? 'Connecting students across VP Wadala. Access MSBTE K-Scheme model answers, micro-project kits, and senior peer mentors.'
                  : 'One platform where students Learn, Share, Build & Grow. Rent verified handwritten notes, hardware project kits, and connect with peer mentors.'}
              </p>
            </div>

            {/* Vidyasys 4 Pillars Badges from Official Logo */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-2.5 py-1.5 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-[#0277fa] flex items-center gap-1.5 shadow-2xs font-bold">
                <span>📖</span>
                <span>Notes Rental</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-[#059669] flex items-center gap-1.5 shadow-2xs font-bold">
                <span>⚙️</span>
                <span>Projects</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-xl bg-purple-50/90 border border-purple-200 text-xs text-[#7c3aed] flex items-center gap-1.5 shadow-2xs font-bold">
                <span>👥</span>
                <span>Tutoring</span>
              </div>
              <div className="px-2.5 py-1.5 rounded-xl bg-orange-50/90 border border-orange-200 text-xs text-[#ea580c] flex items-center gap-1.5 shadow-2xs font-bold">
                <span>🔀</span>
                <span>Resources</span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Department Filter Chips */}
        <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap mr-1">
            Department:
          </span>
          {BRANCHES.map((branch) => (
            <button
              key={branch}
              id={`branch-filter-${branch.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedBranch(branch)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                selectedBranch === branch
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100/90 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60'
              }`}
            >
              {branch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

