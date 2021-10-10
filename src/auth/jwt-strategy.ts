import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // get token from bearer
            secretOrKey: `${process.env.JWT_SECRET}`,
        });
    }

    // method validate harus ada karena extends dari PassportStrategy
    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userRepository.findOne({ username: username });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
