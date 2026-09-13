import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  Share2, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Sparkles,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { 
  NoteItem, 
  ProjectItem, 
  TutorItem, 
  CampusResourceItem, 
  CampusId, 
  SubjectBranch,
  Campus
} from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCampus: CampusId;
  campuses: Campus[];
  onAddNote: (note: NoteItem) => void;
  onAddProject: (project: ProjectItem) => void;
  onAddTutor: (tutor: TutorItem) => void;
  onAddResource: (resource: CampusResourceItem) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  selectedCampus,
  campuses,
  onAddNote,
  onAddProject,
  onAddTutor,
  onAddResource,
}) => {
  const [activeType, setActiveType] = useState<'note' | 'project' | 'tutor' | 'resource'>('note');
  const [collegeId, setCollegeId] = useState<CampusId>(selectedCampus === 'all' ? 'iitb' : selectedCampus);

  // Common Author Details
  const [authorName, setAuthorName] = useState('Arjun Patel');
  const [authorYear, setAuthorYear] = useState('Final Year B.Tech');

  // Note fields
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('');
  const [noteBranch, setNoteBranch] = useState<SubjectBranch>('Computer Science');
  const [noteSemester, setNoteSemester] = useState<number>(4);
  const [noteProf, setNoteProf] = useState('');
  const [notePages, setNotePages] = useState<number>(85);
  const [noteHandwritten, setNoteHandwritten] = useState<boolean>(true);
  const [note3DayPrice, setNote3DayPrice] = useState<number>(49);
  const [note7DayPrice, setNote7DayPrice] = useState<number>(89);
  const [noteBuyPrice, setNoteBuyPrice] = useState<number>(199);
  const [noteSummary, setNoteSummary] = useState('');

  // Project fields
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState<'hardware' | 'iot' | 'ai_ml' | 'fullstack' | 'cad_mechanical'>('hardware');
  const [projDesc, setProjDesc] = useState('');
  const [projTechStack, setProjTechStack] = useState('Arduino, C++, ESP32, FreeRTOS');
  const [projRentPrice, setProjRentPrice] = useState<number>(299);
  const [projBuyPrice, setProjBuyPrice] = useState<number>(1499);
  const [projHasHardwareKit, setProjHasHardwareKit] = useState<boolean>(true);
  const [projDeposit, setProjDeposit] = useState<number>(1200);

  // Tutor fields
  const [tutorMajor, setTutorMajor] = useState('Computer Science & Engineering');
  const [tutorCgpa, setTutorCgpa] = useState('9.65 / 10');
  const [tutorSubjects, setTutorSubjects] = useState('Data Structures, Operating Systems, C++');
  const [tutorRate, setTutorRate] = useState<number>(349);
  const [tutorBio, setTutorBio] = useState('Teaching assistant with deep focus on midsem & endsem past questions.');

  // Resource fields
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'pyq' | 'lab_manual' | 'cheatsheet' | 'viva_prep' | 'formula_sheet'>('pyq');
  const [resSubject, setResSubject] = useState('');
  const [resSem, setResSem] = useState<number>(4);

  const selectedCollegeObj = campuses.find((c) => c.id === collegeId) || campuses[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'note') {
      if (!noteTitle || !noteSubject) return;
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitle,
        subject: noteSubject,
        branch: noteBranch,
        semester: noteSemester,
        professor: noteProf || 'Department Faculty',
        collegeId: collegeId,
        collegeName: selectedCollegeObj.shortName,
        author: {
          name: authorName,
          year: authorYear,
          cgpa: '9.5 / 10',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          gradeAchieved: 'A+ Batch Topper',
          verifiedStudent: true,
        },
        pages: notePages,
        rating: 5.0,
        reviewsCount: 1,
        handwritten: noteHandwritten,
        rentalOptions: [
          { id: `r1-${Date.now()}`, duration: '3-Day Midsem Sprint', days: 3, price: note3DayPrice, usdPrice: 1.29 },
          { id: `r2-${Date.now()}`, duration: '7-Day Endsem Pass', days: 7, price: note7DayPrice, usdPrice: 2.19, popular: true },
        ],
        buyPrice: noteBuyPrice,
        tags: [noteSubject, 'Semester Exam Notes', 'Solved Papers'],
        samplePages: ['https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'],
        summary: noteSummary || 'Comprehensive verified study material with derivations and past year solutions.',
        tableOfContents: ['Unit 1: Fundamentals', 'Unit 2: Advanced Concepts & Proofs', 'Unit 3: Exam Problem Sets'],
        downloadsCount: 1,
      };
      onAddNote(newNote);
    } else if (activeType === 'project') {
      if (!projTitle || !projDesc) return;
      const newProj: ProjectItem = {
        id: `proj-${Date.now()}`,
        title: projTitle,
        category: projCategory,
        branch: 'Computer Science',
        collegeId: collegeId,
        collegeName: selectedCollegeObj.shortName,
        author: {
          name: authorName,
          year: authorYear,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        description: projDesc,
        highlights: [
          'Full working source code and architectural documentation included',
          'Verified simulation and build scripts tested by author',
        ],
        techStack: projTechStack.split(',').map((s) => s.trim()),
        forSale: true,
        buyPrice: projBuyPrice,
        forRent: true,
        rentPricePerWeek: projRentPrice,
        hasHardwareKit: projHasHardwareKit,
        hardwareKitDeposit: projDeposit,
        rating: 5.0,
        documentationGrade: 'A+',
        yearCreated: 2024,
      };
      onAddProject(newProj);
    } else if (activeType === 'tutor') {
      const newTutor: TutorItem = {
        id: `tutor-${Date.now()}`,
        name: authorName,
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        collegeId: collegeId,
        collegeName: selectedCollegeObj.shortName,
        year: authorYear,
        major: tutorMajor,
        cgpa: tutorCgpa,
        subjects: tutorSubjects.split(',').map((s) => s.trim()),
        hourlyRate: tutorRate,
        rating: 5.0,
        reviewCount: 1,
        sessionsCompleted: 0,
        bio: tutorBio,
        achievements: ['Department Rank Holder', '100% Student Exam Clearance Rate'],
        availableSlots: [
          { day: 'Tomorrow', times: ['6:00 PM - 7:00 PM', '8:00 PM - 9:00 PM'] },
          { day: 'Weekend', times: ['11:00 AM - 12:00 PM', '4:00 PM - 5:00 PM'] },
        ],
        languages: ['English', 'Hindi'],
      };
      onAddTutor(newTutor);
    } else if (activeType === 'resource') {
      if (!resTitle || !resSubject) return;
      const newRes: CampusResourceItem = {
        id: `res-${Date.now()}`,
        title: resTitle,
        type: resType,
        subject: resSubject,
        semester: resSem,
        branch: 'Computer Science',
        collegeId: collegeId,
        collegeName: selectedCollegeObj.shortName,
        uploadedBy: authorName,
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        upvotes: 1,
        fileFormat: 'PDF Document',
        fileSize: '3.4 MB',
        dateAdded: 'Just now',
        verifiedByFaculty: true,
        hasSolutions: true,
      };
      onAddResource(newRes);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="create-listing-modal-dialog"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Share Knowledge, Projects or Skills on Vidyasys
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Empower your campus community and start earning 90% of every transaction.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Listing Modes Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            id="tab-create-note"
            onClick={() => setActiveType('note')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeType === 'note'
                ? 'border-indigo-600 text-indigo-700 bg-white font-semibold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Rent Senior Notes</span>
          </button>

          <button
            id="tab-create-project"
            onClick={() => setActiveType('project')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeType === 'project'
                ? 'border-cyan-600 text-cyan-800 bg-white font-semibold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-600" />
            <span>List Academic Project</span>
          </button>

          <button
            id="tab-create-tutor"
            onClick={() => setActiveType('tutor')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeType === 'tutor'
                ? 'border-emerald-600 text-emerald-800 bg-white font-semibold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Offer Peer Tutoring</span>
          </button>

          <button
            id="tab-create-resource"
            onClick={() => setActiveType('resource')}
            className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeType === 'resource'
                ? 'border-amber-600 text-amber-800 bg-white font-semibold shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Free Community Resource</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs bg-white">
          {/* Creator Profile & Campus */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Your Academic Year</label>
              <input
                type="text"
                value={authorYear}
                onChange={(e) => setAuthorYear(e.target.value)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Your Campus</label>
              <select
                value={collegeId}
                onChange={(e) => setCollegeId(e.target.value as CampusId)}
                className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                {campuses.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note Form Fields */}
          {activeType === 'note' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Note Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems & Linux Kernel Complete Handout"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Subject / Course Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Operating Systems (CS204)"
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Department / Branch</label>
                  <select
                    value={noteBranch}
                    onChange={(e) => setNoteBranch(e.target.value as SubjectBranch)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                  >
                    <option>Computer Science</option>
                    <option>Electronics & Comm.</option>
                    <option>Mechanical</option>
                    <option>Electrical</option>
                    <option>Mathematics & AI</option>
                    <option>Civil & Biotech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester</label>
                  <select
                    value={noteSemester}
                    onChange={(e) => setNoteSemester(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Total Pages</label>
                  <input
                    type="number"
                    value={notePages}
                    onChange={(e) => setNotePages(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Course Professor (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Bhaskar Raman"
                  value={noteProf}
                  onChange={(e) => setNoteProf(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Summary / Syllabus Covered</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what formulas, units, or exam questions this covers..."
                  value={noteSummary}
                  onChange={(e) => setNoteSummary(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              {/* Pricing Grid */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-semibold text-slate-800">Set Rental & Purchase Rates (INR)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-500">3-Day Rental Price</label>
                    <input
                      type="number"
                      value={note3DayPrice}
                      onChange={(e) => setNote3DayPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">7-Day Rental Price</label>
                    <input
                      type="number"
                      value={note7DayPrice}
                      onChange={(e) => setNote7DayPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Permanent Buy Price</label>
                    <input
                      type="number"
                      value={noteBuyPrice}
                      onChange={(e) => setNoteBuyPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Project Form Fields */}
          {activeType === 'project' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous Indoor Quadcopter Drone with LiDAR"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-cyan-500"
                  >
                    <option value="hardware">Hardware & Robotics</option>
                    <option value="iot">IoT & Embedded Systems</option>
                    <option value="ai_ml">AI / Machine Learning</option>
                    <option value="fullstack">Distributed Systems / Software</option>
                    <option value="cad_mechanical">CAD & Mechanical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description & Architecture *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain the technical stack, firmware, hardware components, and results..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="ROS2, C++, Raspberry Pi, OpenCV, SolidWorks"
                  value={projTechStack}
                  onChange={(e) => setProjTechStack(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] text-slate-500">Weekly Rental Price (INR)</label>
                  <input
                    type="number"
                    value={projRentPrice}
                    onChange={(e) => setProjRentPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">Lifetime Purchase Price (INR)</label>
                  <input
                    type="number"
                    value={projBuyPrice}
                    onChange={(e) => setProjBuyPrice(Number(e.target.value))}
                    className="w-full p-2 rounded-lg bg-white border border-slate-300 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="chk-hardware-kit"
                  checked={projHasHardwareKit}
                  onChange={(e) => setProjHasHardwareKit(e.target.checked)}
                  className="w-4 h-4 accent-cyan-600 rounded cursor-pointer"
                />
                <label htmlFor="chk-hardware-kit" className="text-slate-700 cursor-pointer">
                  Physical Hardware Prototype Kit Available for Campus Handover
                </label>
              </div>
            </div>
          )}

          {/* Tutor Form Fields */}
          {activeType === 'tutor' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Your Major / Specialization</label>
                  <input
                    type="text"
                    value={tutorMajor}
                    onChange={(e) => setTutorMajor(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Your CGPA</label>
                  <input
                    type="text"
                    value={tutorCgpa}
                    onChange={(e) => setTutorCgpa(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Subjects You Can Tutor (comma separated)</label>
                <input
                  type="text"
                  value={tutorSubjects}
                  onChange={(e) => setTutorSubjects(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Hourly Tutoring Fee (INR)</label>
                <input
                  type="number"
                  value={tutorRate}
                  onChange={(e) => setTutorRate(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Tutor Bio & Achievements</label>
                <textarea
                  rows={2}
                  value={tutorBio}
                  onChange={(e) => setTutorBio(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Resource Form Fields */}
          {activeType === 'resource' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Endsem 2024 Exam Paper with Official Faculty Answer Key"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Resource Type</label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value="pyq">Past Year Paper (PYQ)</option>
                    <option value="lab_manual">Lab Manual & Code</option>
                    <option value="formula_sheet">Formula Cheatsheet</option>
                    <option value="viva_prep">Viva Voce Q&A</option>
                    <option value="cheatsheet">Summary Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Networks"
                    value={resSubject}
                    onChange={(e) => setResSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Semester</label>
                  <select
                    value={resSem}
                    onChange={(e) => setResSem(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Transparent 90/10 Callout */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-600" />
              Creator Payout: <strong className="text-emerald-800 font-semibold">90% of all rental/purchase earnings</strong>
            </span>
            <span className="text-slate-500 text-[11px]">Vidyasys Escrow: 10%</span>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Listing to Campus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
