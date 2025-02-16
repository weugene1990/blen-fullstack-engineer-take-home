'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NewTask } from '@/constants/type';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditTask({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<NewTask>({
    title: '',
    description: '',
    dueDate: '',
    priority: 1,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${params.id}`);
      const data = await res.json();
      setTask(data);
    };
    fetchTask();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/tasks/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      router.push(`/${params.id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
      <div className='py-2'>
        <Link href={`/${params.id}`}>
          <Button variant="outline" size="sm" className="mr-2">
            Back
          </Button>
        </Link>
      </div>
      <Input
        type="text"
        value={task.title}
        onChange={e => setTask({ ...task, title: e.target.value })}
        placeholder="Task Title"
        required
        className="input"
      />

      <Textarea
        value={task.description}
        onChange={e => setTask({ ...task, description: e.target.value })}
        placeholder="Task Description"
        required
        className="textarea"
      />

      <Input
        type="date"
        value={task.dueDate}
        onChange={e => setTask({ ...task, dueDate: e.target.value })}
        required
        className="input"
      />

      <Input
        type="number"
        value={task.priority}
        onChange={e => setTask({ ...task, priority: Number(e.target.value) })}
        required
        className="input"
      />

      <Button 
        type="submit" 
        variant="default" 
        size="lg" 
        className="mt-6"
      >
        Save Changes
      </Button>
    </form>
  );
}
