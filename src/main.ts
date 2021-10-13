import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
    const logger = new Logger('bootstrap');
    const serverConfig = config.get('server');

    const PORT = process.env.PORT || serverConfig.port;
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT);

    logger.log(`Application Listening to port: ${PORT}`);
}
bootstrap();
