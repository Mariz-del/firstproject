import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Teacher,
  AttendanceRecord,
  GradeEntry,
  TimetableSlot,
  FeeInvoice,
  Notice,
  Assignment,
  UserProfile,
  UserRole,
  AttendanceStatus,
} from '../types/school';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_TIMETABLE,
  INITIAL_INVOICES,
  INITIAL_NOTICES,
  INITIAL_ASSIGNMENTS,
  DEMO_PROFILES,
} from '../data/initialData';

interface SchoolContextType {
  // Profiles & Role
  currentUser: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  allProfiles: UserProfile[];

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Search & Navigation shortcut
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'gpa'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;

  // Teachers
  teachers: Teacher[];

  // Attendance
  attendanceRecords: AttendanceRecord[];
  getAttendanceForDate: (date: string) => AttendanceRecord[];
  setStudentAttendance: (studentId: string, date: string, status: AttendanceStatus, notes?: string) => void;
  markClassBulkAttendance: (studentIds: string[], date: string, status: AttendanceStatus) => void;

  // Academics & Grades
  grades: GradeEntry[];
  addGradeEntry: (entry: Omit<GradeEntry, 'id'>) => void;
  getStudentGrades: (studentId: string) => GradeEntry[];

  // Timetable
  timetable: TimetableSlot[];

  // Finance
  invoices: FeeInvoice[];
  recordPayment: (invoiceId: string, amount: number, paymentMethod: string) => void;

  // Notices
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: string) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (asg: Omit<Assignment, 'id' | 'submissionsCount'>) => void;
  submitAssignmentMock: (assignmentId: string) => void;

  // Selected student for detail drawer / report card
  selectedStudentForDetail: Student | null;
  setSelectedStudentForDetail: (student: Student | null) => void;
  selectedStudentForReportCard: Student | null;
  setSelectedStudentForReportCard: (student: Student | null) => void;

  // Selected invoice for receipt
  selectedInvoiceForReceipt: FeeInvoice | null;
  setSelectedInvoiceForReceipt: (inv: FeeInvoice | null) => void;

  // Modals
  isEnrollModalOpen: boolean;
  setIsEnrollModalOpen: (open: boolean) => void;
  isCreateNoticeModalOpen: boolean;
  setIsCreateNoticeModalOpen: (open: boolean) => void;

  // Reset
  resetToDefaultData: () => void;

  // System Stats
  stats: {
    totalStudents: number;
    totalTeachers: number;
    attendanceTodayPercent: number;
    feesCollectedTotal: number;
    feesPendingTotal: number;
    activeClassesCount: number;
  };
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY = 'meridian_school_data_kes_v1';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Selected entities for modals
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<Student | null>(null);
  const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<FeeInvoice | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [isCreateNoticeModalOpen, setIsCreateNoticeModalOpen] = useState<boolean>(false);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [teachers] = useState<Teacher[]>(INITIAL_TEACHERS);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [grades, setGrades] = useState<GradeEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_grades`);
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [timetable] = useState<TimetableSlot[]>(INITIAL_TIMETABLE);

  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_grades`, JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
  }, [assignments]);

  const currentUser = DEMO_PROFILES.find((p) => p.role === currentRole) || DEMO_PROFILES[0];

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  // Student Actions
  const addStudent = (newStd: Omit<Student, 'id' | 'attendanceRate' | 'gpa'>) => {
    const id = `std-${Date.now()}`;
    const student: Student = {
      ...newStd,
      id,
      attendanceRate: 100,
      gpa: 4.0,
    };
    setStudents((prev) => [student, ...prev]);

    // Also auto-generate fee invoice for the newly enrolled student
    const newInvoice: FeeInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-00${Math.floor(Math.random() * 90) + 50}`,
      studentId: id,
      studentName: student.fullName,
      grade: student.grade,
      totalAmount: 75000,
      paidAmount: student.feesStatus === 'paid' ? 75000 : 0,
      dueDate: '2026-10-31',
      status: student.feesStatus,
      items: [
        { description: 'Term 1 Tuition & Core Academic Instruction', amount: 65000 },
        { description: 'School Learning Portal & Science Lab Access', amount: 10000 },
      ],
      lastPaymentDate: student.feesStatus === 'paid' ? '2026-10-07' : undefined,
      paymentMethod: student.feesStatus === 'paid' ? 'M-PESA Paybill 522123' : undefined,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Attendance Actions
  const getAttendanceForDate = (date: string) => {
    return attendanceRecords.filter((r) => r.date === date);
  };

  const setStudentAttendance = (studentId: string, date: string, status: AttendanceStatus, notes?: string) => {
    setAttendanceRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.studentId === studentId && r.date === date);
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], status, notes: notes ?? next[existingIdx].notes };
        return next;
      } else {
        return [...prev, { id: `att-${Date.now()}-${studentId}`, studentId, date, status, notes }];
      }
    });
  };

  const markClassBulkAttendance = (studentIds: string[], date: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => !(r.date === date && studentIds.includes(r.studentId)));
      const newEntries: AttendanceRecord[] = studentIds.map((sid) => ({
        id: `att-${Date.now()}-${sid}`,
        studentId: sid,
        date,
        status,
      }));
      return [...filtered, ...newEntries];
    });
  };

  // Grades Actions
  const addGradeEntry = (entry: Omit<GradeEntry, 'id'>) => {
    const id = `grd-${Date.now()}`;
    setGrades((prev) => [{ ...entry, id }, ...prev]);
  };

  const getStudentGrades = (studentId: string) => {
    return grades.filter((g) => g.studentId === studentId);
  };

  // Finance Actions
  const recordPayment = (invoiceId: string, amount: number, paymentMethod: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const newPaid = Math.min(inv.totalAmount, inv.paidAmount + amount);
        const newStatus = newPaid >= inv.totalAmount ? 'paid' : 'partial';

        // Also update student fee status
        setStudents((sList) =>
          sList.map((s) => (s.id === inv.studentId ? { ...s, feesStatus: newStatus } : s))
        );

        return {
          ...inv,
          paidAmount: newPaid,
          status: newStatus,
          lastPaymentDate: '2026-10-07',
          paymentMethod,
        };
      })
    );
  };

  // Notices Actions
  const addNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: '2026-10-07',
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Assignments Actions
  const addAssignment = (asg: Omit<Assignment, 'id' | 'submissionsCount'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      submissionsCount: 0,
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const submitAssignmentMock = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, submissionsCount: Math.min(a.totalStudents, a.submissionsCount + 1) } : a))
    );
  };

  // Reset to default
  const resetToDefaultData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_attendance`);
    localStorage.removeItem(`${STORAGE_KEY}_grades`);
    localStorage.removeItem(`${STORAGE_KEY}_invoices`);
    localStorage.removeItem(`${STORAGE_KEY}_notices`);
    localStorage.removeItem(`${STORAGE_KEY}_assignments`);

    setStudents(INITIAL_STUDENTS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setGrades(INITIAL_GRADES);
    setInvoices(INITIAL_INVOICES);
    setNotices(INITIAL_NOTICES);
    setAssignments(INITIAL_ASSIGNMENTS);
  };

  // Computed stats
  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalPending = totalBilled - totalCollected;

  const todayRecords = attendanceRecords.filter((r) => r.date === '2026-10-07');
  const presentCount = todayRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const attendanceTodayPercent = todayRecords.length > 0
    ? Math.round((presentCount / todayRecords.length) * 100)
    : 96;

  const stats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    attendanceTodayPercent,
    feesCollectedTotal: totalCollected,
    feesPendingTotal: totalPending,
    activeClassesCount: 12,
  };

  return (
    <SchoolContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        allProfiles: DEMO_PROFILES,
        activeTab,
        setActiveTab,
        globalSearch,
        setGlobalSearch,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        teachers,
        attendanceRecords,
        getAttendanceForDate,
        setStudentAttendance,
        markClassBulkAttendance,
        grades,
        addGradeEntry,
        getStudentGrades,
        timetable,
        invoices,
        recordPayment,
        notices,
        addNotice,
        deleteNotice,
        assignments,
        addAssignment,
        submitAssignmentMock,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        selectedStudentForReportCard,
        setSelectedStudentForReportCard,
        selectedInvoiceForReceipt,
        setSelectedInvoiceForReceipt,
        isEnrollModalOpen,
        setIsEnrollModalOpen,
        isCreateNoticeModalOpen,
        setIsCreateNoticeModalOpen,
        resetToDefaultData,
        stats,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
