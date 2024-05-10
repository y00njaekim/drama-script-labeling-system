import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';



export async function labelMiddleware(request: NextRequest) {
  const token = request.cookies.get('token');

  if (token) {
    try {
      const jwtConfig = {
        secret: new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY),
      }
      const decoded = await jwtVerify(token.value, jwtConfig.secret)
      const pnum = decoded.payload.pnum_match as string;
      const uid = decoded.payload.uid as string;
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-uid', uid);
      requestHeaders.set('x-pnum', pnum);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) { // jwtVerify() throws an error if the token is invalid
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.redirect(new URL('/login', request.url));
}