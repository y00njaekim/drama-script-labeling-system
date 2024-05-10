
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { fetchUserInServer } from '@/lib/dataServer';


export async function POST(request: Request) {
  const { email, pnum } = await request.json();
  const pnum_matches = pnum.match(/[Pp]?(\d{1,})/);

  if (!pnum_matches) {
    return NextResponse.json({ message: 'Invalid participant number' }, { status: 400 });
  }
  
  const pnum_match = pnum_matches[1];
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
  
  const user = await fetchUserInServer(email, pnum_match);

  if (user && user.length > 0) {
    const uid = user[0].id;
    const token = jwt.sign({ uid, email, pnum_match }, secretKey, { expiresIn: '3h' });
    const response = NextResponse.json({ message: 'Authentication successful' }, { status: 200 });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
    });
    return response;
  } else {
    return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
  }
}