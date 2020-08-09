export { };
const helper = require('../utils/helper');
module.exports = {
  name: '!skip',
  description: 'Skip!',
  execute(msg, queue) {
    const serverQueue = helper.getQueue(msg);
    serverQueue.connection.dispatcher.end();
  },
};
