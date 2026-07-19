const { setting } = require('../../setting.js');
const { getParticipant, botIsAdmin, isCooldown } = require('../../utils/helper.js');

async function setdesc(sock, msg, args) {
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
        
        const newDesc = args.join(' ');
        if (!newDesc) {
            return sock.sendMessage(groupId, { text: '❌ Masukkan deskripsi baru!\nCara: !setdesc Deskripsi baru', quoted: msg });
        }
        
        await sock.groupUpdateDescription(groupId, newDesc);
        await sock.sendMessage(groupId, {
            text: `✅ *DESKRIPSI DIUBAH!*\n\n📝 Deskripsi baru: ${newDesc}`,
            quoted: msg
        });
        console.log(`✅ Deskripsi grup ${metadata.subject} diubah`);
    } catch (error) {
        console.error('❌ Error setdesc:', error.message);
    }
}

module.exports = { setdesc };