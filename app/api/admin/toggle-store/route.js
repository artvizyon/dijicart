import prisma from '@/lib/prisma'
import authAdmin from '@/middlewares/authAdmin'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// POST isActive ctrl
export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const isAdmin = await authAdmin(userId)

    if (!isAdmin)
      return NextResponse.json({ error: 'Admin Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }

    const { storeId } = await request.json()

    if (!storeId) {
      return NextResponse.json({ error: 'Henüz Mağaza kaydı bulunmamaktadır!' }, { status: 400 }) // { error: 'missing storeId' }
    }

    // Find object
    const store = await prisma.store.findUnique({ where: { id: storeId } })

    if (!store) {
      return NextResponse.json({ error: 'Bu isimle bir Mağaza bulunamadı!' }, { status: 400 }) // { error: 'missing storeId' }
    }

    await prisma.store.update({
      where: { id: storeId },
      data: { isActive: !store.isActive },
    })

    return NextResponse.json({ message: 'Mağaza açılışı başarılı..' }) // { error: 'Store updated successfully' }
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
