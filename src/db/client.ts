import { DB_NAME } from '@/constants/db';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { tasks } from './schema';

const tasksDb = new Database(DB_NAME);
export const db = drizzle(tasksDb);

export async function getTasks() {
  const result = await db.select().from(tasks);
  return result;
}

export async function getTaskById(id: number) {
  const result = await db.select().from(tasks).where(sql`${tasks.id} = ${id}`).limit(1);
  return result[0]; 
}