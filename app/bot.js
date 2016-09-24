const Bot = require('fb-local-chat-bot');

const JOKE = 'Did you know photons had mass? I didn\'t even know they were Catholic.';
const RiddleImageUrl = 'http://tinyurl.com/he9tsph';
const PostBackTypes = {
  TELL_JOKE: 'TELL_JOKE',
  TELL_ANOTHER_JOKE: 'TELL_ANOTHER_JOKE',
  LIST_JOKES: 'LIST_JOKES',
  TELL_RIDDLE: 'TELL_RIDDLE',
};
const QuickReplyTypes = {
  TELL_JOKE: 'TELL_JOKE',
  WRONG_ANSWER: 'WRONG_ANSWER',
  CORRECT_ANSWER: 'CORRECT_ANSWER',
};
// Create 10 Quick Replies, Joke 1, Joke 2, ...
const JokeQuickReplies = [...Array(10).keys()].map(x => Bot.createQuickReply(`Joke ${x + 1}`, 'TELL_JOKE'));

// initialize Bot and define event handlers
Bot.init(
  process.env.FB_ACCESS_TOKEN,
  process.env.FB_VERIFY_TOKEN,
  typeof process.env.USE_LOCAL_CHAT !== 'undefined' ? process.env.USE_LOCAL_CHAT : true
);

Bot.on('text', (event) => {
  const senderID = event.sender.id;
  Bot.sendButtons(
    senderID,
    'Hello, how are you?',
    [
      Bot.createPostbackButton('Tell me a joke', PostBackTypes.TELL_JOKE),
      Bot.createPostbackButton('Show list of jokes', PostBackTypes.LIST_JOKES),
      Bot.createPostbackButton('Solve a riddle', PostBackTypes.TELL_RIDDLE),
    ]
  );
});

Bot.on('postback', (event) => {
  const senderID = event.sender.id;
  switch (event.postback.payload) {
    case PostBackTypes.TELL_JOKE:
      Bot.sendText(senderID, JOKE);
      Bot.sendButtons(
        senderID,
        'Ha. Ha. Ha. What else may I do for you?',
        [Bot.createPostbackButton('Tell me another joke', PostBackTypes.TELL_ANOTHER_JOKE)]
      );
      break;
    case PostBackTypes.TELL_ANOTHER_JOKE:
      Bot.sendText(senderID, 'Sorry, I only know one joke');
      break;
    case PostBackTypes.LIST_JOKES:
      Bot.sendQuickReplyWithText(
          senderID,
          'Select a joke',
          JokeQuickReplies
      );
      break;
    case PostBackTypes.TELL_RIDDLE:
      Bot.sendQuickReplyWithAttachment(
        senderID,
        Bot.createImageAttachment(RiddleImageUrl),
        [
          Bot.createQuickReply('97', QuickReplyTypes.WRONG_ANSWER),
          Bot.createQuickReply('87', QuickReplyTypes.CORRECT_ANSWER),
          Bot.createQuickReply('89', QuickReplyTypes.WRONG_ANSWER),
          Bot.createQuickReply('91', QuickReplyTypes.WRONG_ANSWER),
        ]
      );
      break;
    default:
      break;

  }
});

Bot.on('quick_reply', (event) => {
  const senderID = event.sender.id;
  switch (event.message.quick_reply.payload) {
    case QuickReplyTypes.TELL_JOKE:
      Bot.sendText(senderID, `You asked for ${event.message.text}`);
      break;
    case QuickReplyTypes.WRONG_ANSWER:
      Bot.sendText(senderID, 'Wrong answer... :(');
      break;
    case QuickReplyTypes.CORRECT_ANSWER:
      Bot.sendText(senderID, 'Correct answer! :)');
      break;
    default:
      break;
  }
});

export default Bot;
