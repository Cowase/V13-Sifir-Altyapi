const {MessageEmbed, Message} = require('discord.js')

class genEmbed extends MessageEmbed {
    constructor(...opt) {
        super(opt)
        let guild = client.guilds.cache.get(global.sistem.SERVER.ID)
        if(guild) {
            this.setAuthor({name: guild.name, iconURL: guild.iconURL({dynamic: true})})
            this.setColor("RANDOM")
        } else {
            this.setColor("RANDOM")
        }
    }
}

module.exports = { genEmbed }