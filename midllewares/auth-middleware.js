import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from './lib/prisma'; // Prisma client yolunu doğru ayarla

// Bu middleware'in hangi rotalar için çalışacağını belirle.
// /api/seller ile başlayan tüm istekler bu kontrolden geçer.
export const config = {
  matcher: ['/api/seller/:path*'],
};

export default async function middleware(request) {
  const { userId } = getAuth(request);

  // Kullanıcı oturum açmamışsa veya Clerk'ten bir kullanıcı kimliği gelmemişse
  if (!userId) {
    return NextResponse.json({ error: 'Yetkilendirme hatası.' }, { status: 401 });
  }

  // Kullanıcının bir satıcı mağazası olup olmadığını kontrol et.
  const store = await prisma.store.findFirst({
    where: { userId: userId },
  });

  // Mağaza yoksa, onaylanmamışsa veya aktif değilse erişimi engelle.
  if (!store || store.status !== 'approved' || !store.isActive) {
    return NextResponse.json({ error: 'Satıcı yetkiniz bulunmamaktadır.' }, { status: 403 });
  }

  // Her şey yolundaysa, isteği bir sonraki adıma (API rotasına) yönlendir.
  // Bu, rotadaki fonksiyonunun çalışmasını sağlar.
  return NextResponse.next();
}