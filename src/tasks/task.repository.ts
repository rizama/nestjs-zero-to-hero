import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskEntity } from "./task.entity";
import { TaskStatus } from "./task.enum";

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
    async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        const { title, description } = createTaskDto;

        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        await task.save();

        return task;
    }
}