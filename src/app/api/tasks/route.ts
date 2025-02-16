import { NewTask } from '@/constants/type';
import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import { asc, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const sortField = url.searchParams.get('sortField') || 'createdAt';
  const sortOrder = url.searchParams.get('sortOrder') || 'desc';

  const offset = (page - 1) * limit;

  let query;

  if (sortField === 'priority') {
    query = db.select()
             .from(tasks)
             .orderBy(sortOrder === 'asc' ? asc(tasks.priority) : desc(tasks.priority))
             .limit(limit)
             .offset(offset);
  } else {
    query = db.select()
             .from(tasks)
             .orderBy(sortOrder === 'asc' ? asc(tasks.createdAt) : desc(tasks.createdAt))
             .limit(limit)
             .offset(offset);
  }

  const paginatedTasks = await query;

  const allTasks = await db.select().from(tasks);
  const totalTasksCount = allTasks.length;
  const totalPages = Math.ceil(totalTasksCount / limit);

  return NextResponse.json({
    tasks: paginatedTasks,
    pagination: {
      totalTasks: totalTasksCount,
      totalPages,
      currentPage: page,
    },
  });
}

export async function POST(request: Request) {
  const { title, description, dueDate, priority }: NewTask = await request.json();

  if (!title || !description || !dueDate) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const newTask = await db.insert(tasks).values({ 
    title, 
    description, 
    dueDate,
    priority,
    createdAt: new Date().toISOString()
  });
  
  return NextResponse.json(newTask);
}
