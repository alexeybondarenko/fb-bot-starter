require('bluebird');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Bot = require('./bot').default;

function makeServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('tiny'));

  app.use('/chat', Bot.router());

  app.set('port', process.env.PORT || 5000);

  const server = app.listen(app.get('port'), (err) => {
    if (err) {
      console.log('error while starting server', err); // eslint-disable-line
    }

    const host = `http://localhost:${app.get('port')}`;
    console.log(`Server is running: ${host}`); // eslint-disable-line
    if (process.env.USE_LOCAL_CHAT) {
      console.log(`Local chat is running here: ${host}/chat/localChat/`); // eslint-disable-line
    }
  });
  return server;
}

module.exports = makeServer;
module.exports.default = makeServer;
