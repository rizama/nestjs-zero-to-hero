import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typorm.config';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `${process.env.NODE_ENV}.env`
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        TasksModule,
        AuthModule
    ],
})
export class AppModule {}
