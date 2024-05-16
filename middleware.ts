import { NextRequest, NextResponse } from 'next/server';
import { labelMiddleware } from '@/app/label/labelMiddleware';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/label')) {
    return labelMiddleware(request);
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return response;
}
