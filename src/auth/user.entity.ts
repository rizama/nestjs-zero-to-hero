import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { TaskEntity } from 'src/tasks/task.entity';

@Entity('users')
@Unique(['username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({
        nullable: true,
    })
    salt: string;

    @OneToMany((type) => TaskEntity, (task) => task.user, { eager: true })
    tasks: TaskEntity[];

    async verifyPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
