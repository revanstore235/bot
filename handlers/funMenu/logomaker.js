const axios = require('axios');
const { setting } = require('../../setting.js');
const { isCooldown } = require('../../utils/helper.js');

async function logomaker(sock, msg, args) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const chatId = msg.key.remoteJid;
        
        const cd = isCooldown(sender, 'logo');
        if (cd) {
            return sock.sendMessage(chatId, { text: setting.messages.cooldown(cd), quoted: msg });
        }
        
        const text = args.join(' ');
        if (!text) {
            return sock.sendMessage(chatId, { text: '❌ Masukkan teks untuk logo!\nCara: !logo [teks]', quoted: msg });
        }

        await sock.sendMessage(chatId, { text: `⏳ Sedang membuat logo untuk "${text}"...`, quoted: msg });

        try {
            const response = await axios.get(`https://api.ikyyxd.my.id/image/logo?text=${encodeURIComponent(text)}`, {
                responseType: 'arraybuffer'
            });
            
            const buffer = Buffer.from(response.data);
            
            await sock.sendMessage(chatId, {
                image: buffer,
                caption: `✅ *LOGO BERHASIL DIBUAT!*\n\n📝 Teks: ${text}\n📱 ${setting.botName}`,
                quoted: msg
            });
            console.log(`✅ Logo ${text} berhasil dibuat`);
        } catch (apiError) {
            console.error('API Error:', apiError.message);
            await sock.sendMessage(chatId, { 
                text: `❌ Gagal membuat logo untuk *${text}*\nCoba lagi nanti.`,
                quoted: msg
            });
        }
    } catch (error) {
        console.error('❌ Error logo:', error.message);
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Terjadi error saat membuat logo.', quoted: msg });
    }
}

module.exports = { logomaker };