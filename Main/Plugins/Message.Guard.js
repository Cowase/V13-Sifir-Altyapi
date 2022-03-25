const {MessageEmbed} = require('discord.js')
const usersMap = new Map();
const getLimit = new Map();
const LIMIT = 3;
const TIME = 10000;
const DIFF = 1000;
const _contentSwears =  ["amcık","orospu","piç","sikerim","sikik","amına","pezevenk","yavşak","ananı","anandır","orospu","evladı","göt","pipi","sokuk","yarrak","oç","o ç","siktir","bacını","karını","amk","aq","sik","amq","anaskm","AMK","YARRAK","sıkerım"];
const _contentAds = ["http://","https://","cdn.discordapp.com","discordapp.com","discord.app", "discord.gg","discordapp","discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az"]
const _invRegExp = new RegExp(/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i);

/**
 * @param  {Client} client  
 * @param  {object} options
 * @return {Thetis} this
*/

module.exports = async function (client, options) { 

    let kufurEngelcik = (options && options.Swears) || true
    let reklamEngelcik = (options && options.Ads) || true
    let spamEngelcik = (options && options.Spams) || true
    let capsEngelcik = (options &&options.Caps) || true
    let uzunMesaj = (options && options.lengthMessages) || true
    let uzunMesajUzunlugu = (options && options.messageSize) || 150
    let muteRolü = (options && options.mutedRole)
    let izinliRoller = (options && options.allowedRoles) || [];
    let izinliKanallar = (options && options.allowedChannels) || [];
    let izinliÜyeler = (options && options.allowedMembers) || [];
    

    /**
    * @param {Client} client 
    */

    
    client.on("messageCreate", async (message) => {
        if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
        if(message.member.permissions.has('ADMINISTRATOR') && message.member.permissions.has('BAN_MEMBERS')) return;
        if(izinliRoller && izinliRoller.some(x => message.member.roles.cache.has(x))) return;
        if(izinliKanallar && izinliKanallar.some(x => message.channel.id == x)) return;
        if(izinliÜyeler && izinliÜyeler.some(x => message.member.id == x)) return;

        if(kufurEngelcik && _contentSwears.some(word => message.content.toLowerCase().includes(word))) return checkWarn(message, "küfür etmekten")
        if(uzunMesaj && message.content && message.content.length >= uzunMesajUzunlugu)  return checkWarn(message, "uzun mesaj atmaktan")
        const Caps = (message.content.match(/[A-ZĞÇÖIÜ]/gm) || []).length;
        if (capsEngelcik && (Caps / message.content.length) >= 0.7) return checkWarn(message, "Caps-Lock kullanmaktan")
        if (reklamEngelcik && message.content.match(_invRegExp)) {
            const invites = await message.guild.invites.fetch();
            if ((message.guild.vanityURLCode && message.content.match(_invRegExp).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(_invRegExp).some((i) => i === x))) return;
            return checkWarn(message, "sunucu reklamı yapmaktan")
        }
        if(reklamEngelcik && _contentAds.some(word => message.content.toLowerCase().includes(word))) return  sendChat(message, "bağlantı paylaşmaktan")


    })

    client.on("messageUpdate", async (oldMessage, newMessage) => {
        let message = newMessage
        if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
        if(message.member.permissions.has('ADMINISTRATOR') && message.member.permissions.has('BAN_MEMBERS')) return;
        if(izinliRoller && izinliRoller.some(x => message.member.roles.cache.has(x))) return;
        if(izinliKanallar && izinliKanallar.some(x => message.channel.id == x)) return;
        if(izinliÜyeler && izinliÜyeler.some(x => message.member.id == x)) return;

        if(kufurEngelcik && _contentSwears.some(word => message.content.toLowerCase().includes(word))) return checkWarn(message, "küfür etmekten")
        if(uzunMesaj && message.content && message.content.length >= uzunMesajUzunlugu)  return checkWarn(message, "uzun mesaj atmaktan")
        const Caps = (message.content.match(/[A-ZĞÇÖIÜ]/gm) || []).length;
        if (capsEngelcik && (Caps / message.content.length) >= 0.7) return checkWarn(message, "Caps-Lock kullanmaktan")
        if (reklamEngelcik && message.content.match(_invRegExp)) {
            const invites = await message.guild.invites.fetch();
            if ((message.guild.vanityURLCode && message.content.match(_invRegExp).some((i) => i === message.guild.vanityURLCode)) || invites.some((x) => message.content.match(_invRegExp).some((i) => i === x))) return;
            return checkWarn(message, "sunucu reklamı yapmaktan")
        }
        if(reklamEngelcik && _contentAds.some(word => message.content.toLowerCase().includes(word))) return  sendChat(message, "bağlantı paylaşmaktan")


    })

        client.on("messageCreate", async (message) => {
            if(!spamEngelcik) return;
            if(message.webhookID || message.author.bot || message.channel.type === "dm") return;
            if(message.member.permissions.has('ADMINISTRATOR') && message.member.permissions.has('BAN_MEMBERS')) return;
            if(izinliRoller && izinliRoller.some(x => message.member.roles.cache.has(x))) return;
            if(izinliKanallar && izinliKanallar.some(x => message.channel.id == x)) return;
            if(izinliÜyeler && izinliÜyeler.some(x => message.member.id == x)) return;
            if(usersMap.has(message.author.id)) {
                const userData = usersMap.get(message.author.id);
                const {lastMessage, timer} = userData;
                const difference = message.createdTimestamp - lastMessage.createdTimestamp;
                let msgCount = userData.msgCount;
                
                    if(difference > DIFF) {
                        clearTimeout(timer);
                        userData.msgCount = 1;
                        userData.lastMessage = message;
                            userData.timer = setTimeout(() => {
                                usersMap.delete(message.author.id);
                            }, TIME);
                        usersMap.set(message.author.id, userData)
                    } else {
                            msgCount++;
                            if(parseInt(msgCount) === LIMIT) {
                                lastMessageDeleted(message, 30)
                                usersMap.delete(message.author.id);
                                let embedsusturuldu = new MessageEmbed().setColor("RED")
                                if(muteRolü) {
                                    message.member.roles.add(muteRolü).catch(err => {})
                                    return message.channel.send({content: `${message.member}`, embeds: [embedsusturuldu.setDescription(`**Merhaba!** ${message.member.user.tag}
Sohbet kanalında flood atmaktan, **3 Dakika** susturuldun.
                    `)]}).then(x => {
                        setTimeout(() => {
                            x.delete().catch(err => {})
                        }, 10000);
                        setTimeout(() => {
                            let embedacildi = new MessageEmbed().setColor("GREEN")
                            message.member.roles.remove(muteRolü).catch(err => {})
                            message.channel.send({content: `${message.member}`, embeds: [embedacildi.setDescription(`**Merhaba!** ${message.member.user.tag}
Artık sohbet kanallarında konuşabilirsin.
Birdaha ceza yemek istemiyorsan yapmamalısın!`)]}).then(x => setTimeout(() => {
    x.delete().catch(err => {})
}, 10000))
                        }, 1000*60*3*1);
                    }) 
                                } else {
                                    let embedsusturuldu1 = new MessageEmbed().setColor("RED")
                                    return message.channel.send({content: `${message.member}`, embeds: [embedsusturuldu1.setDescription(`**Merhaba!** ${message.member.user.tag}
Sohbet kanalında flood atmaktan, vazgeçmelisin aksi taktirde sunucu moderatörleri seni cezalandıracak.`)]}).then(x => setTimeout(() => {
    x.delete().catch(err => {})
}, 10000))
                                }
                                
                                
                             } else {
                  userData.msgCount = msgCount;
                  usersMap.set(message.author.id, userData)
                }}}
                 else{
                let fn = setTimeout(() => {
                  usersMap.delete(message.author.id)
                }, TIME);
                usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
                
                })
                }
              
        })
        async function lastMessageDeleted(message, count = 25) {
            let messages = await message.channel.messages.fetch({ limit: 100 });
            let filtered = messages.filter((x) => x.author.id === message.author.id).array().splice(0, count);
            message.channel.bulkDelete(filtered).catch(err => {});
        } 
        
        async function checkWarn(message, content) {
            if (muteRolü && getLimit.get(message.author.id) == 3) {
                if(muteRolü && message.member.roles.cache.has(muteRolü)) return;
                message.delete().catch(err => {})
                getLimit.delete(message.member.id)
                let embedsusturuldu = new MessageEmbed().setColor("RED")
                message.member.roles.add(muteRolü).catch(err => {})
                return message.channel.send({content: `${message.member}`, embeds: [embedsusturuldu.setDescription(`**Merhaba!** ${message.member.user.tag}
Sohbet kanalında ${content}, **1 Dakika** susturuldun.`)]}).then(x => {
        setTimeout(() => {
            x.delete().catch(err => {})
        }, 10000);
        setTimeout(() => {
            let embedacildi = new MessageEmbed().setColor("GREEN")
            message.member.roles.remove(muteRolü).catch(err => {})
            message.channel.send({content: `${message.member}`, embeds: [embedacildi.setDescription(`**Merhaba!** ${message.member.user.tag}
Artık sohbet kanallarında konuşabilirsin.
Birdaha ceza yemek istemiyorsan yapmamalısın!`)]}).then(x => setTimeout(() => {
        x.delete().catch(err => {})
        }, 10000))
        }, 1000*60*1);
        })
            } else {
                if(muteRolü) getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) + 1)
                message.delete().catch(err => {})
                let embed = new MessageEmbed().setColor("RANDOM")
                message.channel.send({content: `${message.member}`, embeds: [embed.setDescription(`**Merhaba!** ${message.member.user.tag}
Sohbet kanalında ${content} vazgeç, aksi taktirde yaptırım uygulanacaktır.`)]}).then(x => {
                    setTimeout(() => {
                        x.delete().catch(err => {})
                    }, 10000);
                })
                    setTimeout(() => {
                       if(muteRolü) getLimit.set(`${message.member.id}`, (Number(getLimit.get(`${message.member.id}`) || 0)) - 1)
                    },10000)
                }
        }
}

