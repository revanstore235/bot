const { setting } = require('../../setting.js');
const { isCooldown, formatUptime } = require('../../utils/helper.js');

async function info(sock, msg) {
    try {
        const sender = msg.key.participant || msg.key.remoteJid;
        const chatId = msg.key.remoteJid;
        const cd = isCooldown(sender, 'info');
        if (cd) {
            return sock.sendMessage(chatId, { text: setting.messages.cooldown(cd), quoted: msg });
        }
        const uptime = formatUptime(process.uptime());
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const botId = sock.authState.creds.me?.id || 'Unknown';

        const text =
`🤖 *${setting.botName}*

━━━━━━━━━━━━━━━━━━━━
📛 *Nama:* ${setting.botName}
🔢 *Versi:* ${setting.version}
👨‍💻 *Developer:* ${setting.ownerName}
📱 *Owner:* ${setting.ownerNumber.split('@')[0]}
🤖 *Bot:* ${botId.split('@')[0]}
⏰ *Uptime:* ${uptime}
💾 *Memory:* ${memory} MB
📡 *Status:* ✅ Online

━━━━━━━━━━━━━━━━━━━━
📋 *COMMANDS:*

🔹 *GENERAL*
${setting.prefix}ping - Test bot
${setting.prefix}info - Info bot
${setting.prefix}owner - Info owner
${setting.prefix}menu - Menu lengkap

🎮 *FUN MENU*
${setting.prefix}stalk [username] - Stalk Roblox
${setting.prefix}stalkepep [uid] - Stalk Epep
${setting.prefix}logo [teks] - Buat logo

👥 *GRUP (Admin)*
${setting.prefix}hidetag - Mention semua
${setting.prefix}kick @user - Kick member
${setting.prefix}add @user - Tambah member
${setting.prefix}setdesc [teks] - Ganti deskripsi
${setting.prefix}setname [nama] - Ganti nama grup
${setting.prefix}leave - Keluar grup

━━━━━━━━━━━━━━━━━━━━
_Made with ❤️ by ${setting.ownerName}_`;

        await sock.sendMessage(chatId, { text, quoted: msg });
        console.log(`✅ Info sent to ${chatId}`);
    } catch (error) {
        console.error('❌ Error info:', error.message);
    }
}

module.exports = { info };