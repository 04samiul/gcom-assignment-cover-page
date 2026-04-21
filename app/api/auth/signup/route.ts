import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'

const REG_PREFIX = '242232'

export async function POST(req: NextRequest) {
  const { name, roll, regNo } = await req.json()

  if (!name?.trim() || !roll?.trim() || !regNo?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (!regNo.startsWith(REG_PREFIX)) {
    return NextResponse.json(
      { error: `Registration number must start with ${REG_PREFIX}.` },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()

  // Check for duplicate
  const { data: existing } = await supabase
    .from('students')
    .select('id')
    .eq('reg_no', regNo.trim())
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'An account with this registration number already exists.' },
      { status: 409 }
    )
  }

  const { data: student, error } = await supabase
    .from('students')
    .insert({ name: name.trim(), roll: roll.trim(), reg_no: regNo.trim() })
    .select('id, name, roll, reg_no')
    .single()

  if (error || !student) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Could not create account. Please try again.' }, { status: 500 })
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
