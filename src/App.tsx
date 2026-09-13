import React, { useState, useEffect } from 'react';
import { 
  CAMPUSES, 
  INITIAL_NOTES, 
  INITIAL_PROJECTS, 
  INITIAL_TUTORS, 
  INITIAL_RESOURCES,
  INITIAL_ACTIVE_RENTALS,
  INITIAL_BOOKED_SESSIONS,
  DEFAULT_ADMIN,
  INITIAL_STUDENTS,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_ORDERS
} from './data/mockData';
import { 
  CampusId, 
  SubjectBranch, 
  NoteItem, 
  ProjectItem, 
  TutorItem, 
  CampusResourceItem, 
  RentalOption, 
  ActiveRental, 
  BookedTutorSession, 
  UserWallet,
  StudentProfile,
  StudentPointTransaction,
  OrderRecord,
  AdminUser,
  NavigationTab
} from './types';
import { HomePage } from './components/HomePage';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { NotesHub } from './components/NotesHub';
import { NotePreviewModal } from './components/NotePreviewModal';
import { ProjectsMarketplace } from './components/ProjectsMarketplace';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PeerTutorHub } from './components/PeerTutorHub';
import { TutorBookingModal } from './components/TutorBookingModal';
import { CampusResourcesHub } from './components/CampusResourcesHub';
import { CampusPartnershipHub } from './components/CampusPartnershipHub';
import { EarningsCalculatorModal } from './components/EarningsCalculatorModal';
import { CreateListingModal } from './components/CreateListingModal';
import { UserLibraryModal } from './components/UserLibraryModal';
import { CampusStudyRoomModal } from './components/CampusStudyRoomModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { VidyasysEmblem } from './components/VidyasysLogo';
import { PreSessionToastNotification, ToastMessage } from './components/PreSessionToastNotification';
import { downloadReceiptPdf } from './utils/pdfReceiptGenerator';
import { 
  CheckCircle2, 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Cpu,
  Share2,
  Building2,
  Users,
  Zap
} from 'lucide-react';

export default function App() {
  // Main Data States
  const [campuses] = useState(CAMPUSES);
  const [selectedCampus, setSelectedCampus] = useState<CampusId>('vit');
  const [selectedBranch, setSelectedBranch] = useState<SubjectBranch | 'All'>('All');
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [tutors, setTutors] = useState<TutorItem[]>(INITIAL_TUTORS);
  const [resources, setResources] = useState<CampusResourceItem[]>(INITIAL_RESOURCES);

  // Admin & Student Points / Order State
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(DEFAULT_ADMIN);
  const [students, setStudents] = useState<StudentProfile[]>(INITIAL_STUDENTS);
  const [pointTransactions, setPointTransactions] = useState<StudentPointTransaction[]>(INITIAL_POINT_TRANSACTIONS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);

  // Bookmarks / Saved State
  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState<string[]>(['note-vit-1']);
  const [bookmarkedProjectIds, setBookmarkedProjectIds] = useState<string[]>(['proj-vit-1']);

  // User State: Active rentals, bookings, wallet
  const [activeRentals, setActiveRentals] = useState<ActiveRental[]>(INITIAL_ACTIVE_RENTALS);
  const [bookedSessions, setBookedSessions] = useState<BookedTutorSession[]>(INITIAL_BOOKED_SESSIONS);
  const [wallet, setWallet] = useState<UserWallet>({
    balance: 1480,
    totalEarned: 8400,
    notesRentedOut: 38,
    projectsSoldOrRented: 4,
    tutoringHoursDelivered: 12,
  });

  // Modals
  const [previewingNote, setPreviewingNote] = useState<NoteItem | null>(null);
  const [inspectingProject, setInspectingProject] = useState<ProjectItem | null>(null);
  const [bookingTutor, setBookingTutor] = useState<TutorItem | null>(null);
  const [isEarningsModalOpen, setIsEarningsModalOpen] = useState<boolean>(false);
  const [isCreateListingModalOpen, setIsCreateListingModalOpen] = useState<boolean>(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false);
  const [isStudyRoomOpen, setIsStudyRoomOpen] = useState<boolean>(false);

  // Toast & Notification System
  const [generalToast, setGeneralToast] = useState<ToastMessage | null>(null);
  const [activeSessionAlert, setActiveSessionAlert] = useState<BookedTutorSession | null>(null);
  const [libraryModalInitialTab, setLibraryModalInitialTab] = useState<'rentals' | 'sessions' | 'saved' | 'wallet' | 'orders'>('rentals');

  const showToast = (
    title: string, 
    desc: string, 
    type: 'success' | 'info' | 'alert' = 'success',
    action?: { label: string; onClick: () => void }
  ) => {
    setGeneralToast({ id: `toast-${Date.now()}`, title, desc, type, action });
    setTimeout(() => {
      setGeneralToast(null);
    }, action ? 8000 : 4500);
  };

  // Automatic 1-Hour Pre-Session Alert Trigger:
  // Detects any scheduled upcoming session and launches the 1-hour pre-session alert toast after 1.2 seconds
  useEffect(() => {
    const upcomingSession = bookedSessions.find((s) => s.status === 'upcoming');
    if (upcomingSession) {
      const timer = setTimeout(() => {
        setActiveSessionAlert(upcomingSession);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [bookedSessions]);

  const handleDismissSessionAlert = () => {
    setActiveSessionAlert(null);
  };

  const handleSnoozeSessionAlert = (minutes: number = 10) => {
    const sessionToSnooze = activeSessionAlert;
    setActiveSessionAlert(null);
    showToast('Reminder Snoozed', `1-hour pre-session alert snoozed. We will alert you again in ${minutes} minutes.`);
    // Demonstration snooze re-trigger after 15 seconds
    setTimeout(() => {
      if (sessionToSnooze) {
        setActiveSessionAlert(sessionToSnooze);
      }
    }, 15000);
  };

  const handleViewSessionDetails = (session: BookedTutorSession) => {
    setActiveSessionAlert(null);
    setLibraryModalInitialTab('sessions');
    setIsLibraryModalOpen(true);
  };

  // Bookmark Toggles
  const handleToggleBookmarkNote = (noteId: string) => {
    setBookmarkedNoteIds((prev) => {
      const exists = prev.includes(noteId);
      if (exists) {
        showToast('Removed from Saved', 'Note removed from your personal study library.');
        return prev.filter((id) => id !== noteId);
      } else {
        showToast('Saved to Library', 'Note bookmarked for fast exam cram and revision.');
        return [...prev, noteId];
      }
    });
  };

  const handleToggleBookmarkProject = (projId: string) => {
    setBookmarkedProjectIds((prev) => {
      const exists = prev.includes(projId);
      if (exists) {
        showToast('Removed from Saved', 'Project removed from bookmarks.');
        return prev.filter((id) => id !== projId);
      } else {
        showToast('Saved to Library', 'Project saved for capstone reference.');
        return [...prev, projId];
      }
    });
  };

  // Handlers for Rentals & Transactions with Order Tracking & Student Points
  const handleConfirmRental = (note: NoteItem, option: RentalOption | 'buy') => {
    const isBuy = option === 'buy';
    const duration = isBuy ? 'Lifetime Access' : `${option.days} Days Remaining`;
    const price = isBuy ? note.buyPrice : option.price;
    const earnedPoints = Math.round(price * 0.1);

    const newRental: ActiveRental = {
      id: `rental-${Date.now()}`,
      itemId: note.id,
      type: 'note',
      title: note.title,
      authorName: note.author.name,
      collegeName: note.collegeName,
      startDate: new Date().toISOString().split('T')[0],
      expiresAt: `${duration}`,
      daysRemaining: isBuy ? 999 : option.days,
      totalPaid: price,
    };

    // Track order for admin
    const orderNum = `ORD-VIT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      itemType: isBuy ? 'note_purchase' : 'note_rental',
      itemTitle: note.title,
      itemId: note.id,
      studentId: 'stud-1',
      studentName: 'Aarav Mehta',
      studentRoll: 'VIT-CMPN-2023-042',
      studentEmail: 'aarav.mehta@vit.edu.in',
      amount: price,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      collegeId: (note.collegeId as CampusId) || 'vit',
      collegeName: note.collegeName,
      paymentMethod: 'UPI / GPay',
      notesOrVenue: isBuy ? 'Lifetime Full PDF Access' : `${option.days} Days Rental`
    };

    // Award points transaction
    const newTx: StudentPointTransaction = {
      id: `tx-${Date.now()}`,
      studentId: 'stud-1',
      studentName: 'Aarav Mehta',
      points: earnedPoints,
      type: 'credit',
      reason: `Cashback points for renting note "${note.title.slice(0, 24)}..."`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      authorizedBy: 'Automated Academic Gateway'
    };

    setActiveRentals((prev) => [newRental, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    setPointTransactions((prev) => [newTx, ...prev]);
    setStudents((prev) => prev.map((s) => s.id === 'stud-1' ? {
      ...s,
      points: s.points + earnedPoints,
      totalOrdersCount: s.totalOrdersCount + 1,
      totalSpent: s.totalSpent + price
    } : s));

    setPreviewingNote(null);
    showToast(
      isBuy ? 'Note Purchased Successfully!' : 'Note Rental Activated!',
      `Unlocked ${note.title}. Earned +${earnedPoints} Student Points! Tracked in Orders History.`,
      'success',
      {
        label: 'Download PDF Receipt',
        onClick: () => downloadReceiptPdf(newOrder)
      }
    );
  };

  const handleConfirmProjectPurchase = (
    project: ProjectItem,
    mode: 'rent_code' | 'rent_hardware' | 'buy_full'
  ) => {
    const isHardware = mode === 'rent_hardware';
    const isBuy = mode === 'buy_full';
    const price = isBuy ? project.buyPrice : project.rentPricePerWeek * 2;
    const earnedPoints = Math.round(price * 0.08);

    const newRental: ActiveRental = {
      id: `proj-order-${Date.now()}`,
      itemId: project.id,
      type: 'project',
      title: project.title,
      authorName: project.author.name,
      collegeName: project.collegeName,
      startDate: new Date().toISOString().split('T')[0],
      expiresAt: isBuy ? 'Lifetime IP License' : '14 Days Code/Kit Rental',
      daysRemaining: isBuy ? 999 : 14,
      totalPaid: price,
    };

    const orderNum = `ORD-VIT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      itemType: isBuy ? 'project_purchase' : 'project_rental',
      itemTitle: project.title,
      itemId: project.id,
      studentId: 'stud-1',
      studentName: 'Aarav Mehta',
      studentRoll: 'VIT-CMPN-2023-042',
      studentEmail: 'aarav.mehta@vit.edu.in',
      amount: price,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'completed',
      collegeId: (project.collegeId as CampusId) || 'vit',
      collegeName: project.collegeName,
      paymentMethod: 'UPI / GPay',
      notesOrVenue: isHardware ? 'Hardware Kit - Pickup at VIT Lab' : 'GitHub Repository License'
    };

    const newTx: StudentPointTransaction = {
      id: `tx-${Date.now()}`,
      studentId: 'stud-1',
      studentName: 'Aarav Mehta',
      points: earnedPoints,
      type: 'credit',
      reason: `Project reservation for "${project.title.slice(0, 24)}..."`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      authorizedBy: 'Campus Project Registrar'
    };

    setActiveRentals((prev) => [newRental, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    setPointTransactions((prev) => [newTx, ...prev]);
    setStudents((prev) => prev.map((s) => s.id === 'stud-1' ? {
      ...s,
      points: s.points + earnedPoints,
      totalOrdersCount: s.totalOrdersCount + 1,
      totalSpent: s.totalSpent + price
    } : s));

    setInspectingProject(null);

    const title = isBuy
      ? 'Source Code Purchased!'
      : isHardware
      ? 'Hardware Kit Rental Reserved!'
      : 'Project Sandbox Rented!';

    const desc = isHardware
      ? `Kit reserved for ${project.title}. Campus handover point: ${project.collegeName} Innovation Lab. +${earnedPoints} points earned!`
      : `Repository access unlocked for ${project.title}. +${earnedPoints} points earned!`;

    showToast(title, `${desc} Tracked in Orders History.`, 'success', {
      label: 'Download PDF Receipt',
      onClick: () => downloadReceiptPdf(newOrder)
    });
  };

  const handleConfirmTutorBooking = (
    tutor: TutorItem,
    subject: string,
    day: string,
    timeSlot: string,
    topicNote: string,
    campusVenue: string
  ) => {
    const sessionCode = `PASS-${tutor.collegeId.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const earnedPoints = Math.round(tutor.hourlyRate * 0.1);

    const newSession: BookedTutorSession = {
      id: `session-${Date.now()}`,
      tutorId: tutor.id,
      tutorName: tutor.name,
      tutorAvatar: tutor.avatar,
      subject: subject,
      date: `${day}, ${timeSlot}`,
      timeSlot: timeSlot,
      amountPaid: tutor.hourlyRate,
      status: 'upcoming',
      isCollegeInPerson: true,
      collegeName: tutor.collegeName,
      campusVenue: campusVenue || `${tutor.collegeName} Central Library`,
      sessionPassCode: sessionCode,
      topicNote: topicNote || undefined,
      tutorPhone: '+91 98201 44512',
    };

    const orderNum = `ORD-VIT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      itemType: 'tutor_session',
      itemTitle: `1:1 Mentoring - ${subject}`,
      itemId: tutor.id,
      studentId: 'stud-1',
      studentName: 'Aarav Mehta',
      studentRoll: 'VIT-CMPN-2023-042',
      studentEmail: 'aarav.mehta@vit.edu.in',
      amount: tutor.hourlyRate,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'upcoming_session',
      collegeId: (tutor.collegeId as CampusId) || 'vit',
      collegeName: tutor.collegeName,
      paymentMethod: 'Campus Wallet',
      notesOrVenue: campusVenue || `${tutor.collegeName} Central Library`,
      passCode: sessionCode
    };

    const newTx: StudentPointTransaction = {
      id: `tx-${Date.now()}`,
      studentId: 'stud-1',
      studentName: 'Aarav Mehta',
      points: earnedPoints,
      type: 'credit',
      reason: `Mentorship booking with ${tutor.name}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      authorizedBy: 'VIT Peer Tutoring Cell'
    };

    setBookedSessions((prev) => [newSession, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    setPointTransactions((prev) => [newTx, ...prev]);
    setStudents((prev) => prev.map((s) => s.id === 'stud-1' ? {
      ...s,
      points: s.points + earnedPoints,
      totalOrdersCount: s.totalOrdersCount + 1,
      totalSpent: s.totalSpent + tutor.hourlyRate
    } : s));

    setBookingTutor(null);
    showToast(
      'Session Booked & Scheduled!',
      `Scheduled with ${tutor.name} at ${newSession.campusVenue} on ${day} (${timeSlot}). Earned +${earnedPoints} points!`,
      'success',
      {
        label: 'Download PDF Receipt',
        onClick: () => downloadReceiptPdf(newOrder)
      }
    );

    setTimeout(() => {
      setActiveSessionAlert(newSession);
    }, 700);
  };

  const handleUpvoteResource = (resId: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    showToast('Upvoted!', 'Thank you for supporting community-contributed academic resources.');
  };

  const handleDownloadResource = (res: CampusResourceItem) => {
    showToast('Download Started', `Downloading "${res.title}" (${res.fileSize}). Verified by campus.`);
  };

  const handleWithdrawEarnings = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      balance: 0,
    }));
  };

  const handleOpenNoteReaderFromLibrary = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (note) {
      setIsLibraryModalOpen(false);
      setPreviewingNote(note);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Main App Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
        campuses={campuses}
        activeRentalsCount={activeRentals.length}
        upcomingSessionsCount={bookedSessions.length}
        savedCount={bookmarkedNoteIds.length + bookmarkedProjectIds.length}
        onOpenCreateModal={() => setIsCreateListingModalOpen(true)}
        onOpenLibraryModal={() => {
          setLibraryModalInitialTab('rentals');
          setIsLibraryModalOpen(true);
        }}
        onOpenEarningsModal={() => setIsEarningsModalOpen(true)}
        onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        adminUser={currentAdmin}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        walletBalance={wallet.balance}
        onTriggerUpcomingAlert={() => {
          const upcoming = bookedSessions.find((s) => s.status === 'upcoming');
          if (upcoming) {
            setActiveSessionAlert(upcoming);
          }
        }}
      />

      {/* Hero Banner with Branch Filters (shown on catalog pages) */}
      {activeTab !== 'home' && (
        <HeroBanner
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          selectedCampus={selectedCampus}
          setSelectedCampus={setSelectedCampus}
          campuses={campuses}
          onOpenEarningsModal={() => setIsEarningsModalOpen(true)}
          onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
        />
      )}

      {/* Main Content Sections based on Active Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={(tab) => setActiveTab(tab)}
            selectedCampus={selectedCampus}
            setSelectedCampus={setSelectedCampus}
            campuses={campuses}
            notes={notes}
            projects={projects}
            tutors={tutors}
            resources={resources}
            onPreviewNote={(note) => setPreviewingNote(note)}
            onInspectProject={(project) => setInspectingProject(project)}
            onBookTutor={(tutor) => setBookingTutor(tutor)}
            onOpenEarningsModal={() => setIsEarningsModalOpen(true)}
            onOpenCreateModal={() => setIsCreateListingModalOpen(true)}
            onOpenStudyRoom={() => setIsStudyRoomOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'notes' && (
          <NotesHub
            notes={notes}
            selectedBranch={selectedBranch}
            selectedCampus={selectedCampus}
            searchQuery={searchQuery}
            onPreviewNote={(note) => setPreviewingNote(note)}
            onRentNote={(note) => setPreviewingNote(note)}
            bookmarkedIds={bookmarkedNoteIds}
            onToggleBookmark={handleToggleBookmarkNote}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsMarketplace
            projects={projects}
            selectedCampus={selectedCampus}
            selectedBranch={selectedBranch}
            searchQuery={searchQuery}
            onSelectProject={(project) => setInspectingProject(project)}
            bookmarkedIds={bookmarkedProjectIds}
            onToggleBookmark={handleToggleBookmarkProject}
          />
        )}

        {activeTab === 'tutors' && (
          <PeerTutorHub
            tutors={tutors}
            selectedCampus={selectedCampus}
            searchQuery={searchQuery}
            onBookTutor={(tutor) => setBookingTutor(tutor)}
          />
        )}

        {activeTab === 'resources' && (
          <CampusResourcesHub
            resources={resources}
            selectedCampus={selectedCampus}
            selectedBranch={selectedBranch}
            searchQuery={searchQuery}
            onUpvoteResource={handleUpvoteResource}
            onDownloadResource={handleDownloadResource}
            onOpenUploadModal={() => setIsCreateListingModalOpen(true)}
          />
        )}

        {activeTab === 'partnership' && (
          <CampusPartnershipHub campuses={campuses} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <VidyasysEmblem className="w-8 h-8 drop-shadow-xs" />
                <div className="flex items-baseline leading-none">
                  <span className="text-lg font-black tracking-tight text-[#0a2356]">Vidya</span>
                  <span className="text-lg font-black tracking-tight text-[#0277fa]">sys</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                One platform where students <strong className="text-[#0277fa]">Learn, Share, Build &amp; Grow.</strong> Rent high-yield senior notes, buy &amp; rent hardware project kits, book 1-on-1 peer tutors, and access free campus resources.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                Platform Pillars
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-[#0277fa] transition cursor-pointer flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="text-slate-700">🏠</span>
                    <span>Home &amp; Overview</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('notes')} className="hover:text-[#0277fa] transition cursor-pointer flex items-center gap-1.5">
                    <span className="text-blue-600">📖</span>
                    <span>Senior Notes Rental</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('projects')} className="hover:text-emerald-600 transition cursor-pointer flex items-center gap-1.5">
                    <span className="text-emerald-600">⚙️</span>
                    <span>Projects &amp; Hardware</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tutors')} className="hover:text-purple-600 transition cursor-pointer flex items-center gap-1.5">
                    <span className="text-purple-600">👥</span>
                    <span>Peer Tutoring</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('resources')} className="hover:text-orange-600 transition cursor-pointer flex items-center gap-1.5">
                    <span className="text-orange-600">🔀</span>
                    <span>Resources &amp; PYQs</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                Ecosystem &amp; Trust
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('partnership')} className="hover:text-[#0277fa] transition cursor-pointer">
                    Campus Partnerships
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsEarningsModalOpen(true)} className="hover:text-[#0277fa] transition cursor-pointer">
                    10% Fair Commission Model
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Student ID Verification</span>
                </li>
                <li>
                  <span className="text-slate-500">Academic Integrity Pledge</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                Campus Node Network
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                Active chapters across Vidyalankar Educational Campus (VIT Wadala, VP Polytechnic), IIT Bombay, BITS Pilani, DTU, and expanding nationwide.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>99.4% Student Trust Rating</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <span>© 2026 Vidyasys. One platform where students Learn, Share, Build &amp; Grow. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <button
                id="footer-admin-btn"
                onClick={() => setIsAdminPortalOpen(true)}
                className="hover:text-[#0277fa] font-semibold text-slate-700 transition cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0277fa]" />
                <span>Admin Login &amp; Student Points</span>
              </button>
              <span>•</span>
              <span className="font-bold text-[#0277fa]">Vidyasys Platform</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {previewingNote && (
        <NotePreviewModal
          note={previewingNote}
          onClose={() => setPreviewingNote(null)}
          onConfirmRental={handleConfirmRental}
          isAlreadyRented={activeRentals.some((r) => r.itemId === previewingNote?.id)}
        />
      )}

      {inspectingProject && (
        <ProjectDetailModal
          project={inspectingProject}
          onClose={() => setInspectingProject(null)}
          onConfirmPurchase={handleConfirmProjectPurchase}
        />
      )}

      {bookingTutor && (
        <TutorBookingModal
          tutor={bookingTutor}
          onClose={() => setBookingTutor(null)}
          onConfirmBooking={handleConfirmTutorBooking}
        />
      )}

      {isEarningsModalOpen && (
        <EarningsCalculatorModal
          isOpen={isEarningsModalOpen}
          onClose={() => setIsEarningsModalOpen(false)}
          onOpenCreateListing={() => setIsCreateListingModalOpen(true)}
        />
      )}

      {isCreateListingModalOpen && (
        <CreateListingModal
          isOpen={isCreateListingModalOpen}
          onClose={() => setIsCreateListingModalOpen(false)}
          selectedCampus={selectedCampus}
          campuses={campuses}
          onAddNote={(newNote) => {
            setNotes((prev) => [newNote, ...prev]);
            showToast('Note Published!', `"${newNote.title}" is now available for campus rental.`);
          }}
          onAddProject={(newProj) => {
            setProjects((prev) => [newProj, ...prev]);
            showToast('Project Listed!', `"${newProj.title}" is live on the marketplace.`);
          }}
          onAddTutor={(newTutor) => {
            setTutors((prev) => [newTutor, ...prev]);
            showToast('Tutor Profile Live!', `Students can now book 1-on-1 sessions with you.`);
          }}
          onAddResource={(newRes) => {
            setResources((prev) => [newRes, ...prev]);
            showToast('Resource Shared!', `"${newRes.title}" is live for your batchmates.`);
          }}
        />
      )}

      {isLibraryModalOpen && (
        <UserLibraryModal
          isOpen={isLibraryModalOpen}
          onClose={() => setIsLibraryModalOpen(false)}
          activeRentals={activeRentals}
          bookedSessions={bookedSessions}
          wallet={wallet}
          onOpenNoteReader={handleOpenNoteReaderFromLibrary}
          onWithdrawEarnings={handleWithdrawEarnings}
          savedNotes={notes.filter((n) => bookmarkedNoteIds.includes(n.id))}
          onRemoveBookmark={handleToggleBookmarkNote}
          onPreviewNote={(note) => setPreviewingNote(note)}
          onRentNote={(note) => setPreviewingNote(note)}
          initialTab={libraryModalInitialTab}
          onTriggerSessionAlert={(session) => {
            setActiveSessionAlert(session);
          }}
          orders={orders}
          studentName="Aarav Mehta"
          studentRoll="VIT-CMPN-2023-042"
          studentEmail="aarav.mehta@vit.edu.in"
        />
      )}

      {isStudyRoomOpen && (
        <CampusStudyRoomModal
          isOpen={isStudyRoomOpen}
          onClose={() => setIsStudyRoomOpen(false)}
          selectedCampus={selectedCampus}
          campuses={campuses}
        />
      )}

      {/* Admin Portal Modal (Manage Student Points & Track Orders) */}
      {isAdminPortalOpen && (
        <AdminPortalModal
          isOpen={isAdminPortalOpen}
          onClose={() => setIsAdminPortalOpen(false)}
          students={students}
          onUpdateStudents={setStudents}
          pointTransactions={pointTransactions}
          onAddPointTransaction={(tx) => setPointTransactions((prev) => [tx, ...prev])}
          orders={orders}
          onUpdateOrders={setOrders}
          isAdminLoggedIn={isAdminLoggedIn}
          setIsAdminLoggedIn={setIsAdminLoggedIn}
          adminUser={currentAdmin}
        />
      )}

      {/* Floating Quick Admin Trigger */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          id="floating-admin-quick-btn"
          onClick={() => setIsAdminPortalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-white shadow-lg backdrop-blur-xs text-xs font-medium border border-slate-700 transition cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isAdminLoggedIn ? currentAdmin.name.split(' ')[0] + ' (Admin)' : 'Admin Portal & Points'}</span>
          {isAdminLoggedIn ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ) : (
            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              Access
            </span>
          )}
        </button>
      </div>

      {/* 1-Hour Pre-Session Toast Alert & Notification System */}
      <PreSessionToastNotification
        sessionAlert={activeSessionAlert}
        onDismissSessionAlert={handleDismissSessionAlert}
        onSnoozeSessionAlert={handleSnoozeSessionAlert}
        onViewSessionDetails={handleViewSessionDetails}
        generalToast={generalToast}
        onDismissGeneralToast={() => setGeneralToast(null)}
      />
    </div>
  );
}
