const queue = new Map();

const getQueue = (msg) => {
    return queue.get(msg.guild.id);
}

const setToQueue = (msg, queueContruct) => {
    return queue.set(msg.guild.id, queueContruct);
}

const deleteQueue = (msg) => {
    return queue.delete(msg.guild.id);
};
module.exports = {
    getQueue,
    setToQueue,
    deleteQueue
}