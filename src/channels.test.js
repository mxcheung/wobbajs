import {getData, setData} from './dataStore';
import { channelInviteV1, channelJoinV1 } from './channel';
import { authRegisterV1 } from './auth';
import {channelsCreateV1, channelsListV1} from './channels';
import {clearV1} from './other';

describe ('Tests for channelsCreateV1', () => {
    test('testing when channelsCreateV1 name is less than 1 character', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        expect(channelsCreateV1(uMainId, '', true)).toStrictEqual({ error: expect.any(String) });
    });
    test ('test for when channelsCreateV1 name is more than 20 characters', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        expect(channelsCreateV1(uMainId, 'this name is more than 20 characters long', true)).toStrictEqual({ error: expect.any(String) });
    });
    //not sure how to test for when authUserID is invalid
    test ('test for when authUserID is invalid', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        const userId2 = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userId2.authUserId;
        const invalidId = uMainId + uSecondId + 3;
        expect(channelsCreateV1(invalidId, 'channel_name', true)).toStrictEqual({ error: expect.any(String) });

    });
    test ('create a new channel with channelsCreateV1 successfully', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        const result = channelsCreateV1(uMainId, "channel_name", true);
        expect(result).toStrictEqual(
            {
                channelId: expect.any(Number),
            }
        );
    });
});

describe ('Tests for channelsListV1', () => {
    test('test for successfully providing an array of channels where user is only part of one channel ', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        const firstChannel = channelsCreateV1(uMainId, "first_channel", true);
        const firstChannelId = firstChannel.channelId;
        expect(channelsListV1(uMainId)).toStrictEqual ({
            channels: [
                {
                  channelId: firstChannelId,
                  name: 'first_channel',
                }
              ]
        });
    });
    test('test for successfully providing an array of channels where user is part of multiple channels using channel join', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        const firstChannel = channelsCreateV1(uMainId, "first_channel", true);
        const firstChannelId = firstChannel.channelId;
        const userId2 = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userId2.authUserId;
        const secondChannel = channelsCreateV1(uSecondId, "second_channel", true);
        const secondChannelId = secondChannel.channelId;
        channelJoinv1(uMainId, secondChannelId);
        expect(channelsListV1(uMainId)).toStrictEqual ({
            channels: [
                {
                  channelId: firstChannelId,
                  name: 'first_channel',
                },
                {
                  channelId: secondChannelId,
                  name : 'second_channel',
                }
              ]
        });
    });
    test('test for invalid userId', () => {
        clearV1();
        const userId = authRegisterV1('hannah@unsw.edu.au', '123456', 'Hannah', 'Cheung');
        const uMainId = userId.authUserId;
        const userId2 = authRegisterV1('john@unsw.edu.au', '678910', 'John', 'Doe');
        const uSecondId = userId2.authUserId;
        const invalidId = uMainId + uSecondId + 3;
        expect(channelsListV1(invalidId)).toStrictEqual({ error: expect.any(String) });
    });
});

describe('Testing channelsListAllV1', () => {
    beforeEach(() => {
        clearV1();
        const firstUser = authRegisterV1('johnsmith@gmail.com', '12345', 'John', 'Smith');
        const secondUser = authRegisterV1('janedoe@gmail.com', '12345', 'Jane', 'Doe');
        const thirdUser = authRegisterV1('JohnDoe@gmail.com', '12345', 'John', 'Doe');
    });

    test('Successfully Lists No Channels', () => {
        const channelsArray = channelsListAllV1(firstUser);
        expect(channelsArray).toStrictEqual({
            channels: [],
        });
    });

    test('Successfully Lists Single Public Channel', () => {
        const channelOne = channelsCreateV1(firstUser, 'channelOne', true);
        const channelsArray = channelsListAllV1(firstUser);
        expect(channelsArray).toStrictEqual({
            channels: [
                {
                    channelId: channelOne.channelId,
                    name: 'channelOne',
                    isPublic: true,
                    ownerMembers: channelDetailsV1(firstUser, channelOne.channelId).ownerMembers,
                    allMembers: channelDetailsV1(firstUser, channelOne.channelId).allMembers,
                } 
            ]
        });
    });

    test('Successfully Lists Single Private Channel', () => {
        const channelOne = channelsCreateV1(firstUser, 'channelOne', false);
        const channelsArray = channelsListAllV1(firstUser);
        expect(channelsArray).toStrictEqual({
            channels: [
                {
                    channelId: channelOne.channelId,
                    name: 'channelOne',
                    isPublic: false,
                    ownerMembers: channelDetailsV1(firstUser, channelOne.channelId).ownerMembers,
                    allMembers: channelDetailsV1(firstUser, channelOne.channelId).allMembers,
                }
            ]
        });
    });

    test('Successfully Lists Two Channels, both Public and Private, with Each User a Part of Different Channels', () => {
        const channelOne = channelsCreateV1(firstUser, 'channelOne', true);
        const channelTwo = channelsCreateV1(secondUser, 'channelTwo', false);
        const channelsArray = channelsListAllV1(firstUser);
        expect(channelsArray).toStrictEqual({
            channels: [
                {
                    channelId: channelOne.channelId,
                    name: 'channelOne',
                    isPublic: true,
                    ownerMembers: channelDetailsV1(firstUser, channelOne.channelId).ownerMembers,
                    allMembers: channelDetailsV1(firstUser, channelOne.channelId).allMembers,
                },
                {
                    channelId: channelTwo.channelId,
                    name: 'channelTwo',
                    isPublic: false,
                    ownerMembers: channelDetailsV1(secondUser, channelTwo.channelId).ownerMembers,
                    allMembers: channelDetailsV1(secondUser, channelTwo.channelId).allMembers,
                }
            ]
        });
    });

    test('Successfully Lists Three Channels, both Public and Private, with Each User a Part of Different Channels', () => {
        const channelOne = channelsCreateV1(firstUser, 'channelOne', true);
        const channelTwo = channelsCreateV1(secondUser, 'channelTwo', false);
        const channelThree = channelsCreateV1(thirdUser, 'channelThree', false);
        const channelsArray = channelsListAllV1(firstUser);
        expect(channelsArray).toStrictEqual({
            channels: [
                {
                    channelId: channelOne.channelId,
                    name: 'channelOne',
                    isPublic: true,
                    ownerMembers: channelDetailsV1(firstUser, channelOne.channelId).ownerMembers,
                    allMembers: channelDetailsV1(firstUser, channelOne.channelId).allMembers,
                },
                {
                    channelId: channelTwo.channelId,
                    name: 'channelTwo',
                    isPublic: false,
                    ownerMembers: channelDetailsV1(secondUser, channelTwo.channelId).ownerMembers,
                    allMembers: channelDetailsV1(secondUser, channelTwo.channelId).allMembers,
                },
                {
                    channelId: channelThree.channelId,
                    name: 'channelThree',
                    isPublic: false,
                    ownerMembers: channelDetailsV1(thirdUser, channelThree.channelId).ownerMembers,
                    allMembers: channelDetailsV1(thirdUser, channelThree.channelId).allMembers,
                }
            ]
        });
    });

    test('Error: authUserId is invalid', () => {
        const channelOne = channelsCreateV1(firstUser, 'channelOne', true);
        const channelsArray = channelsListAllV1('');
        expect(channelsArray).toStrictEqual({error: 'authUserId is invalid'});
    });
})