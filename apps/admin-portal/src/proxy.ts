import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import AppMenu from '@/constants/app-menu.const';

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  for (let i = 0; i < AppMenu.menu.length; i++) {
    if (pathname === '/') {
      const firstSubmenu = AppMenu.menu[0]?.submenu?.[0];
      if (firstSubmenu?.url) {
        url.pathname = firstSubmenu.url;
        return NextResponse.redirect(url);
      }
    } else if (pathname === AppMenu.menu[i].url) {
      const firstSubmenu = AppMenu.menu[i]?.submenu?.[0];
      if (firstSubmenu?.url) {
        url.pathname = firstSubmenu.url;
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/transaction/:path*',
    '/policy/:path*',
    '/claim/:path*',
    '/membership/:path*',
    '/sanction/:path*',
    '/source/:path*',
    '/promotion/:path*',
    '/finance/:path*',
    '/product-category/:path*',
    '/masterdata/:path*',
    '/report/:path*',
    '/export-users/:path*',
  ],
};
