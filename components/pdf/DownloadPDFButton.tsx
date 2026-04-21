'use client'

import dynamic from 'next/dynamic'
import type { CoverPageProps } from '@/lib/types'

// react-pdf must be loaded client-side only
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

const CoverPageDocument = dynamic(
  () =>
    import('@/components/pdf/CoverPageDocument').then((mod) => mod.CoverPageDocument),
  { ssr: false }
)

interface Props extends CoverPageProps {
  fileName: string
}

export function DownloadPDFButton({ fileName, ...props }: Props) {
  return (
    // @ts-ignore — PDFDownloadLink render-prop types are complex
    <PDFDownloadLink
      document={<CoverPageDocument {...props} />}
      fileName={fileName}
      className="btn-primary whitespace-nowrap text-xs"
    >
      {({ loading }: { loading: boolean }) =>
        loading ? (
          <span className="flex items-center gap-1.5">
            <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Preparing…
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </span>
        )
      }
    </PDFDownloadLink>
  )
}
