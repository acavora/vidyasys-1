import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  School, 
  Lock, 
  Sparkles,
  BarChart3,
  BadgeCheck,
  Send
} from 'lucide-react';
import { Campus } from '../types';

interface CampusPartnershipHubProps {
  campuses: Campus[];
}

export const CampusPartnershipHub: React.FC<CampusPartnershipHubProps> = ({ campuses }) => {
  const [collegeName, setCollegeName] = useState('');
  const [representativeRole, setRepresentativeRole] = useState('Student Council President');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim() || !email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setCollegeName('');
      setEmail('');
    }, 4000);
  };

  return (
    <section className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 p-6 sm:p-8 rounded-2xl border border-indigo-100 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-3">
            <School className="w-3.5 h-3.5" />
            Institutional Academic Partnerships
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Partnering with Colleges to build a trusted, verified campus learning ecosystem.
          </h2>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Vidyasys collaborates directly with student councils, academic departments, and college innovation labs. We turn isolated campus silos into high-trust peer learning networks with authenticated student identities, anti-plagiarism guardrails, and fair creator payouts.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Campus Trust */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Student ID & Grade Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every senior note provider and peer tutor is verified via institutional email (.edu / .ac.in) or student ID with authentic semester grades.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Academic Honor & Anti-Plagiarism</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict guidelines ensure shared materials act as learning reference, study notes, and research benchmarks without violating academic integrity.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Campus Hardware Lockers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Safe physical handover points inside campus innovation centers for robotics prototypes, sensors, and electronic testing kits.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Institutional Insights</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deans & Department Heads receive aggregate trends on difficult course modules where students seek the most peer tutoring and notes assistance.
          </p>
        </div>
      </div>

      {/* Partner Campuses Showcase */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Active Campus Chapters & Network
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Explore current participating colleges with student chapters and verified note repositories.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campuses.filter((c) => c.id !== 'all').map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-700">
                  {c.shortName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Active Chapter
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{c.name}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{c.city}</p>

              <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Notes</span>
                  <p className="font-bold text-slate-900">{c.verifiedNotesCount}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Projects</span>
                  <p className="font-bold text-slate-900">{c.projectsCount}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Tutors</span>
                  <p className="font-bold text-slate-900">{c.tutorsCount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Council / Dean Partnership Onboarding Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Join the Vidyasys Campus Network
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Bring Vidyasys to Your College or Department
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Are you a student council representative, society president, or department coordinator? Partner with us to launch a verified student chapter.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-slate-800 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Partnership Proposal Received!</h4>
            <p className="text-xs text-slate-600">
              Our campus partnerships lead will connect with your council within 24 hours to initiate student chapter setup.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  College / University Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manipal Institute of Technology"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Your Role
                </label>
                <select
                  value={representativeRole}
                  onChange={(e) => setRepresentativeRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option>Student Council President / General Secretary</option>
                  <option>Technical Club Lead / Society Head</option>
                  <option>Department Teaching Assistant</option>
                  <option>Faculty / Incubation Centre Coordinator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Institutional Email (.edu / .ac.in / council email)
              </label>
              <input
                type="email"
                required
                placeholder="president.council@college.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit College Partnership Request</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
