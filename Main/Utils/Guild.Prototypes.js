const { Client, Collection, GuildMember, Guild, MessageEmbed, TextChannel } = require('discord.js');

/*
* Sunucu içerisinde bulunan prototypelar
* İşe yarayanlar kıpss 
*/

Guild.prototype.rolBul = function(content) {
    let rol = this.roles.cache.find(r => r.name === content) || this.roles.cache.find(r => r.id === content)
    if(!rol) return client.logger.log(`${content} rolünü ${this.name} sunucusun da aradım fakat bulamadım.`,"error");
    return rol;
}

Guild.prototype.kanalBul = function(content) {
    let kanal = this.channels.cache.find(k => k.name === content) || this.channels.cache.find(k => k.id === content)
    if(!kanal) return client.logger.log(`${content} kanalını ${this.name} sunucusun da aradım fakat bulamadım.`,"error");
    return kanal;

}

Guild.prototype.emojiGöster = function(content) {
    let emoji = this.emojis.cache.find(e => e.name === content) || this.emojis.cache.find(e => e.id === content) || this.client.emojis.cache.find(e => e.id === content) || this.client.emojis.cache.find(e => e.name === content)
    if(!emoji) return client.logger.log(`${content} emojisi ${this.name} sunucusuna yüklenmediğinden kullanılamadı.`,"error");
    return emoji;
}


Collection.prototype.array = function () {
    return [...this.values()]
  }