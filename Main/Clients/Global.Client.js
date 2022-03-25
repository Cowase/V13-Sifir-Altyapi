const { Client, Collection, Constants, Intents } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice')
const { bgBlue, black, green } = require("chalk");
global.sistem = global.system = require('../Settings/_system.json');
const DISCORD_LOGS = require('discord-logs')
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const fs = require('fs')
class COWASE extends Client {
    constructor (...options) {
        super({
            options,
            intents: [32767],
        });
        DISCORD_LOGS(this)
        Object.defineProperty(this, "location", { value: process.cwd() });
        this.sistem = this.system = require('../Settings/_system.json');
        this.emojiler = global.emojiler = require('../Settings/_emojis.json');
        this.botName;
        this.commands = new Collection()
        this.aliases = new Collection()
        this.setMaxListeners(10000)
        this.logger = require('../Utils/Console.Logger');
        require('../Utils/Global.Dates.World');
        require('../Utils/Guild.Prototypes');
        this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
        .on("disconnect", () => this.logger.log("Bot is disconnecting...", "disconnecting"))
        .on("reconnecting", () => this.logger.log("Bot reconnecting...", "reconnecting"))
        .on("error", (e) => this.logger.log(e, "error"))
        .on("warn", (info) => this.logger.log(info, "warn"));
        
       // process.on("unhandledRejection", (err) => { this.logger.log(err, "caution") });
        process.on("warning", (warn) => { this.logger.log(warn, "varn") });
        process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
        process.on("uncaughtException", err => {
            const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                console.error("Beklenmedik Hata: ", hata);
               // process.exit(1);
        });
  }
  async fetchCommands(active = true) {
    if(!active) return;
    let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
    this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${dirs.length} category in client loaded.`, "category");
    dirs.forEach(dir => {
        let files = fs.readdirSync(`../../Bots/${this.botName}/_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} ${files.length} commands loaded in ${dir} category.`, "load");
        files.forEach(file => {
            let referans = require(`../../Bots/${this.botName}/_commands/${dir}/${file}`);
            if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
            this.commands.set(referans.Isim, referans);
            if (referans.Komut) referans.Komut.forEach(alias => this.aliases.set(alias, referans));
        });
    });
  }
  async fetchEvents(active = true) {
    if(!active) return;
    let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
    dirs.forEach(dir => {
        let files = fs.readdirSync(`../../Bots/${this.botName}/_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
        files.forEach(file => {
            let referans = require(`../../Bots/${this.botName}/_events/${dir}/${file}`);
            this.on(referans.config.Event, referans);
        });
    });
 }

 connect(token) {
    if(!token) {
        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Tokeni girilmediğinden dolayı bot kapanıyor...`,"error");
        process.exit()
        return;
    }
    this.login(token).then(acar => {
        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} BOT kullanıma aktif edilmiştir.`,"botReady")
        this.user.setPresence({ activities: [{name: global.sistem.BOT.Text}], status: global.sistem.BOT.Status })
        this.on("ready", async () => {
            let kanal = this.channels.cache.get(sistem.BOT.VoiceChannelID)
            if(kanal) joinVoiceChannel({ channelId: kanal.id, guildId: kanal.guild.id, adapterCreator: kanal.guild.voiceAdapterCreator});
        })


    }).catch(acar => {
        this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} Botun tokeni doğrulanamadı. 5 Saniye sonra tekrardan denenecektir...`,"reconnecting")
        setTimeout(() => {
            this.login().catch(acar => {
                this.logger.log(`${black.bgHex('#D9A384')(this.botName.toUpperCase())} => Bot tokeni tamamiyle doğrulanamadı.. Bot kapanıyor...`,"error")
                process.exit()
            })
        }, 5000 )
    })
}
}

module.exports = { COWASE }