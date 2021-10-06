import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { Task, TaskStatus } from './tasks.model';
// import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskEntity } from './task.entity';
import { TaskRepository } from './task.repository';
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    // private tasks: Task[] = [];

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTaskWithFIlter(filterDto: GetTaskFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status)
    //     }

    //     if (search) {
    //         tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search))
    //     }

    //     return tasks;
    // }

    async getTaskById(id: number): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne(id);    

        if (!found) {
            throw new NotFoundException(`Task with the ID "${id}" Not Found`);
        }

        return found;
    }

    // getTaskById(id: string): Task {
    //     const found = this.tasks.find((task) => task.id === id);

    //     if (!found) {
    //         throw new NotFoundException(`Task with the ID "${id}" Not Found`);
    //     }

    //     return found;
    // }

    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const { title, description } = createTaskDto;

    //     const task: Task = {
    //         id: uuidv4(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN,
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }

    // deleteTaskById(id: string): void {
    //     const found = this.getTaskById(id);
    //     const restTask = this.tasks.filter((task) => task.id !== found.id);
    //     this.tasks = restTask;
    // }

    // updateTaskStatusById(status: TaskStatus, id: string): Task {
    //     const updateTask = this.getTaskById(id);
    //     updateTask.status = status;
    //     return updateTask;
    // }
}
