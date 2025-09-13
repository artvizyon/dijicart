import prisma from '@/lib/prisma'
import authSeller from '@/midllewares/authSeller'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// POST Update seller order status

export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const storeId = await authSeller(userId)

    if (!storeId) {
      return NextResponse.json({ error: 'Satıcı Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }
    }

    const { orderId, status } = await request.json()

    await prisma.order.update({
      where: { id: orderId, storeId },
      data: { status },
    })

    return NextResponse.json({ message: 'Sipariş Durumu güncellendi...' }) // {message: "Order Status updated..."}
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}

// GET all objects

export async function GET(request) {
  try {
    const { userId } = getAuth(request)
    const storeId = await authSeller(userId)

    if (!storeId) {
      return NextResponse.json({ error: 'Satıcı Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }
    }

    const orders = await prisma.order.findMany({
      where: { storeId },
      include: { user: true, address: true, orderItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ orders })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
