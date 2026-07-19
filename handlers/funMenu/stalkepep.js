const axios = require('axios');
const { setting } = require('../../setting.js');
const { isCooldown } = require('../../utils/helper.js');

async function stalkepep(sock, msg, args) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const chatId = msg.key.remoteJid;
        
        const cd = isCooldown(sender, 'stalkepep');
        if (cd) {
            return sock.sendMessage(chatId, { text: setting.messages.cooldown(cd), quoted: msg });
        }
        
        const uid = args.join(' ');
        if (!uid) {
            return sock.sendMessage(chatId, { text: '❌ Masukkan UID Epep!\nCara: !stalkepep [uid]', quoted: msg });
        }

        await sock.sendMessage(chatId, { text: `⏳ Sedang mencari data UID ${uid}...`, quoted: msg });

        try {
            const response = await axios.get(`https://api.ikyyxd.my.id/stalk/epepid?uid=${encodeURIComponent(uid)}`);
            const data = response.data;

            if (data.status === 200 && data.result) {
                const user = data.result;
                const text =
`🎮 *STALK EPEP*

━━━━━━━━━━━━━━━━━━━━
👤 *Username:* ${user.username || 'Tidak diketahui'}
🆔 *UID:* ${user.uid || 'Tidak diketahui'}
📊 *Level:* ${user.level || '0'}
💎 *Diamond:* ${user.diamond || '0'}
💰 *Gold:* ${user.gold || '0'}
🏆 *Prestige:* ${user.prestige || '0'}`;

                await sock.sendMessage(chatId, { text, quoted: msg });
                console.log(`✅ Stalk Epep ${uid} berhasil`);
            } else {
                await sock.sendMessage(chatId, { text: `❌ Tidak ditemukan akun Epep dengan UID *${uid}*`, quoted: msg });
            }
        } catch (apiError) {
            console.error('API Error:', apiError.message);
            await sock.sendMessage(chatId, { 
                text: `❌ Gagal mengambil data Epep untuk UID *${uid}*\nCoba lagi nanti.`,
                quoted: msg
            });
        }
    } catch (error) {
        console.error('❌ Error stalkepep:', error.message);
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Terjadi error saat men-stalk.', quoted: msg });
    }
}

module.exports = { stalkepep };