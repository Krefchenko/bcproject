// file is named route.ts because we're using app router, https://nextjs.org/docs/app/building-your-application/routing/route-handlers

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { storeHash, accessToken } = await request.json();

    const connectionTest = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products?limit=1`, {
      headers: {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // connectionTest.ok is a Response object property, if HTTP status is between 200 and 299 it reads true
    // if the connection is not ok, return a 401 and set success to false, if there is no connection, return a 500
    // if the connection is good, put the credentials in cookies to use later
    
    if (!connectionTest.ok) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('storeHash', storeHash, { httpOnly: true });
    response.cookies.set('accessToken', accessToken, { httpOnly: true });
    
    return response;

  } catch (error) {
    // console.log will apparently get logged in vercel function logs
    console.error('API error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}