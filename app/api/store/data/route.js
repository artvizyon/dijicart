import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username').toLowerCase()

    if (!username) {
      return NextResponse.json({ error: 'Kullanıcı bulunumadı' }, { status: 400 }) // { error: 'missing usernamee' }
    }

    // Store info & instock products with rating
    const store = await prisma.store.findUnique({
      where: { username, isActive: true },
      include: { Product: { include: { rating: true } } },
    })
    
    if (!store) {
      return NextResponse.json({ error: 'Mağaza bulunamadı!' }, { status: 400 }) // { error: 'store no found'}
    }

    return NextResponse.json({ store })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
