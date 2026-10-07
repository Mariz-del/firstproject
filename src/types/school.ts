export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  avatarUrl: string;
  email: string;
  badge?: string;
}

export type StudentStatus = 'active' | 'leave' | 'transferred';
export type FeeStatus = 'paid' | 'partial' | 'overdue';

export interface Student {
  id: string;
  rollNumber: string;
  fullName: string;
  grade: string; // e.g. "Grade 10"
  section: string; // e.g. "A"
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  bloodGroup: string;
  enrollmentDate: string;
  status: StudentStatus;
  gpa: number;
  attendanceRate: number; // e.g. 96.5
  feesStatus: FeeStatus;
  avatarUrl?: string;
}

export interface Teacher {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: 'Mathematics' | 'Sciences' | 'Humanities' | 'Languages' | 'Arts & Athletics';
  classesAssigned: string[];
  homeroom?: string;
  qualification: string;
  avatarUrl?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  subject: string;
  term: 'Mid-Term 1' | 'Term 1 Final' | 'Mid-Term 2' | 'Annual Final';
  score: number;
  maxScore: number;
  letterGrade: string;
  remarks: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  timeRange: string;
  grade: string;
  section: string;
  subject: string;
  teacherName: string;
  room: string;
}

export interface FeeItem {
  description: string;
  amount: number;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  grade: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: FeeStatus;
  items: FeeItem[];
  lastPaymentDate?: string;
  paymentMethod?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  category: 'Academic' | 'Administrative' | 'Events' | 'Emergency';
  targetAudience: 'All' | 'Teachers' | 'Students' | 'Parents';
  date: string;
  isPinned?: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  section: string;
  teacherName: string;
  dueDate: string;
  description: string;
  maxMarks: number;
  submissionsCount: number;
  totalStudents: number;
}
