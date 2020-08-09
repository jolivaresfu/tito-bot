import { inspect } from "util";

export { };
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const helper = require('../utils/helper');

module.exports = {
    name: '!tb',
    description: 'Ping!',
    execute(msg) {
        const serverQueue = helper.getQueue(msg);
        return channelQueue(msg, serverQueue);
    },
};

const channelQueue = async (msg, serverQueue) => {
    const query = msg.content.slice(4);
    const voiceChannel = msg.member.voice.channel;
    if (!serverQueue) {
        const queueContruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            globalQueue: []
        };
        yts(query, async (error, response) => {
            const video = response.videos[0].url;
            helper.setToQueue(msg, queueContruct);
            queueContruct.songs.push(video);
            queueContruct.globalQueue.push({ title: response.videos[0].title, image: response.videos[0].image, author: response.videos[0].author.name, video });
            const connection = await voiceChannel.join();
            queueContruct.connection = connection;
            return playSong(msg, queueContruct);
        });
    } else {
        yts(query, async (error, response) => {
            const video = response.videos[0].url;
            serverQueue.globalQueue.push({ title: response.videos[0].title, image: response.videos[0].image, author: response.videos[0].author.name, video });
            serverQueue.songs.push(video);
            return msg.channel.send(`YAYA TITO ${response.videos[0].title} se añadió a tu cola :$`);
        });
    }
}


const playSong = (msg, queueContruct) => {

    const serverQueue = helper.getQueue(msg);
    const currentSong = queueContruct.songs[0];

    if (currentSong) {
        const currentSongProperties = queueContruct.globalQueue.find(element => element.video === currentSong);
        serverQueue.connection
            .play(ytdl(currentSong, { filter: 'audioonly', quality: 'highestaudio' }))
            .on("finish", () => {
                if (serverQueue.songs.length > 0) {
                    serverQueue.songs.shift();
                    playSong(msg, serverQueue);
                }
            })
            .on("error", error => console.error(error));

        serverQueue.connection.dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
        return sendSongMessage(currentSongProperties, serverQueue);
    }

}

const sendSongMessage = (
    songProperties: any,
    serverQueue: any,
) => {

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(songProperties.title)
        .setURL(songProperties.video)
        .setAuthor(songProperties.author)
        .setThumbnail(songProperties.image);
    return serverQueue.textChannel.send(exampleEmbed);

}