import { Task } from "../entities/task";

export interface Repository {
    findAll(): Promise<Array<Task>>;
    findById(id: number): Promise<Task>;
    save(task: Task): Promise<void>;
    update(task: Task): Promise<void>;
    delete(id: number): Promise<void>;
}

export class LocalRepository implements Repository {
    private tasks: Array<Task>;
    private nextId: number;

    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }

    async findAll(): Promise<Array<Task>> {
        return this.tasks;
    }

    async findById(id: number): Promise<Task> {
        const task: Task | undefined = this.tasks.find(t => t.id === id);
        if (!task) {
            throw new Error("Tarefa não encontrada!");
        }
        return task;
    }

    async save(task: Task): Promise<void> {
        if (!task.id) {
            task.id = this.nextId++;
        }
        this.tasks.push(task);
    }

    async update(task: Task): Promise<void> {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index === -1) {
            throw new Error("Tarefa não encontrada!");
        }
        this.tasks[index] = task;
    }

    async delete(id: number): Promise<void> {
        this.tasks = this.tasks.filter(t => t.id !== id);
    }

}

export const taskRepository: Repository = new LocalRepository();