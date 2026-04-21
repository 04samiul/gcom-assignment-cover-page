// ── Database Row Types ────────────────────────────────────────────────────────

export interface Teacher {
  id: string
  name: string
  designation: string
  department: string
  created_at: string
}

export interface Subject {
  id: string
  name: string
  code: string
  teacher_id: string
  created_at: string
  // Joined
  teacher?: Teacher
}

export interface Assignment {
  id: string
  title: string
  subject_id: string
  submission_date: string   // ISO date string YYYY-MM-DD
  created_at: string
  // Joined
  subject?: Subject & { teacher?: Teacher }
}

export interface Student {
  id: string
  name: string
  roll: string
  reg_no: string
  created_at: string
}

// ── Session ───────────────────────────────────────────────────────────────────

export interface SessionData {
  userId: string
  role: 'student' | 'admin'
  name: string
  roll: string
  regNo: string
}

// ── PDF Props ─────────────────────────────────────────────────────────────────

export interface CoverPageProps {
  assignment: {
    title: string
    submissionDate: string
  }
  subject: {
    name: string
    code: string
  }
  teacher: {
    name: string
    designation: string
    department: string
  }
  student: {
    name: string
    roll: string
    regNo: string
  }
}
