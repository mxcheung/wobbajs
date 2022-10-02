import { authRegisterV1, authLoginV1 } from './auth';
import { clearV1 } from './other';
import { userProfileV1 } from './users';

describe('authLoginV1 tests', () => {
    test('Testing correct Login', () => {
        clearV1();
        const UserRego = authRegisterV1('example@gmail.com', 'password', 'ted', 'smith');
        const UserLogin = authLoginV1('example@gmail.com', 'password');
        expect(UserLogin).toStrictEqual({authUserId: expect.any(Number)}); 
    });

    test('Testing correct email but wrong password', () => {
        clearV1();
        const UserRego = authRegisterV1('example@gmail.com', 'password', 'ted', 'smith');
        const UserLogin = authLoginV1('example@gmail.com', 'notoriginalpassword');
        expect(UserLogin).toMatchObject({error: 'Error incorrect password'}); 
    });

    test('Testing wrong email but correct password', () => {
        clearV1();
        const UserRego = authRegisterV1('example@gmail.com', 'password', 'ted', 'smith');
        const UserLogin = authLoginV1('example1@gmail.com', 'password');
        expect(UserLogin).toMatchObject({error: 'Error incorrect email address'}); 
    });

    test('Testing wrong Login', () => {
        clearV1();
        const UserRego = authRegisterV1('example@gmail.com', 'password', 'ted', 'smith');
        const UserLogin = authLoginV1('example1@gmail.com', 'password1');
        expect(UserLogin).toMatchObject({error: 'Error incorrect Login details'}); 
    });

    test('Testing email does not belong to an user', () => {
        clearV1();
        const UserRego = authRegisterV1('JohnHoward@gmail.com', 'password', 'John', 'Howard');
        const UserLogin = authLoginV1('example1@gmail.com', 'password1');;
        expect(UserLogin).toMatchObject({error: 'Error incorrect email address'}); 

    });

});


describe('authRegisterV1 tests', () => {
    test('Testing successful Registration', () => {
        clearV1();
        const result = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const result2 = authLoginV1('hello@gmail.com', 'thisisapassword');
        expect(result2).toStrictEqual({authUserId: expect.any(Number)});
    });

    test('Testing non valid email case 1', () => {
        clearV1();
        const result = authRegisterV1('johngmail.com', '123456', 'aa', 'bb');
        expect(result).toMatchObject({error: 'error'});
    });
    test('Testing non valid email case 2', () => {
        clearV1();
        const result2 = authRegisterV1('hello@yahoo', '514141', 'xx', 'yy');
        expect(result2).toMatchObject({error: 'error'});
    });

    test('Testing email already entered', () => {
        clearV1();
        const result = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const result2 = authRegisterV1('hello@gmail.com', 'differentpassword', 'laurence', 'cat');
        expect(result2).toMatchObject({error: 'error'});

    });

    test('password less than 6 characters', () => {
        clearV1();
        const result = authRegisterV1('hello@gmail.com', 'hell0', 'john', 'doe');
        expect(result).toMatchObject({error: 'error'});
        const result2 = authRegisterV1('differentemail@gmail.com', '1Hel', 'sam', 'witt');
        expect(result2).toMatchObject({error: 'error'});

    });
    test('nameFirst not between 1 and 50 characters inclusive lower bound', () => {
        clearV1();
        const result = authRegisterV1('hello@gmail.com', 'hello5555', '', 'smith');
        expect(result).toMatchObject({error: 'error'});

    });
    test('nameFirst not between 1 and 50 characters inclusive, upper bound', () => {
        clearV1();
        const result2 = authRegisterV1('differentemail@gmail.com', 'anotherpassword', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'smith');
        expect(result2).toMatchObject({error: 'error'});

    });
    test('nameLast not between 1 and 50 characters inclusive, lower bound', () => {
        clearV1();
        const result = authRegisterV1('hello@gmail.com', 'hello5555', 'freddie', '');
        expect(result).toMatchObject({error: 'error'});

    });
    test('nameLast not between 1 and 50 characters inclusive, upper bound', () => {
        clearV1();
        const result2 = authRegisterV1('differentemail@gmail.com', 'anotherpassword', 'sammy', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(result2).toMatchObject({error: 'error'});

    });
    test('testing handleStr, not 20 characters', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'samuel', 'jones');
        const profile = userProfileV1(result.authUserId, result.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljones');

    });
    test('testing handleStr, more than 20 characters', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'samuel', 'jonesjonesjonesjones');
        const profile = userProfileV1(result.authUserId, result.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljonesjonesjone');

    });
    test('testing handleStr, 2nd user with same name, less than 20 characters', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'samuel', 'jones');
        const result2 = authRegisterV1('different@yahoo.com', 'password', 'samuel', 'jones');
        const profile = userProfileV1(result2.authUserId, result2.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljones0');

    });
    test('testing handleStr, 3nd user with same name, less than 20 characters', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'samuel', 'jones');
        const result2 = authRegisterV1('different@yahoo.com', 'password', 'samuel', 'jones');
        const result3 = authRegisterV1('another@yahoo.com', 'password', 'samuel', 'jones');
        const profile = userProfileV1(result3.authUserId, result3.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljones1');

    });
    test('testing handleStr, 2nd user with same name, more than 20 characters', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'samuel', 'jonesjonesjonesjones');
        const result2 = authRegisterV1('different@yahoo.com', 'password', 'samuel', 'jonesjonesjonesjones');
        const profile = userProfileV1(result2.authUserId, result2.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljonesjonesjone0');

    });
    test('testing handleStr, remove non alphanumeric characters and caps', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'sa?m,UeL', 'Jo*neS');
        const profile = userProfileV1(result.authUserId, result.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljones');

    });
    test('testing handleStr, remove all caps', () => {
        clearV1();
        const result = authRegisterV1('email@yahoo.com', 'password', 'SAMUEL', 'JONES');
        const profile = userProfileV1(result.authUserId, result.authUserId);
        const handle = profile.handleStr;
        expect(handle).toStrictEqual('samueljones');

    });
});

