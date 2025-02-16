export interface Task {
  id: number,
  title: string,
  description: string,
  dueDate: string,
  priority: number,
  isCompleted: boolean,
  createdAt: string,
  updatedAt: string,
}


export type NewTask = {
  title: string;
  description: string;
  dueDate: string;
  priority: number;
};