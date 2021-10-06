import { BaseEntity, Column, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./tasks.model";

export class TaskEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;
}