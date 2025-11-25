import { NextResponse } from 'next/server';
import { stopMQTTListener } from '@/lib/mqtt-listener';

export async function POST() {
  try {
    const result = stopMQTTListener();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error stopping MQTT listener' },
      { status: 500 }
    );
  }
}

