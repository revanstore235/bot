const { setting } = require('../../setting.js');

async function menu(sock, msg) {
    try {
        const chatId = msg.key.remoteJid;
        const text =
`📋 *MENU ${setting.botName}*

━━━━━━━━━━━━━━━━━━━━
🔹 *GENERAL*
${setting.prefix}ping - Test koneksi
${setting.prefix}info - Info bot
${setting.prefix}owner - Info owner
${setting.prefix}menu - Menu ini

━━━━━━━━━━━━━━━━━━━━
🎮 *FUN MENU*
${setting.prefix}stalk [username] - Stalk Roblox
${setting.prefix}stalkepep [uid] - Stalk Epep
${setting.prefix}logo [teks] - Buat logo

━━━━━━━━━━━━━━━━━━━━
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
    } catch (error) {
        console.error('❌ Error menu:', error.message);
    }
}

module.exports = { menu };