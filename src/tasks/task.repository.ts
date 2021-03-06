import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task.enum';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
    private logger = new Logger('TaskRepository');

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<TaskEntity> {
        const { title, description } = createTaskDto;

        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        try {
            await task.save();
        } catch (error) {
            this.logger.error(
                `Failed to create task for user "${
                    user.username
                }". Data: ${JSON.stringify(createTaskDto)}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
        delete task.user;
        return task;
    }

    async getTasks(
        filterDto: GetTaskFilterDto,
        user: User,
    ): Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('tasks');

        query.where('tasks.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('tasks.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                'tasks.title LIKE :search OR tasks.description LIKE :search',
                { search: `%${search}%` },
            );
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${
                    user.username
                }". Filters: ${JSON.stringify(filterDto)}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }
}
