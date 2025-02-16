'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from '@/constants/type';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TaskDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [task, setTask] = useState<Task>();

  useEffect(() => {
    const fetchTask = async () => {
      const task = await fetch(`/api/tasks/${params.id}`);
      const data = await task.json();
      if (!task.ok) {
        router.push('/');
        return;
      }
      setTask(data);
    };
    fetchTask();
  }, [params.id]);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/tasks/${params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push(`/`);
    }
  }

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <div className='py-5'>
        <Link href={`/`}>
          <Button variant="outline" size="sm" className="mr-2">
            Back
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{task?.title}</h1>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{task?.description}</p>
          <p className="mt-2 text-sm text-gray-500">Due: {task?.dueDate}</p>
          <p className="mt-2 text-sm text-gray-500">Priority: {task?.priority}</p>
          <div className="mt-6 flex justify-between">
            <Link href={`/${task?.id}/edit`}>
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2"
              >
                Edit
              </Button>
            </Link>
            <Link href={`/delete/${task?.id}`}>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
