export { };
const helper = require('../utils/helper');
module.exports = {
    name: '!resume',
    description: 'Resume!',
    execute(msg, queue) {
        const serverQueue = helper.getQueue(msg);
        serverQueue.connection.dispatcher.resume();
    },
};
