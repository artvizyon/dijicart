import { inngest } from '@/inngest/client'
import prisma from '@/lib/prisma'
import authAdmin from '@/middlewares/authAdmin'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin)
      return NextResponse.json({ error: 'Admin Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }

    const { coupon } = await request.json()
    coupon.code = coupon.code.toUpperCase()

    await prisma.coupon.create({ data: coupon }).then(async (coupon) => {
      // Inngest function
      await inngest.send({
        name: 'app/coupon.expired',
        data: {
          code: coupon.code,
          expires_at: coupon.expiresAt,
        },
      })
    })

    return NextResponse.json({ message: 'Kupon tanımlandı...' })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}

export async function DELETE(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin)
      return NextResponse.json({ error: 'Admin Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }

    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')

    await prisma.coupon.delete({ where: { code } })
    return NextResponse.json({ message: 'Kupon silindi...' })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}

export async function GET(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin)
      return NextResponse.json({ error: 'Admin Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }

    const coupons = await prisma.coupon.findMany({})
    return NextResponse.json({ coupons })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
