import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { regNo } = await req.json()

  if (!regNo?.trim()) {
    return NextResponse.json({ error: 'Admin key is required.' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: admin, error } = await supabase
    .from('admins')
    .select('id, reg_no')
    .eq('reg_no', regNo.trim())
    .single()

  if (error || !admin) {
    return NextResponse.json({ error: 'Invalid admin credentials.' }, { status: 401 })
  }

  const session = await getSession()
  session.userId = admin.id
  session.role = 'admin'
  session.name = 'Administrator'
  session.roll = ''
  session.regNo = admin.reg_no
  await session.save()

  return NextResponse.json({ ok: true })
}
