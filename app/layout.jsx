import { Outfit } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import StoreProvider from '@/app/StoreProvider'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

import './globals.css'

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '500', '600'] })

export const metadata = {
  title: 'Diji Store. - Smart Shop',
  description: 'Diji Shop Store. - Shop Platform',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${outfit.className} antialiased`}>
          <StoreProvider>
            <Toaster />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
