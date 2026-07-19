const { setting } = require('../setting.js');
const general = require('./general/index.js');
const funMenu = require('./funMenu/index.js');
const groupMenu = require('./groupMenu/index.js');

async function mainMenu(sock, msg) {
    try {
        const chatId = msg.key.remoteJid;

        let menuText = `📋 *MENU UTAMA ${setting.botName}*\n\n`;
        menuText += `━━━━━━━━━━━━━━━━━━━━\n`;
        menuText += `🔹 *GENERAL*\n`;

        const generalCommands = Object.keys(general);
        generalCommands.forEach(cmd => {
            const cmdName = cmd === 'ping' ? 'ping' :
                            cmd === 'info' ? 'info' :
                            cmd === 'owner' ? 'owner' :
                            cmd === 'menu' ? 'menu' : cmd;
            menuText += `${setting.prefix}${cmdName} - ${getCommandDesc(cmdName)}\n`;
        });

        menuText += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        menuText += `🎮 *FUN MENU*\n`;

        const funCommands = Object.keys(funMenu);
        funCommands.forEach(cmd => {
            const cmdName = cmd === 'stalk' ? 'stalk [username]' :
                            cmd === 'stalkepep' ? 'stalkepep [uid]' :
                            cmd === 'logomaker' ? 'logo [teks]' : cmd;
            menuText += `${setting.prefix}${cmdName} - ${getCommandDesc(cmd)}\n`;
        });

        menuText += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        menuText += `👥 *GRUP (Admin)*\n`;

        const groupCommands = Object.keys(groupMenu);
        groupCommands.forEach(cmd => {
            const cmdName = cmd === 'hidetag' ? 'hidetag' :
                            cmd === 'kick' ? 'kick @user' :
                            cmd === 'add' ? 'add @user' :
                            cmd === 'setdesc' ? 'setdesc [teks]' :
                            cmd === 'setname' ? 'setname [nama]' :
                            cmd === 'leave' ? 'leave' : cmd;
            menuText += `${setting.prefix}${cmdName} - ${getCommandDesc(cmd)}\n`;
        });

        menuText += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        menuText += `_Made with ❤️ by ${setting.ownerName}_`;

        await sock.sendMessage(chatId, { text: menuText, quoted: msg });
    } catch (error) {
        console.error('❌ Error mainMenu:', error.message);
    }
}

function getCommandDesc(command) {
    const desc = {
        ping: 'Test koneksi',
        info: 'Info bot',
        owner: 'Info owner',
        menu: 'Menu lengkap',
        stalk: 'Stalk Roblox',
        stalkepep: 'Stalk Epep',
        logomaker: 'Buat logo',
        hidetag: 'Mention semua',
        kick: 'Kick member',
        add: 'Tambah member',
        setdesc: 'Ganti deskripsi',
        setname: 'Ganti nama grup',
        leave: 'Keluar grup'
    };
    return desc[command] || 'Command';
}

module.exports = { mainMenu };