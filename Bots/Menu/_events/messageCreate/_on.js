const { Message } = require("discord.js");

 /**
 * @param {Message} message 
 */

module.exports = async (message) => { 
      if (!global.sistem.BOT.Prefixs.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(global.sistem.BOT.Prefixs.some(x => x.length)).split(" ");
    let komutcuklar = args[0].toLocaleLowerCase()
    let cowase = message.client;
    args = args.splice(1);
    let calistirici;
    
    if(cowase.commands.has(komutcuklar) || cowase.aliases.has(komutcuklar)) {
          calistirici = cowase.commands.get(komutcuklar) || cowase.aliases.get(komutcuklar);
          if(calistirici) calistirici.onRequest(cowase, message, args);
    } 

};

module.exports.config = {
    Event: "messageCreate"
};
