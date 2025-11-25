import { NextResponse } from 'next/server';
import { getMQTTStatus } from '@/lib/mqtt-listener';

export async function GET() {
  try {
    const status = getMQTTStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { connected: false, isConnecting: false },
      { status: 500 }
    );
  }
}

