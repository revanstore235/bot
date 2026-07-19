const { setting } = require('../../setting.js');

async function leave(sock, msg) {
    try {
        const groupId = msg.key.remoteJid;
        
        if (!groupId.endsWith('@g.us')) {
            return sock.sendMessage(groupId, { text: setting.messages.groupOnly, quoted: msg });
        }
        
        await sock.sendMessage(groupId, { text: '👋 Bot keluar dari grup ini. Bye bye!', quoted: msg });
        await sock.groupLeave(groupId);
        console.log(`✅ Bot keluar dari grup`);
    } catch (error) {
        console.error('❌ Error leave:', error.message);
    }
}

module.exports = { leave };