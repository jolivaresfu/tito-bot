export { };
import { inspect } from "util";
const Discord = require('discord.js');
const helper = require('../utils/helper');


module.exports = {
    name: '!q',
    description: 'Queue!',
    execute(msg, queue) {
        const serverQueue = helper.getQueue(msg);

        return sendQueueMessage(serverQueue);
    },
};

const sendQueueMessage = (serverQueue) => {

    const fields = [];

    if (!serverQueue) {
        fields.push({ name: 'EMPTY QUEUE', value: '\u200b' });
    } else {
        if (serverQueue.globalQueue.length > 0) {
            serverQueue.globalQueue.forEach((element, _index) => {
                fields.push({ name: `${_index + 1}) ${element.title}`, value: '\u200b' });
            });
        }
    }

    const objMsg = {
        color: 0x0099ff,
        fields,
    };

    return serverQueue.textChannel.send({ embed: objMsg });

}
