import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Share2, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  Clock, 
  Users, 
  Download, 
  Eye, 
  ChevronRight,
  HelpCircle,
  Building2
} from 'lucide-react';
import { 
  NavigationTab, 
  Campus, 
  CampusId, 
  NoteItem, 
  ProjectItem, 
  TutorItem, 
  CampusResourceItem 
} from '../types';
import { VidyasysEmblem } from './VidyasysLogo';

interface HomePageProps {
  onNavigate: (tab: NavigationTab) => void;
  selectedCampus: CampusId;
  setSelectedCampus: (campusId: CampusId) => void;
  campuses: Campus[];
  notes: NoteItem[];
  projects: ProjectItem[];
  tutors: TutorItem[];
  resources: CampusResourceItem[];
  onPreviewNote: (note: NoteItem) => void;
  onInspectProject: (project: ProjectItem) => void;
  onBookTutor: (tutor: TutorItem) => void;
  onOpenEarningsModal: () => void;
  onOpenCreateModal: () => void;
  onOpenStudyRoom: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  selectedCampus,
  setSelectedCampus,
  campuses,
  notes,
  projects,
  tutors,
  resources,
  onPreviewNote,
  onInspectProject,
  onBookTutor,
  onOpenEarningsModal,
  onOpenCreateModal,
  onOpenStudyRoom,
  searchQuery,
  setSearchQuery,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSearch.trim()) return;
    setSearchQuery(localSearch);
    // Default to notes or relevant tab
    onNavigate('notes');
  };

  // Curated samples from data
  const featuredNotes = notes.slice(0, 3);
  const featuredProjects = projects.slice(0, 2);
  const featuredTutors = tutors.slice(0, 3);

  const activeCampusName = campuses.find((c) => c.id === selectedCampus)?.name || 'Vidyalankar Campus';

  return (
    <div className="w-full space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      {/* =========================================================================
          1. CLEAN & WELCOMING HERO SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white border border-blue-100/80 p-6 sm:p-10 lg:p-14 shadow-sm">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Platform Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-blue-200/90 shadow-2xs">
            <VidyasysEmblem className="w-4 h-4" />
            <span className="text-xs font-bold text-[#0a2356] tracking-tight">
              Vidyasys Platform
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-[#0277fa]">
              Learn, Share, Build &amp; Grow
            </span>
          </div>

          {/* Main Direct Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0a2356] tracking-tight leading-tight">
            Academic Excellence Made <span className="text-[#0277fa]">Simple</span> &amp; <span className="text-emerald-600">Accessible</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Rent high-scoring senior handwritten notes, buy or rent hardware project kits, book 1-on-1 peer mentors, and access 100% free exam papers—all in one student hub.
          </p>

          {/* Quick Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center bg-white rounded-2xl shadow-md shadow-blue-900/5 border border-slate-200/90 p-1.5 transition-all focus-within:ring-2 focus-within:ring-[#0277fa] focus-within:border-transparent"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by subject, semester, project topic, or tutor (e.g. Data Structures, IoT, Python)..."
              className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-[#0277fa] hover:bg-blue-600 text-white text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Campus Switcher Pills */}
          <div className="pt-2 flex items-center justify-center flex-wrap gap-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Select Campus:</span>
            </span>
            {campuses.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCampus(c.id)}
                className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  selectedCampus === c.id
                    ? 'bg-[#0a2356] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.shortName}
              </button>
            ))}
            <button
              onClick={() => setSelectedCampus('all')}
              className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                selectedCampus === 'all'
                  ? 'bg-[#0a2356] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Campuses
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE 4 PILLARS OF VIDYASYS (CARDS THAT MAKE THE SITE EASY TO UNDERSTAND)
         ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0a2356]">
            Everything You Need to Succeed in College
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Vidyasys organizes your academic life into four essential, easy-to-use pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Pillar 1: Notes */}
          <div 
            onClick={() => onNavigate('notes')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0277fa] flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                📖
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0277fa] uppercase tracking-wider mb-1">
                <span>Pillar 01</span>
                <span>•</span>
                <span>Rent &amp; Read</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0277fa] transition-colors">
                Senior Notes
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Rent handwritten notes created by 9+ CGPA branch toppers. Includes formula sheets, diagrams, and exam highlights.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">From ₹39</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">DRM Protected</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">90% Creator Royalties</span>
              </div>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between text-xs font-bold text-[#0277fa]">
              <span>Explore Notes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2: Projects */}
          <div 
            onClick={() => onNavigate('projects')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                ⚙️
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <span>Pillar 02</span>
                <span>•</span>
                <span>Hardware &amp; Code</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                Academic Projects
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Rent complete hardware project kits (IoT, Arduino, Robotics) or purchase final-year capstone software projects.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Tested Kits</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">Campus Handover</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Reports Included</span>
              </div>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3: Tutoring */}
          <div 
            onClick={() => onNavigate('tutors')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                👥
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                <span>Pillar 03</span>
                <span>•</span>
                <span>1-on-1 Mentorship</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                Peer Tutoring
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Book 1-on-1 doubt clearing and exam sprint sessions with verified seniors who already scored high in your exact subjects.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-slate-100">From ₹120/hr</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">Live Study Room</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">1-Hr Alert</span>
              </div>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Find a Mentor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 4: Resources */}
          <div 
            onClick={() => onNavigate('resources')}
            className="group cursor-pointer bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:border-orange-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                🔀
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                <span>Pillar 04</span>
                <span>•</span>
                <span>Free Open Access</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                Exam Resources
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Download 100% free previous year exam papers (PYQs), solutions, lab manuals, and syllabus roadmaps verified by campus reps.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">100% Free</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">MSBTE &amp; MU</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100">Lab Manuals</span>
              </div>
            </div>

            <div className="mt-5 pt-4 flex items-center justify-between text-xs font-bold text-orange-600">
              <span>Browse Free Resources</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HOW VIDYASYS WORKS (SIMPLE 3-STEP EXPLANATION)
         ========================================================================= */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0277fa] text-xs font-bold uppercase tracking-wider">
            Simple &amp; Frictionless
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0a2356] tracking-tight">
            How Vidyasys Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-slate-600">
            Designed specifically for engineering and polytechnic students to prepare without confusion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Select Your Campus &amp; Subject
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Filter by Vidyalankar (VIT / VP) or your university. Find exact semester courses like Applied Maths, Data Structures, or Microcontrollers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#0277fa] text-white font-black text-sm flex items-center justify-center shadow-sm">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Rent or Connect in Seconds
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlock notes immediately with our safe in-browser reader, reserve hardware project kits, or schedule a 1-on-1 tutoring call with seniors.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs relative space-y-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Score High &amp; Earn 90% Royalties
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ace your semester exams! Once you finish a course, upload your own topper notes or hardware to earn money and help future juniors.
            </p>
          </div>
        </div>

        {/* Action button inside How it works */}
        <div className="mt-8 text-center">
          <button
            onClick={onOpenEarningsModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Calculate How Much You Can Earn Sharing Notes</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </section>

      {/* =========================================================================
          4. POPULAR & TRENDING PREVIEW (DIRECT PREVIEW & ACTION)
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#0277fa] uppercase tracking-wider">
              High-Yield Materials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0a2356] tracking-tight mt-1">
              Trending Notes &amp; Project Kits at {activeCampusName}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('notes')}
            className="text-xs font-bold text-[#0277fa] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All {notes.length} Available Notes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0277fa] font-bold text-[11px]">
                    Sem {note.semester} • {note.branch}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{note.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-[#0277fa] transition-colors cursor-pointer" onClick={() => onPreviewNote(note)}>
                    {note.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {note.summary}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <img
                    src={note.author.avatar}
                    alt={note.author.name}
                    className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="leading-tight">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-800">{note.author.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-[10px] text-slate-500">CGPA: {note.author.cgpa} ({note.author.gradeAchieved})</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Rent from</span>
                  <span className="text-sm font-black text-slate-900">₹{note.rentalOptions[0]?.price}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreviewNote(note)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => onPreviewNote(note)}
                    className="px-3 py-1.5 rounded-lg bg-[#0277fa] hover:bg-blue-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. CAMPUS HARDWARE & PEER TUTOR SNEAK PEEK
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects Preview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚙️</span>
              <h3 className="text-lg font-black text-slate-900">
                Hardware Projects &amp; Kits
              </h3>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Avoid running around electronics markets. Rent verified ESP32, Arduino, and IoT project kits with pre-tested sensors and complete reports.
          </p>

          <div className="space-y-3 pt-2">
            {featuredProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => onInspectProject(p)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.hardwareIncluded?.slice(0, 3).join(', ') || 'Code & Hardware'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-emerald-700 block">₹{p.rentPricePerWeek}/wk</span>
                  <span className="text-[10px] text-slate-400">Rent or Buy</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tutors Preview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              <h3 className="text-lg font-black text-slate-900">
                Top-Rated Peer Tutors
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tutors')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View Tutors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Book 1-on-1 personalized sessions with seniors who cleared the same syllabus with top marks. Get 1-hour pre-session reminders.
          </p>

          <div className="space-y-3 pt-2">
            {featuredTutors.map((t) => (
              <div
                key={t.id}
                onClick={() => onBookTutor(t)}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/40 border border-slate-200/80 hover:border-purple-200 transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.subjects.slice(0, 2).join(', ')}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black text-purple-700 block">₹{t.hourlyRate}/hr</span>
                  <span className="text-[10px] text-amber-600 font-bold">★ {t.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          6. TRUST, SECURITY & CREATOR ROYALTIES
         ========================================================================= */}
      <section className="bg-gradient-to-r from-[#0a2356] to-[#0e3478] rounded-3xl p-8 sm:p-12 text-white shadow-md">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Built by Students, for Students</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <span>90% Student Royalties</span>
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                We only keep a minimal 10% platform fee. Student authors and peer tutors take home 90% of every rupee earned.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-300" />
                <span>Zero Risk DRM &amp; Vouchers</span>
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                All notes are watermarked and protected from piracy. Every purchase generates an official downloadable PDF voucher.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-300" />
                <span>Campus Verification</span>
              </h4>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Meet seniors in designated campus study pods or testing benches for safe physical kit handovers and tutoring.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-blue-100/90 text-center sm:text-left">
              Have handwritten notes or past projects lying around? Turn them into pocket money today.
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenCreateModal}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                + Upload &amp; Start Earning
              </button>
              <button
                onClick={onOpenStudyRoom}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 cursor-pointer"
              >
                Open Virtual Study Room
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. COMMON QUESTIONS & HELP (CLEAR UP CONFUSION)
         ========================================================================= */}
      <section className="max-w-3xl mx-auto space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#0a2356]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about navigating Vidyasys
          </p>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#0277fa]" />
              <span>How does note rental work?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              When you rent notes, they are instantly added to your student library. You can read them 24/7 inside our secure in-browser DRM reader for 3 days, 7 days, or a whole semester.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Are past papers (PYQs) and lab manuals really free?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Yes! All Mumbai University autonomous and MSBTE previous year papers, question banks, and lab manuals in the Resources tab are 100% free for all students to download.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>How do I rent physical project hardware kits?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              Select any project kit, choose your rental duration, and complete checkout. You will receive an official PDF voucher and contact details to inspect the working kit on campus before taking it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
