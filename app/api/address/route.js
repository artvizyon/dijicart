import prisma from '@/lib/prisma'
import { getAuth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// POST - Add new adress
export async function POST(request) {
  try {
    const { userId } = getAuth(request)
    const { address } = await request.json()

    address.userId = userId

    //Save the address to the user object
    const newAdress = await prisma.user.create({
      data: address
    })

    return NextResponse.json({ newAdress, message: 'Yeni adres eklendi...' }) // {message: 'Cart updated...'}
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}

// GET all addressess for a user
export async function GET(request) {
  try {
    
    //Save the address to the user object
    const adressess = await prisma.user.findMany({
        where: {userId}
    })

    return NextResponse.json({ adressess})
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: error.code || error.message }, { status: 400 })
  }
}