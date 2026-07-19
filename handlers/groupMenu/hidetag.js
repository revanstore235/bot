const { setting } = require('../../setting.js');
const { botIsAdmin, isCooldown } = require('../../utils/helper.js');

async function hidetag(sock, msg, args) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const groupId = msg.key.remoteJid;
        
        if (!groupId.endsWith('@g.us')) {
            return sock.sendMessage(groupId, { text: setting.messages.groupOnly, quoted: msg });
        }
        
        const cd = isCooldown(sender, 'hidetag');
        if (cd) {
            return sock.sendMessage(groupId, { text: setting.messages.cooldown(cd), quoted: msg });
        }
        
        const metadata = await sock.groupMetadata(groupId);
        
        if (!botIsAdmin(sock, metadata)) {
            return sock.sendMessage(groupId, { text: setting.messages.botNotAdmin, quoted: msg });
        }
        
        const mentions = metadata.participants.map(p => p.id);
        const text = args.join(' ') || '👥 *HIDETAG*\n\nSemua member telah dipanggil! 📢';
        
        await sock.sendMessage(groupId, { text, mentions, quoted: msg });
        console.log(`✅ Hidetag di grup ${metadata.subject}`);
    } catch (error) {
        console.error('❌ Error hidetag:', error.message);
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Gagal hidetag: ' + error.message, quoted: msg });
    }
}

module.exports = { hidetag };