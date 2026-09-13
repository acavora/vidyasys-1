import React, { useState } from 'react';
import { 
  Home,
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Share2, 
  Building2, 
  PlusCircle, 
  BookmarkCheck, 
  Search, 
  Wallet, 
  ChevronDown, 
  Users, 
  ShieldCheck, 
  Lock, 
  Bell,
  Menu,
  X
} from 'lucide-react';
import { Campus, CampusId, AdminUser, NavigationTab } from '../types';
import { VidyasysEmblem } from './VidyasysLogo';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCampus: CampusId;
  setSelectedCampus: (campusId: CampusId) => void;
  campuses: Campus[];
  activeRentalsCount: number;
  upcomingSessionsCount: number;
  savedCount?: number;
  onOpenCreateModal: () => void;
  onOpenLibraryModal: () => void;
  onOpenEarningsModal: () => void;
  onOpenStudyRoom?: () => void;
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
  onOpenStudyRoom,
  onOpenAdminPortal,
  isAdminLoggedIn,
  searchQuery,
  setSearchQuery,
  walletBalance,
  onTriggerUpcomingAlert,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const currentCampus = campuses.find((c) => c.id === selectedCampus) || campuses[0];
  const totalLibraryItems = activeRentalsCount + upcomingSessionsCount + savedCount;

  const navLinks: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Cpu className="w-4 h-4" /> },
    { id: 'tutors', label: 'Tutoring', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'resources', label: 'Resources', icon: <Share2 className="w-4 h-4" /> },
    { id: 'partnership', label: 'Campus Partners', icon: <Building2 className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Main Unified Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity & Campus Selector */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="Vidyasys Home"
          >
            <VidyasysEmblem className="w-9 h-9 group-hover:scale-105 transition-transform drop-shadow-xs" />
            <div className="hidden sm:block">
              <div className="flex items-baseline leading-none">
                <span className="text-xl font-black tracking-tight text-[#0a2356]">Vidya</span>
                <span className="text-xl font-black tracking-tight text-[#0277fa]">sys</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5 tracking-tight">
                Learn • Share • Grow
              </p>
            </div>
          </button>

          {/* Clean Campus Selector Pill */}
          <div className="relative group">
            <div 
              id="campus-selector-pill"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/90 hover:bg-slate-200/70 border border-slate-200/80 text-xs font-semibold text-slate-700 cursor-pointer transition"
            >
              <span className="w-2 h-2 rounded-full bg-[#0277fa]" />
              <span className="max-w-[100px] sm:max-w-[130px] truncate text-[11px] sm:text-xs">
                {currentCampus.shortName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
            <select
              id="campus-selector-select"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value as CampusId)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="Select Campus"
            >
              {campuses.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name} ({camp.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Clean Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-tab-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#0277fa] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={isActive ? 'text-[#0277fa]' : 'text-slate-400'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Quick Search Bar */}
          <div className="relative hidden md:block">
            <div className={`relative transition-all duration-200 ${isSearchExpanded ? 'w-64' : 'w-48 lg:w-56'}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="header-quick-search-input"
                type="text"
                placeholder="Search notes, projects..."
                value={searchQuery}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-[#0277fa] rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Study Room Quick Trigger */}
          {onOpenStudyRoom && (
            <button
              id="header-study-room-btn"
              onClick={onOpenStudyRoom}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition cursor-pointer"
              title="Join Live Campus Virtual Study Room"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Users className="w-3.5 h-3.5" />
              <span>Study Room</span>
            </button>
          )}

          {/* Upcoming Session Notification Bell */}
          {upcomingSessionsCount > 0 && onTriggerUpcomingAlert && (
            <button
              id="header-upcoming-alert-bell"
              onClick={onTriggerUpcomingAlert}
              className="relative p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer"
              title={`${upcomingSessionsCount} scheduled tutoring session`}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-600" />
            </button>
          )}

          {/* My Library Button */}
          <button
            id="header-library-btn"
            onClick={onOpenLibraryModal}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer shadow-2xs"
            title="My Rented Notes & Booked Sessions"
          >
            <BookmarkCheck className="w-4 h-4 text-[#0277fa]" />
            <span className="hidden sm:inline">Library</span>
            {totalLibraryItems > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#0277fa] text-white text-[10px] font-bold">
                {totalLibraryItems}
              </span>
            )}
          </button>

          {/* Wallet Balance Pill */}
          <button
            id="header-wallet-pill-btn"
            onClick={onOpenLibraryModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200/80 transition cursor-pointer"
            title="Wallet Balance & Earnings"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹{walletBalance.toLocaleString()}</span>
          </button>

          {/* Admin Portal Quick Icon */}
          <button
            id="header-admin-quick-btn"
            onClick={onOpenAdminPortal}
            className={`p-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
              isAdminLoggedIn 
                ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800' 
                : 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
            }`}
            title={isAdminLoggedIn ? 'Admin Portal Active' : 'Admin Portal Login'}
          >
            {isAdminLoggedIn ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Lock className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            )}
          </button>

          {/* Primary CTA: + Share / Upload */}
          <button
            id="header-share-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0277fa] hover:bg-[#0266d6] text-white text-xs font-bold shadow-xs transition cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden xs:inline">Share</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="header-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer / Collapsible Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 shadow-lg">
          {/* Mobile Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, project kits, tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>

          {/* Mobile Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#0a2356] text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-[#0277fa]'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Quick Actions Strip */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                onOpenLibraryModal();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 font-bold text-slate-700"
            >
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Wallet: ₹{walletBalance.toLocaleString()}</span>
            </button>

            {onOpenStudyRoom && (
              <button
                onClick={() => {
                  onOpenStudyRoom();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Live Study Room</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
