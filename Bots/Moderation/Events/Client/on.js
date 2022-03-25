const { Message } = require("discord.js");

 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
      if (!global.sistem.BOT.Prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.BOT.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let sehira = message.client;
    args = args.splice(1);
    let calistirici;
    
    if(sehira.commands.has(komutcuklar) || sehira.aliases.has(komutcuklar)) {
          calistirici = sehira.commands.get(komutcuklar) || sehira.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(sehira, message, args);
    } 

};

module.exports.config = {
    Event: "messageCreate"
};
