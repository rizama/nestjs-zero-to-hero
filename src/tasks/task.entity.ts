import { User } from '../auth/user.entity';
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task.enum';

@Entity('tasks') // => table name. If not specified, then table name is generated from entity class name.
export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
    user: User;

    @Column()
    userId: number;
}
