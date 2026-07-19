const { setting } = require('../../setting.js');
const { getParticipant, botIsAdmin, isCooldown } = require('../../utils/helper.js');

async function kick(sock, msg, args) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const groupId = msg.key.remoteJid;
        
        if (!groupId.endsWith('@g.us')) {
            return sock.sendMessage(groupId, { text: setting.messages.groupOnly, quoted: msg });
        }
        
        const metadata = await sock.groupMetadata(groupId);
        const senderInfo = getParticipant(metadata, sender);
        
        if (!senderInfo?.admin) {
            return sock.sendMessage(groupId, { text: setting.messages.adminOnly, quoted: msg });
        }
        
        if (!botIsAdmin(sock, metadata)) {
            return sock.sendMessage(groupId, { text: setting.messages.botNotAdmin, quoted: msg });
        }
        
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        const mentioned = contextInfo?.mentionedJid || [];
        let target;
        
        if (mentioned.length > 0) {
            target = mentioned[0];
        } else if (contextInfo?.quotedMessage) {
            target = contextInfo.participant;
        }
        
        if (!target) {
            return sock.sendMessage(groupId, { text: setting.messages.noTarget, quoted: msg });
        }
        
        if (target === sender) {
            return sock.sendMessage(groupId, { text: setting.messages.cantKickSelf, quoted: msg });
        }
        
        if (target === setting.ownerNumber) {
            return sock.sendMessage(groupId, { text: setting.messages.cantKickOwner, quoted: msg });
        }
        
        const cd = isCooldown(sender, 'kick');
        if (cd) {
            return sock.sendMessage(groupId, { text: setting.messages.cooldown(cd), quoted: msg });
        }
        
        await sock.groupParticipantsUpdate(groupId, [target], 'remove');
        await sock.sendMessage(groupId, {
            text: setting.messages.kicked(target),
            mentions: [target],
            quoted: msg
        });
        console.log(`✅ Kick @${target.split('@')[0]} dari ${metadata.subject}`);
    } catch (error) {
        console.error('❌ Error kick:', error.message);
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Gagal kick: ' + error.message, quoted: msg });
    }
}

module.exports = { kick };