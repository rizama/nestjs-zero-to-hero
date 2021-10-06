import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'sam',
    password: 'sam123',
    database: 'taskmanagement',
    entities: [__dirname + '/../**/*.entity.ts'], // => 
    synchronize: true, // => 
};
