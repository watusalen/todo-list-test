import { useEffect, useState } from 'react';
import { Task } from '../model/entities/task';
import { TaskService } from '../model/service/taskService';

export interface UseTasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export interface UseTasksActions {
  refresh: () => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
}

export function useTasks(taskService: TaskService): UseTasksState & UseTasksActions {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError('Erro ao carregar as tarefas');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setError(null);
    try {
      await taskService.deleteTask(id);
      await refresh();
    } catch (err) {
      setError('Erro ao deletar a tarefa');
    }
  };

  const toggleComplete = async (id: number) => {
    setError(null);
    try {
      await taskService.toggleTaskCompletion(id);
      await refresh();
    } catch (err) {
      setError('Erro ao alterar status da tarefa');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { tasks, loading, error, refresh, deleteTask, toggleComplete };
}
