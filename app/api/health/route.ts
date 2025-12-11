import { NextResponse } from 'next/server';

// Good practice: ensures the route is not cached at build time
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
      { 
        message: "Health route is working", // Added a key 'message'
        status: 'healthy'
      },
      { status: 200 }
    );
}
