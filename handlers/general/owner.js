const { setting } = require('../../setting.js');

async function owner(sock, msg) {
    try {
        const chatId = msg.key.remoteJid;
        await sock.sendMessage(chatId, {
            text: `👨‍💻 *Owner Bot*\n\n📱 Nomor: ${setting.ownerNumber.split('@')[0]}\n💬 Hubungi untuk lapor bug atau request fitur.`,
            quoted: msg
        });
    } catch (error) {
        console.error('❌ Error owner:', error.message);
    }
}

module.exports = { owner };