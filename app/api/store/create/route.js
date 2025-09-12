// app/api/store/create/route.js

import imagekit from '@/configs/imageKıt'
import prisma from '@/lib/prisma'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// POST - Store create
export async function POST(request) {
  try {
    const { userId } = getAuth(request)

    const formData = await request.formData()

    const name = formData.get('name')
    const username = formData.get('username')
    const description = formData.get('description')
    const email = formData.get('email')
    const contact = formData.get('contact')
    const address = formData.get('address')
    const image = formData.get('image')

    if (!name || !username || !description || !email || !contact || !address || !image) {
      return NextResponse.json(
        { error: 'Lütfen Mağaza bilgilerinizi eksiksiz doldurunuz.' }, // { error: 'missing store info' }
        { status: 400 }
      )
    }
    const store = await prisma.store.findFirst({ where: { userId: userId } })

    if (store) {
      return NextResponse.json({ status: store.status })
    }
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    })
    if (isUsernameTaken) {
      return NextResponse.json({ error: 'Bu isim kullanılmaktadır.' }, { status: 400 }) // { error: 'username already taken.' }
    }

    // image upload
    const buffer = Buffer.from(await image.arrayBuffer())
    const response = await imagekit.upload({
      file: buffer,
      fileName: image.name,
      folder: 'logos',
    })

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [{ quality: 'auto' }, { format: 'webp' }, { width: '512' }],
    })

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    })

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        store: {
          connect: {
            id: newStore.id,
          },
        },
      },
    })

    return NextResponse.json({ message: 'Başvurunuz alındı, onay bekleniyor.' }) // { message: 'applied, waiting for approval.' }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}

// GET
export async function GET(request) {
  try {
    const { userId } = getAuth(request)

    const store = await prisma.store.findFirst({
      where: { userId: userId },
    })
    if (store) {
      return NextResponse.json({ status: store.status })
    }
    return NextResponse.json({ status: 'kayıtlı değil' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
