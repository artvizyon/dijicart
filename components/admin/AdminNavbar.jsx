'use client'
import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import DijitrendLogo from '../Logo'

const AdminNavbar = () => {
  const { user } = useUser()

  return (
    <div className='flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all'>
      <Link href='/' className='relative text-4xl font-semibold text-slate-700'>
      <span>
        <DijitrendLogo />
      </span>
        <p className='absolute text-xs font-semibold -top-1 -right-18 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500'>
          Yönetici
        </p>
      </Link>
      <div className='flex items-center gap-3'>
        <p>Merhaba, {user?.firstName}</p>
        <UserButton />
      </div>
    </div>
  )
}

export default AdminNavbar
