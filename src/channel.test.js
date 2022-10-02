import { getData, setData } from './dataStore';
import { channelInviteV1, channelMessagesV1, channelJoinV1 } from './channel';
import { authRegisterV1 } from './auth';
import { channelsCreateV1} from './channels';
import { clearV1 } from './other';

describe('channelJoinV1 tests', () => {
    test('successful channel join', () => {
        clearV1();
        const mainUser = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const uMainId = mainUser.authUserId;
        const secondUser = authRegisterV1('another@gmail.com', 'anotherpassword', 'mary', 'jane');
        const secondUserId = secondUser.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const newChannelId = newChannel.channelId;
        const result = channelJoinV1(secondUserId, newChannelId);
    });

    test('channel ID is not a valid channel', () => {
        clearV1();
        const mainUser = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const uMainId = mainUser.authUserId;
        const secondUser = authRegisterV1('another@gmail.com', 'anotherpassword', 'mary', 'jane');
        const secondUserId = secondUser.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const result = channelJoinV1(secondUserId, newChannel.channelId + 1);
        expect(result).toMatchObject({ error: 'error' });

    });

    test('authorised user already a member of the channel', () => {
        clearV1();
        const mainUser = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const uMainId = mainUser.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const newChannelId = newChannel.channelId;
        const result = channelJoinV1(uMainId, newChannelId);
        expect(result).toMatchObject({ error: 'error' });

    });

    test('channelId refers to a channel that is private, user not a global owner or member', () => {
        clearV1();
        const mainUser = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const uMainId = mainUser.authUserId;
        const secondUser = authRegisterV1('another@gmail.com', 'anotherpassword', 'mary', 'jane');
        const secondUserId = secondUser.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', false);
        const newChannelId = newChannel.channelId;
        const result = channelJoinV1(secondUserId, newChannelId);
        expect(result).toMatchObject({ error: 'error' });

    });
    test('channelId refers to a channel that is private, user is a global owner', () => {
        clearV1();
        //Main user is a global owner
        const mainUser = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const uMainId = mainUser.authUserId;
        const secondUser = authRegisterV1('another@gmail.com', 'anotherpassword', 'mary', 'jane');
        const secondUserId = secondUser.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', false);
        const secondChannel = channelsCreateV1(secondUserId, 'Second Channel', false);
        const newChannelId = newChannel.channelId;
        const result = channelJoinV1(uMainId, secondChannel.channelId);
        expect(result).toMatchObject({});

    });

    test('authUserId invalid', () => {
        clearV1();
        const mainUser = authRegisterV1('hello@gmail.com', 'thisisapassword', 'john', 'doe');
        const uMainId = mainUser.authUserId;
        const secondUser = authRegisterV1('another@gmail.com', 'anotherpassword', 'mary', 'jane');
        const secondUserId = secondUser.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const newChannelId = newChannel.channelId;
        const invalidId = uMainId+secondUserId+1;
        const result = channelJoinV1(invalidId, newChannelId);
        expect(result).toMatchObject({ error: 'error' });

    });
    
});


describe('Testing channelMessagesV1', () => {
    test('Checking if channelMessagesV1 is implemented correctly', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uId = userInviteId.authUserId;

        const newChannel = channelsCreateV1(uId, 'New Channel', true);
        const channel = newChannel.channelId;
        expect(channelMessagesV1(uId, channel, 0)).toStrictEqual({
            messages: [
                {
                    messageId: expect.any(Number),
                    uId: uId,
                    message: expect.any(String),
                    timeSent: expect.any(Number),
                }
            ],
            start: expect.any(Number),
            end: expect.any(Number >= -1),
        });
    });

    test('channelId is not a valid channel', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uId = userInviteId.authUserId;

        const newChannel = channelsCreateV1(uId, 'New Channel', true);
        const channel = newChannel.channelId;
        const result = channelMessagesV1(uId, channel + 1, 0);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('channelId is valid but user is not a member of the channel ', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const ownerId = authRegisterV1('owner@unsw.edu.au', '162738', 'Admin', 'Acc');

        const newChannel = channelsCreateV1(ownerId.authUserId, 'New Channel', true);
        const result = channelMessagesV1(uMainId, newChannel.channelId, 0);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('authUserId is invalid', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const result = channelMessagesV1(uMainId + 1, newChannel.channelId, 0);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('start is greater than total messages', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const result = channelMessagesV1(uMainId, newChannel.channelId, 0);
        while (result.end !== -1) {
            result = channelMessagesV1(uMainId, newChannel.channelId, result.end);
        }
        result = channelMessagesV1(uMainId, newChannel.channelId, (result.start + 50));
        expect(result).toMatchObject({ error: 'error' });
    });
});


describe('Testing channelInviteV1', () => {
    test('Check user is succeessfully invited', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const userInvitedId = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userInvitedId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const result = channelInviteV1(uMainId, newChannel.channelId, uSecondId);
        expect(channelInviteV1(uMainId, newChannel.channelId, uSecondId)).toStrictEqual({ error: 'error '});
    });

    test('channelId is not a valid channel', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const userInvitedId = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userInvitedId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const result = channelInviteV1(uMainId, undefined, uSecondId);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('channelId is valid but user is not a member of the channel ', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const userInvitedId = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userInvitedId.authUserId;

        const ownerId = authRegisterV1('owner@unsw.edu.au', '162738', 'Admin', 'Acc');
        const newChannel = channelsCreateV1(ownerId.authUserId, 'New Channel', true);
        const result = channelInviteV1(uMainId, newChannel.channelId, uSecondId);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('uId is not a valid user', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const userInvitedId = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userInvitedId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const invalid = uMainId + uSecondId + 1;
        const result = channelInviteV1(uMainId, newChannel.channelId, invalid);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('uId is already a member of the channel', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const userInvitedId = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userInvitedId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const join = channelJoinV1(uSecondId, newChannel.channelId);
        const result = channelInviteV1(uMainId, newChannel.channelId, uSecondId);
        expect(result).toMatchObject({ error: 'error' });
    });

    test('authUserId is invalid', () => {
        clearV1();
        const userInviteId = authRegisterV1('laurence@unsw.edu.au', '123456', 'Laurence', 'Cat');
        const uMainId = userInviteId.authUserId;
        const userInvitedId = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userInvitedId.authUserId;

        const newChannel = channelsCreateV1(uMainId, 'New Channel', true);
        const invalid = uMainId + uSecondId + 1;
        const result = channelInviteV1(invalid, newChannel.channelId, uSecondId);
        expect(result).toMatchObject({ error: 'error' });
    });

});