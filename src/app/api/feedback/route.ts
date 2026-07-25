import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const feedbackPath = path.join(process.cwd(), 'agent_feedback.json');
    
    let existing = [];
    if (fs.existsSync(feedbackPath)) {
      try {
        existing = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
      } catch {
        existing = [];
      }
    }
    
    existing.push({
      timestamp: new Date().toISOString(),
      page: body.page || '/',
      notes: body.notes || '',
      rating: body.rating || 5
    });
    
    fs.writeFileSync(feedbackPath, JSON.stringify(existing, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedbackPath = path.join(process.cwd(), 'agent_feedback.json');
    if (!fs.existsSync(feedbackPath)) {
      return NextResponse.json({ feedback: [] });
    }
    const data = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    return NextResponse.json({ feedback: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
