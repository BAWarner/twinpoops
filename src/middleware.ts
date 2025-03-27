import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/'];
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const token = req.cookies.get('auth-token')?.value;
  const isLoggedIn = !!token;
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));

  if (!isLoggedIn && isProtectedRoute) {
    if (path !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  if (isLoggedIn && isAuthRoute) {
    if (path !== '/') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
