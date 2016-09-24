import { expect } from 'chai';
import Bot from 'fb-local-chat-bot';
import makeServer from '../server';

function userSendMessage(senderID, text) {
  Bot.emit(

    'text',
    {
      sender: { id: senderID },
      message: { text },
    },
  );
}

function userSendPostBack(senderID, payload) {
  Bot.emit(
    'postback',
    {
      sender: { id: senderID },
      postback: { payload },
    },
  );
}

describe('Basic server test', () => {
  let server;
  const userID = 'testUser';
  beforeEach(() => {
    server = makeServer();
  });

  afterEach((done) => {
    Bot.clearLocalChatMessages();
    server.close(done);
  });

  it('Test chat', () => {
    userSendMessage(userID, 'hi');
    let messages = Bot.getLocalChatMessagesForUser(userID);
    expect(messages.length).to.equal(1);

    userSendPostBack(userID, 'TELL_JOKE');
    messages = Bot.getLocalChatMessagesForUser(userID);
    expect(messages.length).to.equal(3);

    userSendPostBack(userID, 'TELL_ANOTHER_JOKE');
    messages = Bot.getLocalChatMessagesForUser(userID);
    expect(messages.length).to.equal(4);
    const lastMessage = messages[messages.length - 1];
    expect(lastMessage.text).to.equal('Sorry, I only know one joke');
  });
});
