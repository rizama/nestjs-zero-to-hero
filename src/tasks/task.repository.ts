import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task.enum';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
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
        await task.save();
        delete task.user;

        return task;
    }

    async getTasks(filterDto: GetTaskFilterDto): Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('tasks');

        if (status) {
            query.andWhere('tasks.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                'tasks.title LIKE :search OR tasks.description LIKE :search',
                { search: `%${search}%` },
            );
        }

        const tasks = await query.getMany();
        return tasks;
    }
}
