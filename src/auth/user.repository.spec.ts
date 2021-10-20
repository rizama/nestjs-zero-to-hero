import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = {
    username: 'TestUsername',
    password: 'TestPassword',
};

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(
                userRepository.signUp(mockCredentialsDto),
            ).resolves.not.toThrow();
        });

        it('throws a conflict exception as username already exists', async () => {
            save.mockRejectedValue({ code: '23505' });
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
                ConflictException,
            );
        });

        it('throws a conflict exception as username already exists', async () => {
            save.mockRejectedValue({ code: '123123' }); // unhandle error code
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('validateUserPassword', () => {
        let user;

        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'TestUsername';
            user.verifyPassword = jest.fn();
        });

        it('returns the username as validation is successful', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.verifyPassword.mockResolvedValue(true);

            const result = await userRepository.validateUserPassword(
                mockCredentialsDto,
            );
            expect(result).toEqual('TestUsername');
        });

        it('returns null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(
                mockCredentialsDto,
            );
            expect(user.verifyPassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        });

        it('returns null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.verifyPassword.mockResolvedValue(false);
            const result = await userRepository.validateUserPassword(
                mockCredentialsDto,
            );
            expect(user.verifyPassword).toHaveBeenCalled();
            expect(result).toBeNull();
        });
    });

    describe('hashPassword', () => {
        it('calls bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword(
                'testPassword',
                'testSalt',
            );
            expect(bcrypt.hash).toHaveBeenCalledWith(
                'testPassword',
                'testSalt',
            );
            expect(result).toEqual('testHash');
        });
    });
});
