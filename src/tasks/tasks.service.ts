import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
// import { Task, TaskStatus } from './tasks.model';
// import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task.enum';
import { TaskRepository } from './task.repository';
@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    // private tasks: Task[] = [];

    async getTasks(filterDto: GetTaskFilterDto): Promise<TaskEntity[]> {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Task with the ID "${id}" Not Found`);
        }

        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<TaskEntity> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        Logger.log(JSON.stringify(result));

        if (!result.affected) {
            throw new NotFoundException(`Task with the ID "${id}" Not Found`);
        }
    }

    async updateTaskStatusById(status: TaskStatus, id: number): Promise<TaskEntity>{
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();

        return task;
    }
}
