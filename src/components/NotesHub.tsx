import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Eye, 
  Filter, 
  GraduationCap, 
  Lock, 
  Search, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  Tag, 
  FileText,
  UserCheck,
  Bookmark,
  LayoutGrid,
  ListFilter,
  Check,
  ArrowUpDown,
  Zap
} from 'lucide-react';
import { NoteItem, SubjectBranch, CampusId } from '../types';

interface NotesHubProps {
  notes: NoteItem[];
  selectedBranch: SubjectBranch | 'All';
  selectedCampus: CampusId;
  searchQuery: string;
  onPreviewNote: (note: NoteItem) => void;
  onRentNote: (note: NoteItem) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  onOpenAiCopilot?: (query?: string) => void;
}

export const NotesHub: React.FC<NotesHubProps> = ({
  notes,
  selectedBranch,
  selectedCampus,
  searchQuery,
  onPreviewNote,
  onRentNote,
  bookmarkedIds = [],
  onToggleBookmark,
  onOpenAiCopilot,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'handwritten' | 'typed'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'price_low'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    // Campus filter
    if (selectedCampus !== 'all' && note.collegeId !== selectedCampus) {
      return false;
    }
    // Branch filter
    if (selectedBranch !== 'All' && note.branch !== selectedBranch) {
      return false;
    }
    // Semester filter
    if (selectedSemester !== 'all' && note.semester !== selectedSemester) {
      return false;
    }
    // Format filter
    if (formatFilter === 'handwritten' && !note.handwritten) return false;
    if (formatFilter === 'typed' && note.handwritten) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchSubject = note.subject.toLowerCase().includes(q);
      const matchProf = note.professor.toLowerCase().includes(q);
      const matchAuthor = note.author.name.toLowerCase().includes(q);
      const matchTags = note.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchSubject && !matchProf && !matchAuthor && !matchTags) {
        return false;
      }
    }
    return true;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return b.downloadsCount - a.downloadsCount;
    if (sortBy === 'price_low') {
      const aMin = Math.min(...a.rentalOptions.map((r) => r.price));
      const bMin = Math.min(...b.rentalOptions.map((r) => r.price));
      return aMin - bMin;
    }
    return 0;
  });

  return (
    <section className="space-y-6">
      {/* Pillar Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Senior Students’ Notes Rental Hub
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Access exam-verified handwritten & typed notes from batch toppers for short periods (3-day cram, 7-day sprint, or semester pass).
          </p>
        </div>

        {/* Sub-Filters & View Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Format Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="format-all-btn"
              onClick={() => setFormatFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                formatFilter === 'all' ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              id="format-handwritten-btn"
              onClick={() => setFormatFilter('handwritten')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                formatFilter === 'handwritten' ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✍️ Handwritten
            </button>
            <button
              id="format-typed-btn"
              onClick={() => setFormatFilter('typed')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                formatFilter === 'typed' ? 'bg-indigo-600 text-white font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⌨️ Typed / LaTeX
            </button>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-500">Sort:</span>
            <select
              id="notes-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 font-medium outline-none cursor-pointer"
            >
              <option value="rating" className="bg-white text-slate-900">Highest Rated</option>
              <option value="popular" className="bg-white text-slate-900">Most Rented</option>
              <option value="price_low" className="bg-white text-slate-900">Lowest Rental Price</option>
            </select>
          </div>

          {/* View Mode Toggle: Grid vs Table */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              id="view-mode-table-btn"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Comparison Table View"
            >
              <ListFilter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Semester Quick Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-1 whitespace-nowrap">
          Semester:
        </span>
        <button
          onClick={() => setSelectedSemester('all')}
          className={`px-3 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
            selectedSemester === 'all'
              ? 'bg-indigo-600 text-white font-semibold shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
          }`}
        >
          All Semesters
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSemester(s)}
            className={`px-3 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
              selectedSemester === s
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs'
            }`}
          >
            Sem {s}
          </button>
        ))}
      </div>

      {/* Notes Display */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No senior notes match your current filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {selectedCampus === 'vit'
              ? 'Try switching semesters or format filters to discover other Vidyalankar Institute of Technology (VIT) study guides and topper notes.'
              : selectedCampus === 'vp'
              ? 'Try switching semesters or format filters to discover other Vidyalankar Polytechnic (VP) MSBTE notes and practical guides.'
              : 'Try adjusting your campus, branch, or semester filter, or be the first senior to share your notes!'}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {selectedSemester !== 'all' && (
              <button
                onClick={() => setSelectedSemester('all')}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition cursor-pointer"
              >
                Show All Semesters
              </button>
            )}
            {formatFilter !== 'all' && (
              <button
                onClick={() => setFormatFilter('all')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition cursor-pointer"
              >
                Show All Formats
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map((note) => {
            const minRental = Math.min(...note.rentalOptions.map((r) => r.price));
            const isBookmarked = bookmarkedIds.includes(note.id);

            return (
              <div
                key={note.id}
                id={`note-card-${note.id}`}
                className="group flex flex-col justify-between bg-white hover:border-slate-300 border border-slate-200 rounded-2xl p-5 transition-all shadow-xs hover:shadow-md relative"
              >
                <div>
                  {/* Top Badges & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Sem {note.semester} • {note.branch}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {note.rating.toFixed(2)} ({note.reviewsCount})
                      </span>

                      {onToggleBookmark && (
                        <button
                          onClick={() => onToggleBookmark(note.id)}
                          className={`p-1.5 rounded-lg border transition cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                          title={isBookmarked ? 'Remove from Saved' : 'Save to Library'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Subject */}
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                    {note.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="text-slate-700 font-medium">{note.subject}</span>
                    <span>•</span>
                    <span className="truncate">{note.professor}</span>
                  </div>

                  {/* Author Credential & Verified Badge */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={note.author.avatar}
                        alt={note.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 truncate">
                          <span>{note.author.name}</span>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        </div>
                        <p className="text-[11px] text-emerald-700 font-medium truncate">
                          {note.author.gradeAchieved} ({note.author.cgpa})
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 px-2 py-1 rounded bg-white border border-slate-200 whitespace-nowrap">
                      {note.collegeName}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {note.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Quick Metadata: Pages & Handwritten */}
                  <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {note.pages} Pages
                    </span>
                    <span className="flex items-center gap-1">
                      {note.handwritten ? '✍️ Handwritten' : '⌨️ LaTeX / Typed'}
                    </span>
                    <span className="text-slate-500">
                      {note.downloadsCount} reads
                    </span>
                  </div>
                </div>

                {/* Pricing & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-medium">
                        Rent from
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-emerald-600">
                          ₹{minRental}
                        </span>
                        <span className="text-xs text-slate-500">/ 3-day sprint</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-medium">
                        Or Buy Permanent
                      </span>
                      <p className="text-xs font-semibold text-slate-800">
                        ₹{note.buyPrice}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`preview-note-${note.id}`}
                      onClick={() => onPreviewNote(note)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Preview</span>
                    </button>

                    <button
                      id={`rent-note-${note.id}`}
                      onClick={() => onRentNote(note)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Rent Options</span>
                    </button>
                  </div>

                  {/* Ask Copilot Quick CTA */}
                  {onOpenAiCopilot && (
                    <button
                      onClick={() => onOpenAiCopilot(`Give me high-yield exam derivations and questions for ${note.subject} (${note.title})`)}
                      className="w-full mt-2 py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Ask AI Study Copilot about this course</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact Comparison Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Subject & Note Title</th>
                <th className="py-3 px-4">Author & Verified Grade</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Pages / Format</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Sprint Rent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedNotes.map((note) => {
                const minRental = Math.min(...note.rentalOptions.map((r) => r.price));
                const isBookmarked = bookmarkedIds.includes(note.id);

                return (
                  <tr key={note.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{note.title}</div>
                      <div className="text-[11px] text-indigo-600 font-medium">{note.subject} • Sem {note.semester}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{note.author.name}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold">{note.author.gradeAchieved}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{note.collegeName}</td>
                    <td className="py-3 px-4">
                      <span>{note.pages} pages</span>
                      <span className="block text-[11px] text-slate-500">{note.handwritten ? 'Handwritten' : 'Typed'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {note.rating.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600">₹{minRental}</span>
                      <span className="text-[10px] text-slate-500 block">3 days</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onToggleBookmark && (
                          <button
                            onClick={() => onToggleBookmark(note.id)}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              isBookmarked
                                ? 'bg-amber-50 border-amber-300 text-amber-600'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={() => onPreviewNote(note)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition cursor-pointer border border-slate-200"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => onRentNote(note)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer shadow-xs"
                        >
                          Rent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
