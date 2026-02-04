import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // We can't check auth state directly in middleware with Firebase client SDK
    // So we'll rely on client-side protection for now, but we can do some basic checks if we used cookies.
    // However, since we are using client-side AuthContext, the middleware is limited.
    // A common pattern is to check for a session cookie if we were doing SSR auth.
    // For this client-side migration, we'll let the AuthContext/Components handle redirect, 
    // OR we implement a simple public/protected logic if we sync auth to cookies.

    // For now, let's just pass through. Client-side components (layout/template) will handle redirects.
    // Actually, let's implement a ProtectedRoute wrapper or check in AuthContext.

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/dashboard/:path*',
}
