import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Award,
  ShoppingBag,
  Search,
  Filter,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  ArrowRight,
  LogOut,
  Sparkles,
  FileText,
  Clock,
  ChevronRight,
  RefreshCw,
  Building2,
  Layers,
  Eye,
  User,
  Check,
  CreditCard,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { 
  CampusId, 
  StudentProfile, 
  StudentPointTransaction, 
  OrderRecord, 
  AdminUser, 
  OrderStatus, 
  OrderItemType 
} from '../types';
import { downloadReceiptPdf } from '../utils/pdfReceiptGenerator';
import { VidyasysEmblem } from './VidyasysLogo';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  adminUser: AdminUser;
  students: StudentProfile[];
  onUpdateStudents: (updated: StudentProfile[]) => void;
  pointTransactions: StudentPointTransaction[];
  onAddPointTransaction: (tx: StudentPointTransaction) => void;
  orders: OrderRecord[];
  onUpdateOrders: (updated: OrderRecord[]) => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  adminUser,
  students,
  onUpdateStudents,
  pointTransactions,
  onAddPointTransaction,
  orders,
  onUpdateOrders,
}) => {
  // Login form state
  const [emailInput, setEmailInput] = useState('admin@vidyalankar.edu');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<'students' | 'orders' | 'transactions' | 'reports'>('students');

  // Student Filter States
  const [studentSearch, setStudentSearch] = useState('');
  const [studentCampusFilter, setStudentCampusFilter] = useState<'all' | 'vit' | 'vp'>('all');

  // Point Adjustment Drawer/Modal State
  const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<StudentProfile | null>(null);
  const [pointAmount, setPointAmount] = useState<number>(100);
  const [pointActionType, setPointActionType] = useState<'credit' | 'debit'>('credit');
  const [pointReason, setPointReason] = useState('Topper Exam Notes Contribution Reward');
  const [customReason, setCustomReason] = useState('');
  const [pointsSuccessMsg, setPointsSuccessMsg] = useState('');

  // Orders Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [orderCampusFilter, setOrderCampusFilter] = useState<'all' | 'vit' | 'vp'>('all');
  const [orderSuccessMsg, setOrderSuccessMsg] = useState('');

  // Handle Admin Sign In
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      // Accept demo admin credentials or any reasonable input
      if (emailInput.toLowerCase().includes('admin') || emailInput.toLowerCase().includes('vidyalankar')) {
        setIsAdminLoggedIn(true);
        setIsLoggingIn(false);
      } else {
        setLoginError('Invalid credentials. Please use admin@vidyalankar.edu or click the 1-Click Demo Login button.');
        setIsLoggingIn(false);
      }
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmailInput('admin@vidyalankar.edu');
    setPasswordInput('admin123');
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = 
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.branch.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase());
      
      const matchesCampus = 
        studentCampusFilter === 'all' || 
        student.collegeId === studentCampusFilter;

      return matchesSearch && matchesCampus;
    });
  }, [students, studentSearch, studentCampusFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.studentName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.studentRoll.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.itemTitle.toLowerCase().includes(orderSearch.toLowerCase());
      
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesType = orderTypeFilter === 'all' || order.itemType === orderTypeFilter;
      const matchesCampus = orderCampusFilter === 'all' || order.collegeId === orderCampusFilter;

      return matchesSearch && matchesStatus && matchesType && matchesCampus;
    });
  }, [orders, orderSearch, orderStatusFilter, orderTypeFilter, orderCampusFilter]);

  // Total Points across all students
  const totalPoints = useMemo(() => {
    return students.reduce((acc, s) => acc + s.points, 0);
  }, [students]);

  // Total Orders Revenue GMV
  const totalGMV = useMemo(() => {
    return orders.reduce((acc, o) => acc + o.amount, 0);
  }, [orders]);

  // Execute Point Adjustment
  const handleApplyPointAdjustment = () => {
    if (!selectedStudentForPoints || pointAmount <= 0) return;

    const finalReason = customReason.trim() ? customReason : pointReason;
    const finalPoints = pointActionType === 'credit' 
      ? selectedStudentForPoints.points + pointAmount
      : Math.max(0, selectedStudentForPoints.points - pointAmount);

    // Update students state
    const updatedStudents = students.map((s) => {
      if (s.id === selectedStudentForPoints.id) {
        return {
          ...s,
          points: finalPoints,
          tier: finalPoints >= 2000 ? ('Gold Scholar' as const) : finalPoints >= 1000 ? ('Silver Scholar' as const) : ('Bronze Scholar' as const),
        };
      }
      return s;
    });

    onUpdateStudents(updatedStudents);

    // Record Point Transaction
    const newTx: StudentPointTransaction = {
      id: `pt-${Date.now()}`,
      studentId: selectedStudentForPoints.id,
      studentName: selectedStudentForPoints.name,
      points: pointAmount,
      type: pointActionType,
      reason: finalReason,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      authorizedBy: `${adminUser.name} (${adminUser.role})`,
    };

    onAddPointTransaction(newTx);

    setPointsSuccessMsg(
      `Successfully ${pointActionType === 'credit' ? 'credited' : 'deducted'} ${pointAmount} points ${pointActionType === 'credit' ? 'to' : 'from'} ${selectedStudentForPoints.name}!`
    );

    setTimeout(() => {
      setSelectedStudentForPoints(null);
      setCustomReason('');
      setPointsSuccessMsg('');
    }, 1800);
  };

  // Update Order Status (Mark Completed or Refund)
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    onUpdateOrders(updated);
    setOrderSuccessMsg(`Order status updated to "${newStatus.replace('_', ' ').toUpperCase()}".`);
    setTimeout(() => setOrderSuccessMsg(''), 2500);
  };

  // Export CSV Helper
  const handleExportCSV = (dataType: 'students' | 'orders') => {
    if (dataType === 'students') {
      const headers = 'ID,RollNo,Name,Email,Campus,Branch,Semester,Points,Tier,TotalSpent\n';
      const rows = students.map(s => `"${s.id}","${s.rollNo}","${s.name}","${s.email}","${s.collegeName}","${s.branch}",${s.semester},${s.points},"${s.tier}",${s.totalSpent}`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vidyalankar_students_points_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } else {
      const headers = 'OrderNumber,Date,StudentName,RollNo,Campus,ItemType,ItemTitle,AmountINR,PaymentMethod,Status\n';
      const rows = orders.map(o => `"${o.orderNumber}","${o.date}","${o.studentName}","${o.studentRoll}","${o.collegeName}","${o.itemType}","${o.itemTitle}",${o.amount},"${o.paymentMethod}","${o.status}"`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vidyalankar_orders_ledger_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        id="admin-portal-modal-container"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <VidyasysEmblem className="w-10 h-10 drop-shadow-sm flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Vidyasys Academic Admin Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {isAdminLoggedIn ? 'SuperAdmin Authenticated' : 'Institutional Login'}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                  Learn, Share, Build &amp; Grow
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit campus note rentals, track student reward points, generate PDF receipts, and manage verified assets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                id="admin-logout-btn"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer border border-slate-700"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              id="admin-portal-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View 1: If NOT Logged in -> Clean Admin Login Screen */}
        {!isAdminLoggedIn ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Admin & Dean Authorization
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6">
              Sign in to manage student academic reward points, track note rentals, inspect project orders, and review faculty verifications for Vidyalankar Wadala Campus.
            </p>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-sm text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full max-w-sm text-left space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Admin Email
                </label>
                <input
                  id="admin-email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@vidyalankar.edu"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security Password
                </label>
                <input
                  id="admin-password-input"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition"
                  required
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="admin-submit-login-btn"
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoggingIn ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
                </button>

                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative bg-white px-2 text-[11px] text-slate-400 uppercase font-medium">
                    Quick Access
                  </span>
                </div>

                <button
                  id="admin-quick-demo-btn"
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>1-Click Demo Login (Dean Dr. Sunil Patekar)</span>
                </button>
              </div>
            </form>

            <p className="text-[11px] text-slate-400 mt-6 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Protected by Vidyalankar Academic ERP & Audit Systems
            </p>
          </div>
        ) : (
          /* View 2: Logged In Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Top Admin Sub-bar with Active Profile & Overall Stats */}
            <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={adminUser.avatar}
                  alt={adminUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{adminUser.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                      {adminUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {adminUser.department} • {adminUser.email}
                  </p>
                </div>
              </div>

              {/* KPI metrics pills */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900">
                  <span className="text-[10px] text-indigo-600 font-semibold block uppercase">Total Students</span>
                  <strong className="text-sm font-bold">{students.length} Enrolled</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-900">
                  <span className="text-[10px] text-amber-600 font-semibold block uppercase">Reward Points Pool</span>
                  <strong className="text-sm font-bold">{totalPoints.toLocaleString()} Pts</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900">
                  <span className="text-[10px] text-emerald-600 font-semibold block uppercase">Tracked Orders</span>
                  <strong className="text-sm font-bold">{orders.length} (₹{totalGMV.toLocaleString()})</strong>
                </div>
              </div>
            </div>

            {/* Admin Tabs */}
            <div className="px-5 pt-2 bg-white border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  id="admin-tab-students-btn"
                  onClick={() => setAdminTab('students')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'students'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Students & Points ({students.length})</span>
                </button>

                <button
                  id="admin-tab-orders-btn"
                  onClick={() => setAdminTab('orders')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'orders'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Orders & Transactions Tracker ({orders.length})</span>
                </button>

                <button
                  id="admin-tab-transactions-btn"
                  onClick={() => setAdminTab('transactions')}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition cursor-pointer whitespace-nowrap ${
                    adminTab === 'transactions'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Points Audit Trail ({pointTransactions.length})</span>
                </button>
              </div>

              {/* Quick CSV Export */}
              <div className="flex items-center gap-2 pb-1">
                <button
                  id="admin-export-students-btn"
                  onClick={() => handleExportCSV('students')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                  title="Export Student Points Ledger"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Points</span>
                </button>
                <button
                  id="admin-export-orders-btn"
                  onClick={() => handleExportCSV('orders')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition cursor-pointer"
                  title="Export Orders Ledger"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Orders</span>
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {orderSuccessMsg && (
              <div className="mx-5 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{orderSuccessMsg}</span>
                </div>
                <button onClick={() => setOrderSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab 1: STUDENTS & POINTS MANAGEMENT */}
            {adminTab === 'students' && (
              <div className="flex-1 p-5 overflow-y-auto">
                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="admin-student-search-input"
                      type="text"
                      placeholder="Search student by name, roll no, branch..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-600 shadow-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-slate-500 font-medium">Campus:</span>
                    <button
                      onClick={() => setStudentCampusFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        studentCampusFilter === 'all'
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      All ({students.length})
                    </button>
                    <button
                      onClick={() => setStudentCampusFilter('vit')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        studentCampusFilter === 'vit'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      VIT Degree ({students.filter(s => s.collegeId === 'vit').length})
                    </button>
                    <button
                      onClick={() => setStudentCampusFilter('vp')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        studentCampusFilter === 'vp'
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
                      }`}
                    >
                      VP Polytechnic ({students.filter(s => s.collegeId === 'vp').length})
                    </button>
                  </div>
                </div>

                {/* Students Table / Grid */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">Student Details</th>
                          <th className="px-3 py-3">Roll No</th>
                          <th className="px-3 py-3">Campus & Branch</th>
                          <th className="px-3 py-3 text-center">Academic Points</th>
                          <th className="px-3 py-3 text-center">Tier</th>
                          <th className="px-3 py-3 text-center">Activity</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                              No students found matching your filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                                  />
                                  <div>
                                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                      <span>{student.name}</span>
                                      {student.id === 'stud-vit-3' && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-100 text-indigo-800">
                                          YOU
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-slate-400">{student.email}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="px-3 py-3 font-mono text-slate-700 font-medium">
                                {student.rollNo}
                              </td>

                              <td className="px-3 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-0.5 ${
                                  student.collegeId === 'vit' 
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                                }`}>
                                  {student.collegeId === 'vit' ? 'VIT Wadala' : 'VP Polytechnic'}
                                </span>
                                <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                                  {student.branch} (Sem {student.semester})
                                </div>
                              </td>

                              <td className="px-3 py-3 text-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs shadow-2xs">
                                  <Award className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{student.points.toLocaleString()} pts</span>
                                </span>
                              </td>

                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  student.tier === 'Gold Scholar'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : student.tier === 'Silver Scholar'
                                    ? 'bg-slate-200 text-slate-800 border border-slate-300'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {student.tier}
                                </span>
                              </td>

                              <td className="px-3 py-3 text-center text-[11px] text-slate-500">
                                <div>{student.notesUploaded} Notes • {student.projectsListed} Proj</div>
                                <div className="text-[10px] text-slate-400">{student.sessionsConducted} Tutors • ₹{student.totalSpent} Spent</div>
                              </td>

                              <td className="px-4 py-3 text-right">
                                <button
                                  id={`adjust-points-btn-${student.id}`}
                                  onClick={() => setSelectedStudentForPoints(student)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold transition cursor-pointer shadow-xs whitespace-nowrap"
                                >
                                  <Award className="w-3 h-3 text-indigo-600" />
                                  <span>Adjust Points</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: ORDERS & TRANSACTIONS TRACKER */}
            {adminTab === 'orders' && (
              <div className="flex-1 p-5 overflow-y-auto">
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="admin-orders-search-input"
                      type="text"
                      placeholder="Search order #, student name, roll, item..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-600 shadow-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
                    <select
                      value={orderCampusFilter}
                      onChange={(e) => setOrderCampusFilter(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-600 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Campuses</option>
                      <option value="vit">VIT Wadala</option>
                      <option value="vp">VP Polytechnic</option>
                    </select>

                    <select
                      value={orderTypeFilter}
                      onChange={(e) => setOrderTypeFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-600 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Item Types</option>
                      <option value="note_rental">Note Rentals</option>
                      <option value="note_purchase">Note Purchases</option>
                      <option value="project_rental">Hardware Kit Rentals</option>
                      <option value="project_purchase">Project Purchases</option>
                      <option value="tutor_session">Peer Tutoring</option>
                    </select>

                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:border-indigo-600 cursor-pointer shadow-xs"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active_rental">Active Rentals</option>
                      <option value="upcoming_session">Upcoming Sessions</option>
                      <option value="completed">Completed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
                      No orders found matching your search and filter parameters.
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                            order.itemType.includes('note')
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                              : order.itemType.includes('project')
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            {order.itemType.includes('note') ? (
                              <FileText className="w-5 h-5" />
                            ) : order.itemType.includes('project') ? (
                              <Layers className="w-5 h-5" />
                            ) : (
                              <UserCheck className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                                #{order.orderNumber}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500">{order.date}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.status === 'active_rental'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : order.status === 'upcoming_session'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : order.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {order.status.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                order.collegeId === 'vit' 
                                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                                  : 'bg-teal-50 text-teal-700 border border-teal-200'
                              }`}>
                                {order.collegeId === 'vit' ? 'VIT Wadala' : 'VP Polytechnic'}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 mb-1">
                              {order.itemTitle}
                            </h4>

                            <div className="flex items-center gap-3 text-[11px] text-slate-600 flex-wrap">
                              <span className="flex items-center gap-1 font-medium text-slate-800">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {order.studentName} ({order.studentRoll})
                              </span>
                              <span>•</span>
                              <span>{order.studentEmail}</span>
                              {order.notesOrVenue && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-500 italic">{order.notesOrVenue}</span>
                                </>
                              )}
                              {order.passCode && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono bg-slate-100 px-1 rounded text-slate-700 font-semibold">
                                    Pass: {order.passCode}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Right Column: Amount & Status Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                          <div className="text-left md:text-right">
                            <span className="text-base font-bold text-slate-900 block">
                              ₹{order.amount}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              via {order.paymentMethod}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <button
                              id={`order-pdf-btn-${order.id}`}
                              onClick={() => downloadReceiptPdf(order)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-[11px] transition cursor-pointer flex items-center gap-1"
                              title="Download Student PDF Summary Receipt"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>PDF Receipt</span>
                            </button>

                            {order.status !== 'completed' && (
                              <button
                                id={`order-complete-btn-${order.id}`}
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold text-[11px] transition cursor-pointer"
                                title="Mark as Completed"
                              >
                                Mark Completed
                              </button>
                            )}
                            {order.status !== 'refunded' && (
                              <button
                                id={`order-refund-btn-${order.id}`}
                                onClick={() => handleUpdateOrderStatus(order.id, 'refunded')}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] transition cursor-pointer"
                                title="Issue Refund & Cancel"
                              >
                                Refund
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: POINTS AUDIT LOG */}
            {adminTab === 'transactions' && (
              <div className="flex-1 p-5 overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Academic Reward Points Ledger & Audit Trail</h3>
                    <p className="text-xs text-slate-500">Chronological history of all credits and deductions granted across colleges.</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Timestamp</th>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-3 py-3 text-center">Adjustment</th>
                        <th className="px-4 py-3">Reason / Description</th>
                        <th className="px-4 py-3 text-right">Authorized By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pointTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                            No point transactions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        pointTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                            <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                              {tx.timestamp}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-800">
                              {tx.studentName}
                            </td>
                            <td className="px-3 py-3 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-xs ${
                                tx.type === 'credit'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {tx.type === 'credit' ? '+' : '-'}{tx.points} pts
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 max-w-sm">
                              {tx.reason}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-500 text-[11px]">
                              {tx.authorizedBy}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Adjust Points Modal Drawer */}
        {selectedStudentForPoints && (
          <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div 
              id="points-adjustment-modal-box"
              className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 text-slate-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Adjust Student Academic Points
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {selectedStudentForPoints.name} ({selectedStudentForPoints.rollNo})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudentForPoints(null)}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {pointsSuccessMsg ? (
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-800">{pointsSuccessMsg}</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Current Balance</span>
                      <strong className="text-base text-slate-900 font-bold">
                        {selectedStudentForPoints.points.toLocaleString()} Points
                      </strong>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {selectedStudentForPoints.tier}
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Adjustment Action
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPointActionType('credit')}
                        className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          pointActionType === 'credit'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Credit / Grant Points</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPointActionType('debit')}
                        className={`py-2 px-3 rounded-xl font-semibold border flex items-center justify-center gap-1.5 cursor-pointer transition ${
                          pointActionType === 'debit'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>Deduct Points</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Number of Points
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="point-amount-input"
                        type="number"
                        min={1}
                        max={5000}
                        value={pointAmount}
                        onChange={(e) => setPointAmount(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-600 outline-none font-semibold"
                      />
                      <div className="flex gap-1">
                        {[50, 100, 250, 500].map((quick) => (
                          <button
                            key={quick}
                            type="button"
                            onClick={() => setPointAmount(quick)}
                            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                          >
                            +{quick}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Reason / Justification
                    </label>
                    <select
                      value={pointReason}
                      onChange={(e) => setPointReason(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-none mb-2"
                    >
                      <option value="Topper Exam Notes Contribution Reward">Topper Exam Notes Contribution Reward</option>
                      <option value="MSBTE Micro-Project Hardware Kit Delivery Incentive">MSBTE Micro-Project Hardware Kit Delivery Incentive</option>
                      <option value="Peer Tutoring Mentorship Merit Bonus">Peer Tutoring Mentorship Merit Bonus</option>
                      <option value="Academic Council Research Fellowship Grant">Academic Council Research Fellowship Grant</option>
                      <option value="Late Hardware Kit Return Fee Deduction">Late Hardware Kit Return Fee Deduction</option>
                      <option value="Academic Integrity Flag Correction">Academic Integrity Flag Correction</option>
                      <option value="Other">Custom Reason (specify below)</option>
                    </select>

                    {pointReason === 'Other' && (
                      <input
                        type="text"
                        placeholder="Type custom justification..."
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:border-indigo-600 outline-none"
                      />
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedStudentForPoints(null)}
                      className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="confirm-points-adjustment-btn"
                      type="button"
                      onClick={handleApplyPointAdjustment}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-sm transition"
                    >
                      Confirm {pointActionType === 'credit' ? 'Grant' : 'Deduction'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
