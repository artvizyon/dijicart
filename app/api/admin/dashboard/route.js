import prisma from '@/lib/prisma'
import authAdmin from '@/middlewares/authAdmin'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// GET admin/dashboard
export async function GET(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin)
      return NextResponse.json({ error: 'Admin Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }

    // Get Total
    const orders = await prisma.order.count()
    // Get stores on app
    const stores = await prisma.store.count()
    // Get all orders
    const allOrders = await prisma.order.findMany({
      select: {
        createdAt: true,
        total: true,
      },
    })

    let totalRevenue = 0
    allOrders.forEach((order) => {
      totalRevenue += order.total
    })

    const revenue = totalRevenue.toFixed(2)

    // total products on App
    const products = await prisma.product.count()

    const dashboardData = {
      orders,
      stores,
      products,
      revenue,
      allOrders,
    }

    return NextResponse.json({ dashboardData })
  } catch (error) {}

  console.error(error)

  return NextResponse.json({ error: error.code || error.message }, { status: 400 })
}
