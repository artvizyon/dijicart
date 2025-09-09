'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'

const DijitrendLogo = () => {
  return (
    <div>
      <Image className='w-30' src={assets.dijitrend_logo} alt='brand logo' />
    </div>
  )
}

export default DijitrendLogo
