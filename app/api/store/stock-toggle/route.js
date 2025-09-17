import prisma from '@/lib/prisma'
import { getAuth } from '@clerk/nextjs/server'
import authSeller from '@/middlewares/authSeller'
import { NextResponse } from 'next/server'

// POST
export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Ürün detayı bulunamadı!' }, { status: 400 }) // { error: 'missing details: productId' }
    }

    const storeId = await authSeller(userId)
    if (!storeId) {
      return NextResponse.json({ error: 'Satıcı Yetkilendirmesi başarısız!' }, { status: 401 }) // { error: 'not authorized' }
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, storeId },
    })

    if (!product) {
      return NextResponse.json({ error: 'ürün bulunumadı' }, { status: 404 }) // { error: 'no product found' }
    }
    
    await prisma.product.update({
      where: { id: productId },
      data: { inStock: !product.inStock },
    })

    return NextResponse.json({ message: 'Ürün stoğu güncellendi' }) // { error: 'Product stock updated successfully' }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
