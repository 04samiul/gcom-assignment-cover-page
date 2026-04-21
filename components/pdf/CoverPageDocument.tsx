'use client'

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Circle,
  Line,
} from '@react-pdf/renderer'
import type { CoverPageProps } from '@/lib/types'

// ── Register fonts ────────────────────────────────────────────────────────────
Font.register({
  family: 'Times New Roman',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/notoserifdisplay/v9/buERppa9f8_vkXaZLAgP0G5Wi6QmA1QaeYah2sovLCDq_ZgLyt3idQseRT7--O_U9BsvfDc.woff2', fontWeight: 400 },
  ],
})

// A4 dimensions in points (1 pt = 1/72 inch)
// A4: 595.28 x 841.89 pt

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60,
    backgroundColor: '#ffffff',
    fontSize: 11,
    color: '#1a1a1a',
  },

  // ── Top border decoration ─────────────────────────────────
  topBorder: {
    borderTopWidth: 4,
    borderTopColor: '#1a5c38',
    borderTopStyle: 'solid',
    marginBottom: 2,
  },
  topBorderThin: {
    borderTopWidth: 1,
    borderTopColor: '#c9a84c',
    borderTopStyle: 'solid',
    marginBottom: 20,
  },

  // ── College header ────────────────────────────────────────
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a5c38',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  collegeName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#1a5c38',
    letterSpacing: 0.5,
  },
  collegeSubtitle: {
    fontSize: 9,
    textAlign: 'center',
    color: '#555555',
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // ── Divider ───────────────────────────────────────────────
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#c9a84c',
    borderBottomStyle: 'solid',
    marginVertical: 16,
  },
  dividerThick: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a5c38',
    borderBottomStyle: 'solid',
    marginVertical: 16,
  },

  // ── Assignment label ──────────────────────────────────────
  assignmentBadge: {
    backgroundColor: '#f0f7f3',
    borderWidth: 1,
    borderColor: '#1a5c38',
    borderStyle: 'solid',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 14,
  },
  assignmentBadgeText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a5c38',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // ── Assignment title ──────────────────────────────────────
  titleSection: {
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  assignmentTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    color: '#1a1a1a',
    lineHeight: 1.4,
  },

  // ── Subject ───────────────────────────────────────────────
  subjectSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subjectText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#444444',
  },
  subjectBold: {
    fontFamily: 'Helvetica-Bold',
    color: '#1a5c38',
  },

  // ── Two-column submitted section ──────────────────────────
  submittedRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  submittedBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'solid',
    borderRadius: 6,
    padding: 14,
    backgroundColor: '#fafafa',
  },
  submittedBoxLeft: {
    borderLeftWidth: 3,
    borderLeftColor: '#1a5c38',
    borderLeftStyle: 'solid',
  },
  submittedBoxRight: {
    borderLeftWidth: 3,
    borderLeftColor: '#c9a84c',
    borderLeftStyle: 'solid',
  },
  boxHeading: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#6b7280',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: '#6b7280',
    width: 70,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 9,
    color: '#1a1a1a',
    fontFamily: 'Helvetica-Bold',
    flex: 1,
  },

  // ── Footer ────────────────────────────────────────────────
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  footerDept: {
    fontSize: 9,
    color: '#1a5c38',
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },

  // ── Bottom border ─────────────────────────────────────────
  bottomBorderThin: {
    borderTopWidth: 1,
    borderTopColor: '#c9a84c',
    borderTopStyle: 'solid',
    marginTop: 24,
    marginBottom: 2,
  },
  bottomBorder: {
    borderTopWidth: 4,
    borderTopColor: '#1a5c38',
    borderTopStyle: 'solid',
  },
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function CoverPageDocument({ assignment, subject, teacher, student }: CoverPageProps) {
  return (
    <Document
      title={`Cover Page — ${assignment.title}`}
      author="GCC Chattogram"
      creator="GCC Assignment Generator"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Top border ── */}
        <View style={styles.topBorder} />
        <View style={styles.topBorderThin} />

        {/* ── College Header ── */}
        <View style={styles.headerSection}>
          {/* Logo placeholder circle */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>GCC</Text>
          </View>
          <Text style={styles.collegeName}>
            Government College of Commerce, Chattogram
          </Text>
          <Text style={styles.collegeSubtitle}>
            Estd. 1959 · Affiliated with National University
          </Text>
        </View>

        <View style={styles.dividerThick} />

        {/* ── Assignment Badge ── */}
        <View style={styles.assignmentBadge}>
          <Text style={styles.assignmentBadgeText}>Assignment</Text>
        </View>

        {/* ── Title ── */}
        <View style={styles.titleSection}>
          <Text style={styles.assignmentTitle}>{assignment.title}</Text>
        </View>

        {/* ── Subject ── */}
        <View style={styles.subjectSection}>
          <Text style={styles.subjectText}>
            <Text>Subject: </Text>
            <Text style={styles.subjectBold}>{subject.name}</Text>
            <Text>  ({subject.code})</Text>
          </Text>
        </View>

        <View style={styles.divider} />

        {/* ── Two-column: Submitted To / By ── */}
        <View style={styles.submittedRow}>
          {/* Left — Submitted To */}
          <View style={[styles.submittedBox, styles.submittedBoxLeft]}>
            <Text style={styles.boxHeading}>Submitted To</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{teacher.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Designation</Text>
              <Text style={styles.infoValue}>{teacher.designation}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{teacher.department}</Text>
            </View>
          </View>

          {/* Right — Submitted By */}
          <View style={[styles.submittedBox, styles.submittedBoxRight]}>
            <Text style={styles.boxHeading}>Submitted By</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{student.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Roll No.</Text>
              <Text style={styles.infoValue}>{student.roll}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reg. No.</Text>
              <Text style={styles.infoValue}>{student.regNo}</Text>
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footerSection}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>Submission Date</Text>
            <Text style={styles.footerValue}>{formatDate(assignment.submissionDate)}</Text>
          </View>
          <View>
            <Text style={styles.footerDept}>Department of {teacher.department}</Text>
          </View>
        </View>

        {/* ── Bottom border ── */}
        <View style={styles.bottomBorderThin} />
        <View style={styles.bottomBorder} />
      </Page>
    </Document>
  )
}
