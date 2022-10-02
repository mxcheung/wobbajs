function channelDetailsV1(authUserId, channelId) {
    return {
      name: 'Hayden',
      ownerMembers: [
        {
          uId: 1,
          email: 'example@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Jacobs',
          handleStr: 'haydenjacobs',
        }
      ],
      allMembers: [
        {
          uId: 1,
          email: 'example@gmail.com',
          nameFirst: 'Hayden',
          nameLast: 'Jacobs',
          handleStr: 'haydenjacobs',
        }
      ],
    }
}
function channelInviteV1(authUserId, channelId, uId) {

    return {

    };
}

function channelMessagesV1(authUserId, channelId, start) {

    return {
        messages: [
            {
                messageId: 1,
                uId: 1,
                message: 'Hello world',
                timeSent: 1582426789,
            }
            ],
            start: 0,
            end: 50,
    };
}

function channelJoinV1(authUserId, channelId) {

    return {};
}

export { channelDetailsV1, channelInviteV1, channelMessagesV1, channelJoinV1 }
