const helper = require('../utils/helper');
module.exports = {
  name: '!pause',
  description: 'Pause!',
  execute(msg, queue) {
    const serverQueue = helper.getQueue(msg);
    serverQueue.connection.dispatcher.pause();
  },
};
