import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  UserCheck, 
  BookOpen, 
  Award, 
  Languages, 
  Search,
  MessageSquare,
  Sparkles,
  Building2
} from 'lucide-react';
import { TutorItem, CampusId, SubjectBranch } from '../types';

interface PeerTutorHubProps {
  tutors: TutorItem[];
  selectedCampus: CampusId;
  searchQuery: string;
  onBookTutor: (tutor: TutorItem) => void;
}

export const PeerTutorHub: React.FC<PeerTutorHubProps> = ({
  tutors,
  selectedCampus,
  searchQuery,
  onBookTutor,
}) => {
  const [subjectQuery, setSubjectQuery] = useState<string>('');

  const filteredTutors = tutors.filter((tutor) => {
    // Campus filter
    if (selectedCampus !== 'all' && tutor.collegeId !== selectedCampus) {
      return false;
    }
    // Search query
    const q = (searchQuery || subjectQuery).toLowerCase().trim();
    if (q) {
      const matchName = tutor.name.toLowerCase().includes(q);
      const matchMajor = tutor.major.toLowerCase().includes(q);
      const matchBio = tutor.bio.toLowerCase().includes(q);
      const matchSubjects = tutor.subjects.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchMajor && !matchBio && !matchSubjects) {
        return false;
      }
    }
    return true;
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Peer Tutoring & 1-on-1 In-College Mentorship
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Connect with subject toppers and senior teaching assistants for 1-on-1 in-person exam prep and problem solving directly on your college campus.
          </p>
        </div>

        {/* Quick subject filter */}
        <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 text-xs w-full md:w-auto">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            id="tutor-subject-search-input"
            type="text"
            placeholder="Filter by subject (e.g. DSA, Math, OS)..."
            value={subjectQuery}
            onChange={(e) => setSubjectQuery(e.target.value)}
            className="bg-transparent text-slate-800 placeholder-slate-400 outline-none w-full md:w-56"
          />
          {subjectQuery && (
            <button
              onClick={() => setSubjectQuery('')}
              className="text-slate-500 hover:text-slate-800 cursor-pointer text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Popular Subject Quick Badges */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap">Popular Subjects:</span>
        {['All', 'Data Structures & Algorithms', 'Operating Systems', 'Linear Algebra & Calculus', 'Thermodynamics', 'Digital Circuit Design'].map((sub) => (
          <button
            key={sub}
            onClick={() => setSubjectQuery(sub === 'All' ? '' : sub)}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap cursor-pointer ${
              (sub === 'All' && !subjectQuery) || subjectQuery === sub
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200 shadow-xs'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No peer tutors found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your subject search or campus filter, or apply as a peer tutor on Vidyasys!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              id={`tutor-card-${tutor.id}`}
              className="group flex flex-col justify-between bg-white hover:border-slate-300 border border-slate-200 rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md"
            >
              <div>
                {/* Top Bar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 group-hover:border-emerald-600 transition-colors"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {tutor.name}
                        </h3>
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-slate-500">
                        {tutor.year} • {tutor.collegeName}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {tutor.rating.toFixed(2)} ({tutor.reviewCount})
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      {tutor.sessionsCompleted} sessions taught
                    </p>
                  </div>
                </div>

                {/* Academic Highlights & CGPA */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    CGPA: {tutor.cgpa}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
                    {tutor.major}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> In-College Session
                  </span>
                </div>

                {/* Bio */}
                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {tutor.bio}
                </p>

                {/* Subjects Mastered */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Subjects Taught:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {tutor.subjects.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Available Slots Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next available: {tutor.availableSlots[0]?.day} ({tutor.availableSlots[0]?.times[0]})</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500">
                    <Languages className="w-3.5 h-3.5" />
                    <span>{tutor.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Booking CTA Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-medium">Session Rate</span>
                  <p className="text-lg font-bold text-slate-900">
                    ₹{tutor.hourlyRate}
                    <span className="text-xs text-slate-500 font-normal"> / hour</span>
                  </p>
                </div>

                <button
                  id={`book-tutor-${tutor.id}`}
                  onClick={() => onBookTutor(tutor)}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Book In-College Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
