import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  ChevronLeft,
  Lock, 
  Check, 
  FileText, 
  UserCheck, 
  Percent,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Palette,
  Eye,
  Award,
  Zap
} from 'lucide-react';
import { NoteItem, RentalOption } from '../types';

interface NotePreviewModalProps {
  note: NoteItem | null;
  onClose: () => void;
  onConfirmRental: (note: NoteItem, option: RentalOption | 'buy') => void;
  isAlreadyRented?: boolean;
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({
  note,
  onClose,
  onConfirmRental,
  isAlreadyRented = false,
}) => {
  if (!note) return null;

  const [selectedPlan, setSelectedPlan] = useState<string>(
    note.rentalOptions.find((r) => r.popular)?.id || note.rentalOptions[0]?.id || 'buy'
  );
  const [activeTab, setActiveTab] = useState<'preview' | 'syllabus' | 'flashcards' | 'author'>('preview');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'paper' | 'sepia'>('dark');

  const currentOption = note.rentalOptions.find((r) => r.id === selectedPlan);
  const isBuySelected = selectedPlan === 'buy';
  const finalPrice = isBuySelected ? note.buyPrice : currentOption?.price || 0;
  const creatorEarnings = Math.round(finalPrice * 0.9);
  const platformFee = finalPrice - creatorEarnings;

  const handleCheckout = () => {
    if (isBuySelected) {
      onConfirmRental(note, 'buy');
    } else if (currentOption) {
      onConfirmRental(note, currentOption);
    }
  };

  // Pre-configured dynamic flashcards for the course
  const flashcards = [
    {
      q: 'What is the primary advantage of Inverted Page Tables over Multi-Level Paging?',
      a: 'Inverted page tables bound memory overhead to physical RAM size ($O(\\text{RAM})$) rather than virtual address space ($O(\\text{Virtual Space})$), making 64-bit address spaces feasible.'
    },
    {
      q: 'Under what condition does Belady’s Anomaly NOT occur?',
      a: 'Belady’s anomaly never occurs in Stack Replacement Algorithms (e.g. LRU, LFU, Optimal) because the set of pages in an $m$-frame cache is always a strict subset of an $(m+1)$-frame cache.'
    },
    {
      q: 'How does the Translation Lookaside Buffer (TLB) maintain consistency on Context Switches?',
      a: 'The OS either flushes the entire TLB on context switch or tags each TLB entry with an Address Space Identifier (ASID / PCID), preventing inter-process memory leaks.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="note-preview-modal-dialog"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {note.subject} • Sem {note.semester}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
                {note.collegeName}
              </span>
              {isAlreadyRented && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Currently Rented & Active
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {note.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Authored by <strong className="text-slate-800">{note.author.name}</strong> • Course taught by {note.professor}
            </p>
          </div>

          <button
            id="close-note-preview-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-white border-b border-slate-200 text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            id="tab-preview-doc"
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Document Reader ({note.pages} pages)
          </button>
          <button
            id="tab-syllabus-coverage"
            onClick={() => setActiveTab('syllabus')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'syllabus'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Syllabus & Curriculum Map
          </button>
          <button
            id="tab-ai-flashcards"
            onClick={() => setActiveTab('flashcards')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Exam Flashcards</span>
          </button>
          <button
            id="tab-author-verify"
            onClick={() => setActiveTab('author')}
            className={`pb-2.5 px-3 border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'author'
                ? 'border-indigo-600 text-indigo-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Topper Credential Audit
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-white">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Reader Controls Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded transition cursor-pointer ${
                      currentPage === 1 ? 'text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-slate-800">
                    Page {currentPage} of 3 <span className="text-slate-500 font-normal">({note.pages} Total)</span>
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                    disabled={currentPage === 3}
                    className={`p-1.5 rounded transition cursor-pointer ${
                      currentPage === 3 ? 'text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Theme & Zoom Controls */}
                <div className="flex items-center gap-3">
                  {/* Theme Switcher */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setReaderTheme('dark')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        readerTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setReaderTheme('paper')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        readerTheme === 'paper' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paper White
                    </button>
                    <button
                      onClick={() => setReaderTheme('sepia')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                        readerTheme === 'sepia' ? 'bg-amber-100 text-amber-950 font-bold' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Sepia
                    </button>
                  </div>

                  {/* Zoom */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setZoomLevel((prev) => Math.max(85, prev - 10))}
                      className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-700 min-w-[36px] text-center text-[11px] font-mono">{zoomLevel}%</span>
                    <button
                      onClick={() => setZoomLevel((prev) => Math.min(130, prev + 10))}
                      className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Document Simulator Card */}
              <div 
                className={`rounded-2xl p-4 sm:p-6 border relative shadow-inner overflow-x-auto min-h-[360px] transition-colors duration-200 ${
                  readerTheme === 'dark'
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : readerTheme === 'paper'
                    ? 'bg-slate-50 border-slate-300 text-slate-900 shadow-sm'
                    : 'bg-[#fbf0d9] border-[#e8d7b8] text-[#433422]'
                }`}
                style={{ fontSize: `${zoomLevel}%` }}
              >
                {/* Security DRM Watermark Canvas */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none select-none">
                  <span className={`text-3xl sm:text-5xl font-black transform -rotate-12 uppercase tracking-wider ${
                    readerTheme === 'paper' || readerTheme === 'sepia' ? 'text-slate-900' : 'text-white'
                  }`}>
                    VIDYASYS DRM • LEARN, SHARE, BUILD &amp; GROW • {note.collegeName} • #{note.id.slice(-4)}
                  </span>
                </div>

                {/* Simulated Content Based on Current Page */}
                <div className={`max-w-2xl mx-auto rounded-xl p-6 leading-relaxed shadow-sm border relative ${
                  readerTheme === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : readerTheme === 'paper'
                    ? 'bg-white border-slate-200'
                    : 'bg-[#fffaf0] border-[#eddcc1]'
                }`}>
                  {/* Top Bar of Document */}
                  <div className="pb-3 border-b border-slate-200 mb-4 flex items-center justify-between text-xs opacity-75">
                    <span className="font-semibold">{note.subject} — Module {currentPage} Exam Notes</span>
                    <span className="font-bold text-indigo-600">Page {currentPage} of {note.pages}</span>
                  </div>

                  {currentPage === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-indigo-700">
                        1. High-Yield Summary & Mathematical Definitions
                      </h3>
                      <p className="leading-relaxed">
                        {note.summary}
                      </p>

                      <div className={`p-4 rounded-lg font-mono text-xs border ${
                        readerTheme === 'dark' ? 'bg-slate-950/80 border-slate-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        {note.sampleContentText || `// Key Definition & Derivation Invariant
Theorem: Inverted Page Table reduces page storage overhead from O(Virtual Space) to O(Physical Memory).
Anchor Hash Table: H(page_number, pid) -> frame_number
Average lookup time: O(1) with low collision chain depth.`}
                      </div>

                      <div className="text-xs opacity-80 pt-2">
                        <p>✍️ <em>Note from {note.author.name}:</em> Focus on drawing the hash table anchor diagram neatly. The professor awards 4 marks specifically for showing collision chain resolution.</p>
                      </div>
                    </div>
                  )}

                  {currentPage === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-indigo-700">
                        2. Step-by-Step Mathematical Derivation & Address Translation
                      </h3>
                      <p className="leading-relaxed">
                        Let virtual address $VA = (p, d)$, where $p$ is the page number and $d$ is the offset within page size $S$.
                      </p>

                      <div className={`p-4 rounded-lg text-xs space-y-2 border font-mono ${
                        readerTheme === 'dark' ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}>
                        <p className="font-bold text-indigo-600">Step 1: TLB Lookup</p>
                        <p>Compare virtual tag against concurrent associative TLB registers. Hit time: ~2 ns.</p>
                        <p className="font-bold text-indigo-600 pt-2">Step 2: Effective Memory Access Time (EMAT)</p>
                        <p>EMAT = h * (t_TLB + t_RAM) + (1 - h) * (t_TLB + 2 * t_RAM)</p>
                      </div>

                      <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                        readerTheme === 'dark' ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                      }`}>
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span><strong>Semester Tip:</strong> Always state that memory access doubles on a TLB miss due to fetching PTE + fetching target operand.</span>
                      </div>
                    </div>
                  )}

                  {currentPage === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-indigo-700">
                        3. University Endsem Solved Problem (10 Marks)
                      </h3>
                      <p className="leading-relaxed">
                        <strong>Problem Statement:</strong> A machine has 32-bit virtual addresses and 4KB page size. Given a 2-level paging scheme where outer and inner directories take 10 bits each, calculate the total space consumed by a process using 16MB of contiguous code and 64KB of stack.
                      </p>

                      <div className={`p-4 rounded-lg font-mono text-xs border space-y-2 ${
                        readerTheme === 'dark' ? 'bg-slate-950/80 border-slate-800 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      }`}>
                        <p>1. Page size = 4KB = 2^12 bytes (12 bits offset).</p>
                        <p>2. Virtual address layout: [10-bit Outer | 10-bit Inner | 12-bit Offset].</p>
                        <p>3. 16MB requires 16MB / 4KB = 4096 pages.</p>
                        <p>4. 4096 pages require 4096 / 1024 = 4 inner page tables.</p>
                        <p>5. Stack (64KB) requires 64KB / 4KB = 16 pages → 1 inner page table.</p>
                        <p><strong>Total Page Tables:</strong> 1 Outer Directory + (4 + 1) Inner = 6 tables * 4KB = 24KB memory overhead.</p>
                      </div>

                      <p className="text-xs opacity-75">
                        Scored full 10/10 in 2024 Endsem evaluation.
                      </p>
                    </div>
                  )}

                  {/* Lock Callout at bottom */}
                  <div className="mt-6 pt-4 border-t border-slate-200 border-dashed flex items-center justify-between text-xs opacity-75">
                    <span>🔒 Remaining {note.pages - 3} pages unlock instantly upon rental</span>
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> DRM Protected Handout
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI Flashcards for {note.subject}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Synthesized from {note.author.name}'s notes for fast active recall before entering the exam hall.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                  3 Cards Ready
                </span>
              </div>

              <div className="space-y-3">
                {flashcards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {card.q}
                      </p>
                    </div>

                    <div className="ml-7 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-emerald-700 block mb-1">Answer & Derivation:</span>
                      {card.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Comprehensive Table of Contents
              </h4>
              <p className="text-xs text-slate-500">
                These notes map 100% to the university curriculum taught by {note.professor}.
              </p>

              <div className="space-y-2.5">
                {note.tableOfContents.map((chapter, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{chapter}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Includes handwritten diagrams, previous year solved questions, and formula derivation.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'author' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={note.author.avatar}
                  alt={note.author.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{note.author.name}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" />
                      Verified Senior
                    </span>
                  </div>
                  <p className="text-xs text-indigo-700 mt-0.5 font-medium">
                    {note.author.year} • {note.collegeName}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Achieved <strong className="text-emerald-700">{note.author.gradeAchieved}</strong> with an overall CGPA of <strong className="text-slate-900">{note.author.cgpa}</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Total Notes Reads</span>
                  <p className="text-base font-bold text-slate-900 mt-1">{note.downloadsCount}+ students</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Student Rating</span>
                  <p className="text-base font-bold text-amber-600 mt-1 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    {note.rating.toFixed(2)} / 5.0
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Campus Verification</span>
                  <p className="text-base font-bold text-teal-700 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Student ID Authenticated
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rental Plan Selection Box */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Select Rental Period or Buy Permanently
              </h4>
              <span className="text-xs text-slate-500">Instant digital access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {note.rentalOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedPlan(opt.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer relative ${
                    selectedPlan === opt.id
                      ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {opt.popular && (
                    <span className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  <p className="text-xs font-semibold text-slate-700">{opt.duration}</p>
                  <p className="text-base font-bold text-slate-900 mt-1">₹{opt.price}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {opt.days} Days Access
                  </p>
                </div>
              ))}

              {/* Permanent Buy Option */}
              <div
                onClick={() => setSelectedPlan('buy')}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  selectedPlan === 'buy'
                    ? 'bg-indigo-50 border-indigo-400 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <p className="text-xs font-semibold text-slate-700">Lifetime Purchase</p>
                <p className="text-base font-bold text-slate-900 mt-1">₹{note.buyPrice}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Keep forever + PDF export</p>
              </div>
            </div>

            {/* Transparent Commission & Revenue Split */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">
                  Transparent Fee Breakdown: <strong className="text-emerald-700">90% directly to {note.author.name}</strong> (₹{creatorEarnings}) • <strong className="text-indigo-700">10% Vidyasys platform fee</strong> (₹{platformFee})
                </span>
              </div>
              <span className="text-slate-500 text-[11px] whitespace-nowrap">
                Money-back guarantee within 2 hours
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500">Total payable:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900">₹{finalPrice}</span>
              <span className="text-xs text-slate-500">
                ({isBuySelected ? 'Lifetime Access' : `${currentOption?.days} Days Rental`})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="modal-cancel-btn"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="modal-confirm-rent-btn"
              onClick={handleCheckout}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{isBuySelected ? 'Buy & Download Note' : `Rent for ₹${finalPrice}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
