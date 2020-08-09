
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
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
        bot.commands.get(command).execute(msg);
    } catch (error) {
        console.error(error);
        msg.reply('Hubo un error ejecutando tu comando papito ):');
    }

});