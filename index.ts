require('dotenv').config();
const { google } = require('googleapis');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const broadcast = bot.voice.createBroadcast();

// Each API may support multiple version. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

const getVideo = async (videoReq: string) => {

    const res = await youtube.search.list({
        part: 'id,snippet',
        q: videoReq,
    });
    return `https://www.youtube.com/watch?v=${res.data.items[0].id.videoId}`;
}

const botMessage = async () => {

    bot.login(process.env.BOT_TOKEN);
    bot.on('ready', () => {
        console.info(`Logged in as ${bot.user.tag}!`);
    });

    bot.on('message', async msg => {
        if (msg.content.startsWith('!tb')) {
            msg.reply('beep bop beep... buscando video...');
            msg.member.voice.channel.join();
            const video = await getVideo(msg.content.slice(4));
            msg.channel.send(`Video URL: ${video}`);
            broadcast.play(ytdl(video, { filter: 'audioonly', quality: 'highestaudio' }));
            for (const connection of bot.voice.connections.values()) {
                connection.play(broadcast);
            }
        }
    });
}

botMessage();