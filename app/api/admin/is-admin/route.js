import authAdmin from '@/middlewares/authAdmin'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin)
      return NextResponse.json({ error: 'Admin Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
