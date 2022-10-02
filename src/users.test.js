import { authRegisterV1 } from './auth';
import { userProfileV1 } from './users';
import { clearV1 } from './other';

describe('Testing userProfileV1', () => {
    beforeEach(() => {
        clearV1();
        const firstUser = authRegisterV1('johnsmith@gmail.com', '12345', 'John', 'Smith');
        const secondUser = authRegisterV1('janedoe@gmail.com', '12345', 'Jane', 'Doe');
    });

    test('User successfully created and profile returned', () => {
        const userprofile = userProfileV1(firstUser, firstUser);
        expect(userprofile).toStrictEqual({
            userId: firstUser,
            email: 'johnsmith@gmail.com',
            nameFirst: 'John',
            nameLast: 'Smith',
            handleStr: 'johnsmith',
        });
    });

    test('User successfully created and profile returned with two users', () => {
        const userprofile = userProfileV1(secondUser, firstUser);
        expect(userprofile).toStrictEqual({
            userId: firstUser,
            email: 'johnsmith@gmail.com',
            nameFirst: 'John',
            nameLast: 'Smith',
            handleStr: 'johnsmith',
        });
    });

    test('Error: authUserId not valid', () => {
        const userprofile = userProfileV1('', firstUser);
        expect(userProfile).toStrictEqual({error: 'authUserId not valid'});
    });

    test('Error: uId not valid', () => {
        const userprofile = userProfileV1(secondUser, '');
        expect(userprofile).toStrictEqual({error: 'uId not valid'});

    });
});