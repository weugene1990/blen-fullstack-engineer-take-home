'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from '@/constants/type';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [sortField, setSortField] = useState<'createdAt' | 'priority'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(
        `/api/tasks?page=${currentPage}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      const data = await res.json();
      setTasks(data?.tasks);
      setTotalPages(data?.pagination?.totalPages);
    };
    fetchTasks();
  }, [currentPage, limit, sortField, sortOrder]); 

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-');
    setSortField(field as 'createdAt' | 'priority');
    setSortOrder(order as 'asc' | 'desc');
    setCurrentPage(1);
  };

  return (
    <main className="flex flex-col gap-10 p-10">
      <h1 className="text-2xl font-bold mb-6">Task List</h1>

      <div className="mb-4 flex gap-4">
        <label htmlFor="limit" className="mr-2">Tasks per page:</label>
        <select
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          className="p-2 border rounded-md"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>

        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select
          id="sort"
          value={`${sortField}-${sortOrder}`}
          onChange={handleSortChange}
          className="p-2 border rounded-md"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="priority-desc">Priority: High to Low</option>
          <option value="priority-asc">Priority: Low to High</option>
        </select>
      </div>
      
      <ul className="space-y-4">
        {tasks && tasks.map(task => (
          <li key={task.id}>
            <Card>
              <CardHeader>
                <strong className="text-lg">{task.title}</strong>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Priority: {task.priority}</p>
                <p className="text-gray-500">Due date: {task.dueDate}</p>
                <p className="text-gray-500 text-sm text-right">
                  Created at {format(parseISO(task.createdAt), 'PPpp')}
                </p>
                <div className="mt-4 flex justify-between">
                  <Link href={`/${task.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <div className="flex justify-between">
        <Link href="/add">
          <Button variant="default" size="lg" className="mt-6">
            Add New Task
          </Button>
        </Link>
        <div className="flex justify-between gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span>{currentPage} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
