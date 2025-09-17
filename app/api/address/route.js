import prisma from '@/lib/prisma'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// POST - Add new address
export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const { address } = await request.json()

    address.userId = userId

    //Save the address to the user object
    const newAddress = await prisma.address.create({
      data: address,
    })

    return NextResponse.json({ newAddress, message: 'Yeni adres eklendi...' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}

// GET all addressess for a user
export async function GET(request) {
  try {
    const { userId } = getAuth(request)

    //Save the address to the user object
    const addresses = await prisma.address.findMany({
      where: { userId },
    })

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}
