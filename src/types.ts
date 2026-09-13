export type CampusId = 'all' | 'vit' | 'vp' | 'iitb' | 'bits' | 'dtu' | 'anna' | 'rvce' | 'nitt';

export interface Campus {
  id: CampusId;
  name: string;
  shortName: string;
  city: string;
  studentCount: string;
  verifiedNotesCount: number;
  projectsCount: number;
  tutorsCount: number;
}

export type SubjectBranch = 'Computer Science' | 'Electronics & Comm.' | 'Mechanical' | 'Electrical' | 'Mathematics & AI' | 'Civil & Biotech';

export interface RentalOption {
  id: string;
  duration: string; // e.g. "3 Days Exam Sprint", "7 Days Deep Study", "Semester Pass"
  days: number;
  price: number; // in INR
  usdPrice: number;
  popular?: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  branch: SubjectBranch;
  semester: number;
  professor: string;
  collegeId: CampusId;
  collegeName: string;
  author: {
    name: string;
    year: string;
    cgpa: string;
    avatar: string;
    gradeAchieved: string;
    verifiedStudent: boolean;
  };
  pages: number;
  rating: number;
  reviewsCount: number;
  handwritten: boolean;
  rentalOptions: RentalOption[];
  buyPrice: number; // Buy permanently
  tags: string[];
  samplePages: string[];
  summary: string;
  tableOfContents: string[];
  downloadsCount: number;
  sampleContentText?: string;
}

export type ProjectCategory = 'hardware' | 'iot' | 'ai_ml' | 'fullstack' | 'software' | 'cad_mechanical';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  branch: SubjectBranch;
  collegeId: CampusId;
  collegeName: string;
  author: {
    name: string;
    teamMembers?: string[];
    year: string;
    avatar: string;
  };
  description: string;
  highlights: string[];
  techStack: string[];
  forSale: boolean;
  buyPrice: number;
  forRent: boolean;
  rentPricePerWeek: number;
  hasHardwareKit: boolean;
  hardwareKitDeposit?: number;
  rating: number;
  documentationGrade: 'A+' | 'A' | 'A-';
  githubSnippet?: string;
  billOfMaterials?: { item: string; qty: number; approxCost: number }[];
  demoUrl?: string;
  yearCreated: number;
}

export interface TutorItem {
  id: string;
  name: string;
  avatar: string;
  collegeId: CampusId;
  collegeName: string;
  year: string;
  major: string;
  cgpa: string;
  subjects: string[];
  hourlyRate: number; // INR
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  bio: string;
  achievements: string[];
  availableSlots: { day: string; times: string[] }[];
  languages: string[];
}

export type ResourceType = 'pyq' | 'lab_manual' | 'cheatsheet' | 'viva_prep' | 'formula_sheet';

export interface CampusResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  subject: string;
  semester: number;
  branch: SubjectBranch;
  collegeId: CampusId;
  collegeName: string;
  uploadedBy: string;
  authorAvatar: string;
  upvotes: number;
  fileFormat: string;
  fileSize: string;
  dateAdded: string;
  verifiedByFaculty: boolean;
  hasSolutions: boolean;
}

export interface ActiveRental {
  id: string;
  itemId: string;
  type: 'note' | 'project';
  title: string;
  authorName: string;
  collegeName: string;
  startDate: string;
  expiresAt: string;
  daysRemaining: number;
  totalPaid: number;
}

export interface BookedTutorSession {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar: string;
  subject: string;
  date: string;
  timeSlot: string;
  amountPaid: number;
  status: 'upcoming' | 'completed';
  isCollegeInPerson: boolean;
  collegeName: string;
  campusVenue: string;
  sessionPassCode: string;
  meetingLink?: string;
  topicNote?: string;
  tutorPhone?: string;
  startsInMinutes?: number;
  reminderTriggered?: boolean;
}

export interface UserWallet {
  balance: number;
  totalEarned: number;
  notesRentedOut: number;
  projectsSoldOrRented: number;
  tutoringHoursDelivered: number;
}

export interface StudentProfile {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  collegeId: CampusId;
  collegeName: string;
  branch: string;
  semester: number;
  avatar: string;
  points: number;
  tier: 'Gold Scholar' | 'Silver Scholar' | 'Bronze Scholar' | 'Junior Scholar';
  notesUploaded: number;
  projectsListed: number;
  sessionsConducted: number;
  totalOrdersCount: number;
  totalSpent: number;
  status: 'active' | 'flagged' | 'restricted';
  joinedDate: string;
  phone: string;
}

export interface StudentPointTransaction {
  id: string;
  studentId: string;
  studentName: string;
  points: number;
  type: 'credit' | 'debit';
  reason: string;
  timestamp: string;
  authorizedBy: string;
}

export type OrderItemType = 'note_rental' | 'note_purchase' | 'project_purchase' | 'project_rental' | 'tutor_session';
export type OrderStatus = 'completed' | 'active_rental' | 'upcoming_session' | 'refunded' | 'cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentEmail: string;
  collegeId: CampusId;
  collegeName: string;
  itemType: OrderItemType;
  itemTitle: string;
  itemId: string;
  amount: number; // in INR
  paymentMethod: 'Campus Wallet' | 'UPI / GPay' | 'Card / NetBanking';
  date: string;
  status: OrderStatus;
  notesOrVenue?: string;
  passCode?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Dean / SuperAdmin' | 'Academic Officer' | 'Campus Moderator';
  department: string;
  avatar: string;
  lastLogin: string;
}
