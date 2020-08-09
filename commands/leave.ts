import { inspect } from "util";

export { };
const helper = require('../utils/helper');
module.exports = {
    name: '!leave',
    description: 'Leave!',
    execute(msg, queue) {
        const serverQueue = helper.getQueue(msg);
        serverQueue.connection.dispatcher.end();
        helper.deleteQueue(msg);
        msg.member.voice.channel.leave();
    },
};
