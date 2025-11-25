import { NextResponse } from 'next/server';
import { startMQTTListener } from '@/lib/mqtt-listener';

export async function POST() {
  try {
    const result = await startMQTTListener();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error starting MQTT listener' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to start MQTT listener',
    endpoint: '/api/mqtt/start',
  });
}

