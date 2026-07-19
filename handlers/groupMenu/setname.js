const { setting } = require('../../setting.js');
const { getParticipant, botIsAdmin, isCooldown } = require('../../utils/helper.js');

async function setname(sock, msg, args) {
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
        
        const newName = args.join(' ');
        if (!newName) {
            return sock.sendMessage(groupId, { text: '❌ Masukkan nama baru!\nCara: !setname Nama grup baru', quoted: msg });
        }
        
        await sock.groupUpdateSubject(groupId, newName);
        await sock.sendMessage(groupId, {
            text: `✅ *NAMA GRUP DIUBAH!*\n\n📛 Nama baru: ${newName}`,
            quoted: msg
        });
        console.log(`✅ Nama grup diubah menjadi ${newName}`);
    } catch (error) {
        console.error('❌ Error setname:', error.message);
    }
}

module.exports = { setname };