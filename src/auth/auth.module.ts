import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-strategy';
import { UserRepository } from './user.repository';

@Module({
    imports: [
        JwtModule.register({
            secret: `${process.env.JWT_SECRET}`,
            signOptions: {
                expiresIn: "5m",
            },
        }),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
