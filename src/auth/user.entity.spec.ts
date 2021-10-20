import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UserEntity', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        bcrypt.hash = jest.fn();
    });

    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
            bcrypt.hash.mockReturnValue('testPassword'); // return hashed password
            expect(bcrypt.hash).not.toHaveBeenCalled();

            const result = await user.verifyPassword('123456');
            expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
            expect(result).toEqual(true);
        });

        it('returns false as password is invalid', async () => {
            bcrypt.hash.mockReturnValue('wrongPassword'); // return hashed password
            expect(bcrypt.hash).not.toHaveBeenCalled();

            const result = await user.verifyPassword('wrongPassword');
            expect(bcrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
            expect(result).toEqual(false);
        });
    });
});
