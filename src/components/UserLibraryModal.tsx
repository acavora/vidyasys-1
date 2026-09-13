import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  GraduationCap, 
  Wallet, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  Calendar,
  Sparkles,
  Download,
  ShieldCheck,
  Bookmark,
  Trash2,
  Eye,
  Star,
  Building2,
  MapPin,
  QrCode,
  Phone,
  Ticket,
  Copy,
  Info,
  Bell,
  Search,
  Layers,
  User,
  CreditCard,
  Check
} from 'lucide-react';
import { ActiveRental, BookedTutorSession, UserWallet, NoteItem, OrderRecord } from '../types';
import { downloadReceiptPdf, formatOrderTypeLabel } from '../utils/pdfReceiptGenerator';
import { ReceiptVoucherModal } from './ReceiptVoucherModal';
import { VidyasysEmblem } from './VidyasysLogo';

interface UserLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRentals: ActiveRental[];
  bookedSessions: BookedTutorSession[];
  wallet: UserWallet;
  onOpenNoteReader: (noteId: string) => void;
  onWithdrawEarnings: (amount: number) => void;
  savedNotes?: NoteItem[];
  onRemoveBookmark?: (noteId: string) => void;
  onPreviewNote?: (note: NoteItem) => void;
  onRentNote?: (note: NoteItem) => void;
  initialTab?: 'rentals' | 'sessions' | 'saved' | 'wallet' | 'orders';
  onTriggerSessionAlert?: (session: BookedTutorSession) => void;
  orders?: OrderRecord[];
  studentName?: string;
  studentRoll?: string;
  studentEmail?: string;
}

export const UserLibraryModal: React.FC<UserLibraryModalProps> = ({
  isOpen,
  onClose,
  activeRentals,
  bookedSessions,
  wallet,
  onOpenNoteReader,
  onWithdrawEarnings,
  savedNotes = [],
  onRemoveBookmark,
  onPreviewNote,
  onRentNote,
  initialTab = 'rentals',
  onTriggerSessionAlert,
  orders = [],
  studentName = 'Rohan Sharma',
  studentRoll = '23101C0072',
  studentEmail = 'rohan.sharma@vit.edu.in',
}) => {
  const [activeTab, setActiveTab] = useState<'rentals' | 'sessions' | 'saved' | 'wallet' | 'orders'>(initialTab);
  const [selectedVoucherOrder, setSelectedVoucherOrder] = useState<OrderRecord | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'notes' | 'tutors' | 'projects'>('all');
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [selectedPassSession, setSelectedPassSession] = useState<BookedTutorSession | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Helper to generate or find receipt for a rental
  const getReceiptForRental = (rental: ActiveRental): OrderRecord => {
    const existing = orders.find(o => o.itemId === rental.itemId);
    if (existing) return existing;
    return {
      id: `ord-rent-${rental.id}`,
      orderNumber: `ORD-VIT-${rental.id.replace(/[^0-9]/g, '') || '9102'}`,
      studentId: 'stud-vit-3',
      studentName,
      studentRoll,
      studentEmail,
      collegeId: 'vit',
      collegeName: rental.collegeName || 'Vidyalankar Institute of Technology (VIT)',
      itemType: rental.type === 'note' ? 'note_rental' : 'project_rental',
      itemTitle: rental.title,
      itemId: rental.itemId,
      amount: rental.totalPaid || 79,
      paymentMethod: 'UPI / GPay',
      date: rental.startDate || new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'active_rental',
      notesOrVenue: `${rental.expiresAt} (DRM Watermark Protected)`,
      passCode: `PASS-RENT-${rental.id.slice(-4).toUpperCase()}`
    };
  };

  // Helper to generate or find receipt for a tutor session
  const getReceiptForSession = (session: BookedTutorSession): OrderRecord => {
    const existing = orders.find(o => o.itemId === session.tutorId || o.passCode === session.sessionPassCode);
    if (existing) return existing;
    return {
      id: `ord-sess-${session.id}`,
      orderNumber: `ORD-VIT-${session.sessionPassCode?.replace(/[^0-9]/g, '') || '9204'}`,
      studentId: 'stud-vit-3',
      studentName,
      studentRoll,
      studentEmail,
      collegeId: 'vit',
      collegeName: session.collegeName || 'Vidyalankar Institute of Technology (VIT)',
      itemType: 'tutor_session',
      itemTitle: `1:1 Mentoring with ${session.tutorName} (${session.subject})`,
      itemId: session.tutorId,
      amount: session.amountPaid || 299,
      paymentMethod: 'Campus Wallet',
      date: `${session.date} ${session.timeSlot}`,
      status: 'upcoming_session',
      notesOrVenue: session.campusVenue || 'B-Block Central Library Pods',
      passCode: session.sessionPassCode
    };
  };

  const handleDownloadReceipt = (order: OrderRecord) => {
    setDownloadingOrderId(order.id);
    try {
      downloadReceiptPdf(order);
    } catch (e) {
      console.error('PDF download error:', e);
    } finally {
      setTimeout(() => setDownloadingOrderId(null), 1000);
    }
  };

  // Filter orders for current student
  const studentOrders = orders.filter(
    (o) =>
      o.studentId === 'stud-vit-3' ||
      o.studentId === 'stud-1' ||
      o.studentName.toLowerCase().includes('rohan') ||
      o.studentName.toLowerCase().includes('aarav')
  );

  const filteredOrders = studentOrders.filter((order) => {
    const matchesSearch = 
      order.itemTitle.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      (order.notesOrVenue && order.notesOrVenue.toLowerCase().includes(orderSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (orderTypeFilter === 'notes') {
      return order.itemType === 'note_rental' || order.itemType === 'note_purchase';
    }
    if (orderTypeFilter === 'tutors') {
      return order.itemType === 'tutor_session';
    }
    if (orderTypeFilter === 'projects') {
      return order.itemType === 'project_rental' || order.itemType === 'project_purchase';
    }
    return true;
  });

  const handleWithdraw = () => {
    if (wallet.balance <= 0) return;
    onWithdrawEarnings(wallet.balance);
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="user-library-modal-dialog"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <VidyasysEmblem className="w-6 h-6 inline-block" />
              <span>My Vidyasys Library</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#0277fa] border border-blue-200">
                Student Account
              </span>
              <span className="hidden sm:inline text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                Learn, Share, Build &amp; Grow
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your active note rentals, scheduled peer tutoring sessions, saved bookmarks, order history, and downloadable PDF receipts.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('rentals')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'rentals'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Active Rentals ({activeRentals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Peer Sessions ({bookedSessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'saved'
                ? 'border-amber-600 text-amber-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'wallet'
                ? 'border-purple-600 text-purple-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallet (₹{wallet.balance.toLocaleString()})</span>
          </button>

          <button
            id="user-library-orders-tab-btn"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-3 sm:px-4 flex items-center justify-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Orders & Receipts ({studentOrders.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs bg-slate-50/50">
          {/* Active Rentals Tab */}
          {activeTab === 'rentals' && (
            <div className="space-y-3">
              {activeRentals.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No active note or project rentals</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Explore the Notes Hub to rent verified senior exam notes for your current semester.
                  </p>
                </div>
              ) : (
                activeRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                          {rental.type === 'note' ? 'Senior Note Rental' : 'Project Sandbox'}
                        </span>
                        <span className="text-slate-500 text-xs">{rental.collegeName}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {rental.title}
                      </h4>

                      <div className="flex items-center gap-3 text-slate-500 text-xs">
                        <span>By {rental.authorName}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {rental.expiresAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          const receiptOrder = getReceiptForRental(rental);
                          handleDownloadReceipt(receiptOrder);
                        }}
                        disabled={downloadingOrderId === `ord-rent-${rental.id}`}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer text-xs border border-slate-200"
                        title="Download PDF Summary Receipt"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>PDF Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenNoteReader(rental.itemId);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open Note Reader</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Booked Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-3">
              {bookedSessions.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                  <GraduationCap className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No upcoming tutoring sessions scheduled</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Book a 1-on-1 exam doubt session with a campus subject topper in college.
                  </p>
                </div>
              ) : (
                bookedSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <img
                        src={session.tutorAvatar}
                        alt={session.tutorName}
                        className="w-11 h-11 rounded-full object-cover border border-emerald-300 flex-shrink-0 mt-0.5"
                      />
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {session.tutorName}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Upcoming
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> In-Person in College
                          </span>
                        </div>

                        <p className="text-xs text-indigo-700 font-medium truncate">
                          {session.subject}
                        </p>

                        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{session.date}</span>
                          <span>•</span>
                          <span>{session.timeSlot}</span>
                        </div>

                        {session.topicNote && (
                          <p className="text-[11px] text-slate-500 italic line-clamp-1">
                            Topic: "{session.topicNote}"
                          </p>
                        )}

                        {/* College In-Person Venue Box */}
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <div className="flex items-start gap-1.5 text-xs text-slate-800">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-slate-900">Meeting Venue in College: </span>
                              <span className="text-slate-700 font-medium">
                                {session.campusVenue || `${session.collegeName || 'Campus'} Central Library`}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1 border-t border-slate-200/70">
                            <span className="flex items-center gap-1 font-mono text-slate-700">
                              <Ticket className="w-3 h-3 text-indigo-600" />
                              Pass Code: <strong className="text-slate-900">{session.sessionPassCode || 'PASS-COLLEGE-892'}</strong>
                            </span>
                            {session.tutorPhone && (
                              <span className="flex items-center gap-1 text-slate-600">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                Tutor: {session.tutorPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start sm:self-center flex-shrink-0">
                      <button
                        onClick={() => {
                          const receiptOrder = getReceiptForSession(session);
                          handleDownloadReceipt(receiptOrder);
                        }}
                        disabled={downloadingOrderId === `ord-sess-${session.id}`}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer text-xs border border-slate-200"
                        title="Download Official PDF Receipt & Pass"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>PDF Receipt</span>
                      </button>

                      <button
                        onClick={() => setSelectedPassSession(session)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer text-xs"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View College Pass</span>
                      </button>

                      <button
                        onClick={() => {
                          onTriggerSessionAlert?.(session);
                          onClose();
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer text-xs"
                        title="Trigger 1-Hour Pre-Session Toast Alert"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                        <span>1-Hr Alert Toast</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Saved & Bookmarks Tab */}
          {activeTab === 'saved' && (
            <div className="space-y-3">
              {savedNotes.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                  <Bookmark className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No saved items yet</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Click the bookmark icon on any note in the Notes Hub to save it here for fast exam revision.
                  </p>
                </div>
              ) : (
                savedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          {note.subject} • Sem {note.semester}
                        </span>
                        <span className="text-slate-500 text-xs">{note.collegeName}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {note.title}
                      </h4>

                      <div className="flex items-center gap-3 text-slate-500 text-xs">
                        <span>By {note.author.name} ({note.author.gradeAchieved})</span>
                        <span>•</span>
                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {note.rating.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {onPreviewNote && (
                        <button
                          onClick={() => {
                            onClose();
                            onPreviewNote(note);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer flex items-center gap-1 border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      )}

                      {onRentNote && (
                        <button
                          onClick={() => {
                            onClose();
                            onRentNote(note);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                        >
                          Rent (₹{Math.min(...note.rentalOptions.map((r) => r.price))})
                        </button>
                      )}

                      {onRemoveBookmark && (
                        <button
                          onClick={() => onRemoveBookmark(note.id)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition cursor-pointer border border-slate-200"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Student Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              {/* Wallet Balance Banner */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                <div>
                  <span className="text-[11px] text-amber-900 uppercase font-semibold">
                    Available Creator Payout Balance
                  </span>
                  <p className="text-3xl font-extrabold text-amber-800 mt-1">
                    ₹{wallet.balance.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Net 90% payout from notes rented and peer tutoring
                  </p>
                </div>

                <button
                  onClick={handleWithdraw}
                  disabled={wallet.balance <= 0}
                  className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer shadow-xs ${
                    wallet.balance > 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Instant UPI / Bank Transfer</span>
                </button>
              </div>

              {withdrawSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Transfer initiated successfully to registered student UPI ID! Funds arrive within 5 minutes.</span>
                </div>
              )}

              {/* Earnings Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500">Total Lifetime Earned</span>
                  <p className="text-lg font-bold text-slate-900 mt-1">₹{wallet.totalEarned.toLocaleString()}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500">Notes Rented Out</span>
                  <p className="text-lg font-bold text-indigo-700 mt-1">{wallet.notesRentedOut} times</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-slate-500">Tutoring Hours Delivered</span>
                  <p className="text-lg font-bold text-emerald-700 mt-1">{wallet.tutoringHoursDelivered} hours</p>
                </div>
              </div>
            </div>
          )}

          {/* Orders History & Downloadable Receipts Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="order-search-input"
                    type="text"
                    placeholder="Search by order ID, course note, or tutor..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setOrderTypeFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition whitespace-nowrap ${
                      orderTypeFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All ({studentOrders.length})
                  </button>
                  <button
                    onClick={() => setOrderTypeFilter('notes')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition whitespace-nowrap ${
                      orderTypeFilter === 'notes'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setOrderTypeFilter('tutors')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition whitespace-nowrap ${
                      orderTypeFilter === 'tutors'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tutoring Passes
                  </button>
                  <button
                    onClick={() => setOrderTypeFilter('projects')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition whitespace-nowrap ${
                      orderTypeFilter === 'projects'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Projects
                  </button>
                </div>
              </div>

              {/* Order Cards List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-xl border border-dashed border-slate-300">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No orders or receipts found</p>
                  <p className="text-slate-500 text-xs mt-1">
                    When you rent notes or book peer tutoring sessions, official summary receipts appear here with instant PDF download.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => {
                    const isDownloading = downloadingOrderId === order.id;
                    const pointsEarned = Math.round(order.amount * 0.1);
                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {order.orderNumber}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {order.date}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              order.status === 'upcoming_session'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : order.status === 'active_rental'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {order.status === 'upcoming_session' ? 'Confirmed Pass' : order.status === 'active_rental' ? 'Active Rental' : 'Completed'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {order.collegeId === 'vp' ? 'VP Polytechnic' : 'VIT Wadala'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-extrabold text-slate-900">
                              ₹{order.amount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              via {order.paymentMethod}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700">
                                {formatOrderTypeLabel(order.itemType)}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {order.itemTitle}
                            </h4>
                            {order.notesOrVenue && (
                              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{order.notesOrVenue}</span>
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                              {order.passCode && (
                                <span className="font-mono text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                                  Pass Code: {order.passCode}
                                </span>
                              )}
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-emerald-500" />
                                +{pointsEarned} Student Points Credited
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                            <button
                              id={`preview-receipt-btn-${order.id}`}
                              onClick={() => setSelectedVoucherOrder(order)}
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200"
                              title="Preview official receipt voucher on screen"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span>Preview</span>
                            </button>

                            <button
                              id={`download-pdf-receipt-btn-${order.id}`}
                              onClick={() => handleDownloadReceipt(order)}
                              disabled={isDownloading}
                              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-60"
                              title="Download official PDF receipt"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{isDownloading ? 'Generating...' : 'Download PDF Receipt'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition cursor-pointer text-xs border border-slate-200"
          >
            Close
          </button>
        </div>

        {/* College In-Person Meetup Pass Modal */}
        {selectedPassSession && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">In-Person College Meetup Pass</h3>
                    <p className="text-[11px] text-slate-500">Official Campus Peer Tutoring Verification</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPassSession(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pass Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedPassSession.collegeName || 'College Campus'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {selectedPassSession.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={selectedPassSession.tutorAvatar}
                    alt={selectedPassSession.tutorName}
                    className="w-11 h-11 rounded-full object-cover border border-emerald-300"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedPassSession.tutorName}</h4>
                    <p className="text-xs text-indigo-700 font-medium">{selectedPassSession.subject}</p>
                  </div>
                </div>

                {/* Venue details */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    In-Person Meeting Spot in College:
                  </span>
                  <div className="flex items-start gap-1.5 text-xs font-semibold text-slate-800">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{selectedPassSession.campusVenue || `${selectedPassSession.collegeName} Central Library`}</span>
                  </div>
                </div>

                {/* Verification Code Box */}
                <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-800">Mutual Verification Code</span>
                    <p className="text-lg font-mono font-extrabold text-indigo-950">
                      {selectedPassSession.sessionPassCode || 'PASS-COLLEGE-892'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyCode(selectedPassSession.sessionPassCode || 'PASS-COLLEGE-892')}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Instructions */}
                <div className="text-[11px] text-slate-600 space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>College Campus Meetup Guidelines:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                    <li>This is an in-person session in college (no online video call).</li>
                    <li>Meet directly at the designated campus room or discussion pod.</li>
                    <li>Show your college student ID card and verify this Pass Code with your peer tutor.</li>
                    <li>Payment is safely held in Vidyasys Escrow until the session finishes.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                {selectedPassSession.tutorPhone && (
                  <a
                    href={`tel:${selectedPassSession.tutorPhone}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Tutor</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    const receiptOrder = getReceiptForSession(selectedPassSession);
                    handleDownloadReceipt(receiptOrder);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                  title="Download PDF Pass and Summary Receipt"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-600" />
                  <span>PDF Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedPassSession(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer transition"
                >
                  Close Pass
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Official PDF Receipt Voucher Modal */}
        {selectedVoucherOrder && (
          <ReceiptVoucherModal
            order={selectedVoucherOrder}
            isOpen={!!selectedVoucherOrder}
            onClose={() => setSelectedVoucherOrder(null)}
          />
        )}
      </div>
    </div>
  );
};
