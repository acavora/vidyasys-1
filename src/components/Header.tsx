import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Share2, 
  Building2, 
  PlusCircle, 
  BookmarkCheck, 
  Sparkles, 
  Search, 
  Wallet, 
  CheckCircle2, 
  ChevronDown, 
  Users, 
  ShieldCheck, 
  Lock, 
  Bell,
  Settings
} from 'lucide-react';
import { Campus, CampusId, AdminUser } from '../types';
import { VidyasysEmblem } from './VidyasysLogo';

interface HeaderProps {
  activeTab: 'notes' | 'projects' | 'tutors' | 'resources' | 'partnership';
  setActiveTab: (tab: 'notes' | 'projects' | 'tutors' | 'resources' | 'partnership') => void;
  selectedCampus: CampusId;
  setSelectedCampus: (campusId: CampusId) => void;
  campuses: Campus[];
  activeRentalsCount: number;
  upcomingSessionsCount: number;
  savedCount?: number;
  onOpenCreateModal: () => void;
  onOpenLibraryModal: () => void;
  onOpenEarningsModal: () => void;
  onOpenAiCopilot: () => void;
  onOpenStudyRoom: () => void;
  onOpenAdminPortal: () => void;
  isAdminLoggedIn: boolean;
  adminUser?: AdminUser;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  walletBalance: number;
  onTriggerUpcomingAlert?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCampus,
  setSelectedCampus,
  campuses,
  activeRentalsCount,
  upcomingSessionsCount,
  savedCount = 0,
  onOpenCreateModal,
  onOpenLibraryModal,
  onOpenEarningsModal,
  onOpenAiCopilot,
  onOpenStudyRoom,
  onOpenAdminPortal,
  isAdminLoggedIn,
  adminUser,
  searchQuery,
  setSearchQuery,
  walletBalance,
  onTriggerUpcomingAlert,
}) => {
  const currentCampus = campuses.find((c) => c.id === selectedCampus) || campuses[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Streamlined Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-slate-100 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0277fa] border border-blue-200 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Vidyasys Platform</span>
          </span>
          <span className="hidden lg:inline text-slate-500 text-[11px]">
            One platform where students <strong className="text-[#0277fa]">Learn, Share, Build &amp; Grow.</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Campus Study Room */}
          <button
            id="header-study-room-btn"
            onClick={onOpenStudyRoom}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-medium transition cursor-pointer text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Users className="w-3.5 h-3.5" />
            <span>Study Room</span>
          </button>

          {/* AI Exam Copilot */}
          <button
            id="header-ai-copilot-btn"
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-medium transition cursor-pointer text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Copilot</span>
          </button>

          {/* User Wallet */}
          <button
            id="user-wallet-btn"
            onClick={onOpenLibraryModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold transition cursor-pointer text-xs shadow-2xs"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹{walletBalance.toLocaleString()}</span>
          </button>

          {/* Prominent Admin Login / Portal Button */}
          <button
            id="header-admin-portal-btn"
            onClick={onOpenAdminPortal}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer shadow-xs ${
              isAdminLoggedIn
                ? 'bg-slate-900 text-white hover:bg-slate-800 ring-2 ring-indigo-500/40'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isAdminLoggedIn ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Dashboard</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Login</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Bar: Logo, Campus Selector, Search & Primary Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Brand & Campus Switcher */}
          <div className="flex items-center gap-2.5">
            <div 
              onClick={() => setActiveTab('notes')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <VidyasysEmblem className="w-10 h-10 group-hover:scale-105 transition-transform drop-shadow-xs" />
              <div>
                <div className="flex items-baseline leading-none">
                  <span className="text-xl font-black tracking-tight text-[#0a2558]">Vidya</span>
                  <span className="text-xl font-black tracking-tight text-[#0277fa]">sys</span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5 tracking-tight">
                  Learn, Share, Build &amp; Grow
                </p>
              </div>
            </div>

            {/* Campus Selector Pill */}
            <div className="relative group ml-1">
              <div 
                id="campus-selector-trigger"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-xs text-indigo-900 cursor-pointer transition shadow-2xs"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                  {currentCampus.id === 'vit' ? 'VIT' : currentCampus.id === 'vp' ? 'VP' : currentCampus.id === 'all' ? 'ALL' : currentCampus.shortName.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left leading-tight pr-1">
                  <span className="font-bold text-slate-900 max-w-[130px] sm:max-w-[170px] truncate block text-[11px] sm:text-xs">
                    {currentCampus.shortName}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-indigo-500" />
              </div>
              <select
                id="campus-selector-dropdown"
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value as CampusId)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                aria-label="Select Campus"
              >
                {campuses.map((camp) => (
                  <option key={camp.id} value={camp.id} className="bg-white text-slate-900">
                    {(camp.id === 'vit' || camp.id === 'vp') ? '⭐ ' : ''}{camp.name} ({camp.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              placeholder={
                selectedCampus === 'vit'
                  ? 'Search VIT Degree notes, Autonomous PYQs, mentors...'
                  : selectedCampus === 'vp'
                  ? 'Search VP Polytechnic notes, MSBTE PYQs, lab kits...'
                  : 'Search senior notes, hardware kits, peer mentors...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 px-1 py-0.5"
              >
                Clear
              </button>
            )}
          </div>

          {/* User Action CTA buttons */}
          <div className="flex items-center gap-2">
            {upcomingSessionsCount > 0 && onTriggerUpcomingAlert && (
              <button
                id="header-session-alert-trigger-btn"
                onClick={onTriggerUpcomingAlert}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition cursor-pointer shadow-xs"
                title="Upcoming tutoring session starting soon"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">1-Hr Alert</span>
              </button>
            )}

            <button
              id="my-library-btn"
              onClick={onOpenLibraryModal}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition cursor-pointer shadow-2xs"
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">My Library</span>
              {(activeRentalsCount > 0 || upcomingSessionsCount > 0 || savedCount > 0) && (
                <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeRentalsCount + upcomingSessionsCount + savedCount}
                </span>
              )}
            </button>

            <button
              id="create-listing-btn"
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Share Asset</span>
            </button>
          </div>
        </div>

        {/* Clean, Flat Ecosystem Navigation Tabs (Matches Vidyasys 4 Pillars) */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-2 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar text-xs font-medium">
          <button
            id="tab-notes-btn"
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-blue-50 text-[#0277fa] border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0277fa]" />
            <span>Notes</span>
            <span className="text-[10px] text-slate-400 font-normal hidden md:inline">• Senior Rentals</span>
          </button>

          <button
            id="tab-projects-btn"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-emerald-50 text-[#059669] border border-emerald-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Projects</span>
            <span className="text-[10px] text-slate-400 font-normal hidden md:inline">• Hardware Kits</span>
          </button>

          <button
            id="tab-tutors-btn"
            onClick={() => setActiveTab('tutors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tutors'
                ? 'bg-purple-50 text-[#7c3aed] border border-purple-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>Tutoring</span>
            <span className="text-[10px] text-slate-400 font-normal hidden md:inline">• 1-on-1 Mentors</span>
          </button>

          <button
            id="tab-resources-btn"
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-orange-50 text-[#ea580c] border border-orange-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#f97316]" />
            <span>Resources</span>
            <span className="text-[10px] text-slate-400 font-normal hidden md:inline">• Free PYQs &amp; Manuals</span>
          </button>

          <button
            id="tab-partnership-btn"
            onClick={() => setActiveTab('partnership')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
              activeTab === 'partnership'
                ? 'bg-slate-900 text-white border border-slate-800 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Partners</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
