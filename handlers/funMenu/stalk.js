const axios = require('axios');
const { setting } = require('../../setting.js');
const { isCooldown } = require('../../utils/helper.js');

async function stalk(sock, msg, args) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const chatId = msg.key.remoteJid;
        
        const cd = isCooldown(sender, 'stalk');
        if (cd) {
            return sock.sendMessage(chatId, { text: setting.messages.cooldown(cd), quoted: msg });
        }
        
        const username = args.join(' ');
        if (!username) {
            return sock.sendMessage(chatId, { text: '❌ Masukkan username Roblox!\nCara: !stalk [username]', quoted: msg });
        }

        await sock.sendMessage(chatId, { text: `⏳ Sedang mencari data ${username}...`, quoted: msg });

        try {
            const response = await axios.get(`https://api.ikyyxd.my.id/stalk/roblox?username=${encodeURIComponent(username)}`);
            const data = response.data;

            if (data.status === 200 && data.result && data.result.username) {
                const user = data.result;
                const text =
`🎮 *STALK ROBLOX*

━━━━━━━━━━━━━━━━━━━━
👤 *Username:* ${user.username || 'Tidak diketahui'}
🆔 *User ID:* ${user.userId || 'Tidak diketahui'}
📅 *Bergabung:* ${user.joinDate || 'Tidak diketahui'}
🕐 *Online:* ${user.isOnline ? '✅ Online' : '❌ Offline'}
🎨 *Display Name:* ${user.displayName || 'Tidak diketahui'}
👥 *Followers:* ${user.followers || '0'}
👤 *Following:* ${user.following || '0'}
📊 *Friends:* ${user.friends || '0'}

🔗 *Profile:* https://www.roblox.com/users/${user.userId}/profile`;

                await sock.sendMessage(chatId, { text, quoted: msg });
                console.log(`✅ Stalk ${username} berhasil`);
            } else {
                await sock.sendMessage(chatId, { text: `❌ Tidak ditemukan akun Roblox *${username}*`, quoted: msg });
            }
        } catch (apiError) {
            console.error('API Error:', apiError.message);
            await sock.sendMessage(chatId, { 
                text: `❌ Gagal mengambil data Roblox untuk *${username}*\nCoba lagi nanti.`,
                quoted: msg
            });
        }
    } catch (error) {
        console.error('❌ Error stalk:', error.message);
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Terjadi error saat men-stalk.', quoted: msg });
    }
}

module.exports = { stalk };