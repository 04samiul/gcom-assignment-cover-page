import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { regNo } = await req.json()

  if (!regNo?.trim()) {
    return NextResponse.json({ error: 'Registration number is required.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: student, error } = await supabase
    .from('students')
    .select('id, name, roll, reg_no')
    .eq('reg_no', regNo.trim())
    .single()

  if (error || !student) {
    return NextResponse.json(
      { error: 'No account found with that registration number.' },
      { status: 401 }
    )
  }

  const session = await getSession()
  session.userId = student.id
  session.role = 'student'
  session.name = student.name
  session.roll = student.roll
  session.regNo = student.reg_no
  await session.save()

  return NextResponse.json({ ok: true })
}
