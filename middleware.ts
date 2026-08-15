import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Get the origin making the request (e.g., http://localhost:3000)
  const origin = request.headers.get('origin')

  // 2. Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204, // No content status for preflight
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // 3. For regular requests (GET, POST), let them pass but append the CORS header to the response
  const response = NextResponse.next()
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }
  
  return response
}

// 4. Only apply this middleware to your API routes
export const config = {
  matcher: '/:path*',
}
