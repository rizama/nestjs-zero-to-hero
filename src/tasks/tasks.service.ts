import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;

        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTaskById(id: string): void {
        const restTask = this.tasks.filter(task => task.id !== id);
        this.tasks = restTask;
    }

    updateTaskStatusById(status: TaskStatus, id: string): Task {
        const updateTask = this.getTaskById(id);
        updateTask.status = status;
        return updateTask;
    }
}