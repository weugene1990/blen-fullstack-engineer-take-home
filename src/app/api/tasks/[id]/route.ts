import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const task = await db.select().from(tasks).where(sql`${tasks.id} = ${params.id}`).limit(1);
  return NextResponse.json(task[0] || {});
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { title, description, dueDate, priority } = await request.json();

  if (!title || !description || !dueDate) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const updatedTask = await db
    .update(tasks)
    .set({ title, description, dueDate, priority })
    .where(sql`${tasks.id} = ${params.id}`);

  return NextResponse.json(updatedTask);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await db.delete(tasks).where(sql`${tasks.id} = ${params.id}`);
  return NextResponse.json({ message: 'Task deleted' });
}