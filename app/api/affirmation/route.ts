import { affirmations } from '@/data/affirmations';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get a random affirmation
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const affirmation = affirmations[randomIndex];

    return NextResponse.json({
      affirmation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get affirmation' },
      { status: 500 }
    );
  }
}
