export interface Task {
  pk: number;
  title: string;
  due_date: string | null;
  task_list: string | null;
  completed: boolean;
}

export interface List {
  slug: string;
  name: string;
}