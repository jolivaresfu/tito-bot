
require('dotenv').config();
const yts = require('yt-search')
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const queue = new Map();
let index = 1;
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});



bot.login(process.env.BOT_TOKEN);
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async msg => {

    const args = msg.content.split(/ +/);
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) return;

    try {
        bot.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
    // if (message.content.startsWith('!tb')) {
    //     const serverQueue = queue.get(message.guild.id);
    //     execute(message, serverQueue);
    // }
    // if (message.content === '!skip' || message.content === '!next') {
    //     const serverQueue = queue.get(message.guild.id);
    //     serverQueue.connection.dispatcher.end();
    // }
    // if (message.content === '!queue' || message.content === '!q') {
    //     // const serverQueue = queue.get(message.guild.id);
    //     // message.channel.send(inspect(serverQueue.songProperties));
    //     message.channel.send('Funcion en mantencion mi pana, se me cuida')
    // }
});


const execute = async (message, serverQueue) => {
    const query = message.content.slice(4);
    const voiceChannel = message.member.voice.channel;
    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true,
            songProperties: []
        };
        yts(query, async (error, response) => {
            console.log(response.videos[0].author);
            const video = response.videos[0].url;
            queue.set(message.guild.id, queueContruct);
            queueContruct.songs.push(video);
            queueContruct.songProperties.push({ id: index, title: response.videos[0].title, image: response.videos[0].image, author: response.videos[0].author.name });
            index++;
            const connection = await voiceChannel.join();
            queueContruct.connection = connection;
            play(message.guild, queueContruct);
        });
    } else {
        yts(query, async (error, response) => {
            const video = response.videos[0].url;
            serverQueue.songProperties.push({ id: index, title: response.videos[0].title, image: response.videos[0].image, author: response.videos[0].author.name });
            index++;
            serverQueue.songs.push(video);
            return message.channel.send(`YAYA TITO ${video}`);
        });
    }
}

const play = (guild, customQueue) => {

    const serverQueue = queue.get(guild.id);
    const songTittle = customQueue.songProperties[0].title;
    const song = customQueue.songs[0];

    serverQueue.connection
        .play(ytdl(song, { filter: 'audioonly', quality: 'highestaudio' }))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));

    // dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    // serverQueue.textChannel.send(`YAYAYA MUSICA TITO!!: ${song}`);

    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(songTittle)
        .setURL(song)
        .setAuthor(customQueue.songProperties[0].author)
        .setThumbnail(customQueue.songProperties[0].image)
    serverQueue.textChannel.send(exampleEmbed);

}
