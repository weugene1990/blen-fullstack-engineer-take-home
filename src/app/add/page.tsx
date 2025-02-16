'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NewTask } from '@/constants/type';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: string;
}

export default function AddTask() {
  const [task, setTask] = useState<NewTask>({
    title: '',
    description: '',
    dueDate: '',
    priority: 1,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!task.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!task.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!task.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!task.priority) {
      newErrors.priority = 'Priority is required';
    } else if (task.priority <= 0) {
      newErrors.priority = 'Priority must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
      <div className='py-2'>
        <Link href={`/`}>
          <Button variant="outline" size="sm" className="mr-2">
            Back
          </Button>
        </Link>
      </div>
      
      <div>
        <Input
          type="text"
          value={task.title}
          onChange={e => setTask({ ...task, title: e.target.value })}
          placeholder="Task Title"
          className={`input ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <Textarea
          value={task.description}
          onChange={e => setTask({ ...task, description: e.target.value })}
          placeholder="Task Description"
          className={`textarea ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <Input
          type="date"
          value={task.dueDate}
          onChange={e => setTask({ ...task, dueDate: e.target.value })}
          className={`input ${errors.dueDate ? 'border-red-500' : ''}`}
        />
        {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
      </div>

      <div>
        <Input
          type="number"
          value={task.priority}
          onChange={e => setTask({ ...task, priority: Number(e.target.value) })}
          min="1"
          className={`input ${errors.priority ? 'border-red-500' : ''}`}
        />
        {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
      </div>

      <Button 
        type="submit" 
        variant="default" 
        size="lg" 
        className="mt-6"
      >
        Save Task
      </Button>
    </form>
  );
}
