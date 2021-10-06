import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log(__dirname + '/../../**/*.entity.ts');
export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'sam',
    password: 'sam123',
    database: 'taskmanagement',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'], // => represent table
    synchronize: true, // => 
};
