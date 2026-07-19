const { setting } = require('../../setting.js');
const { getParticipant, botIsAdmin, isCooldown } = require('../../utils/helper.js');

async function add(sock, msg, args) {
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
        
        const contextInfo = msg.message?.extendedTextMessage?.contextInfo;
        const mentioned = contextInfo?.mentionedJid || [];
        let target;
        
        if (mentioned.length > 0) {
            target = mentioned[0];
        } else if (contextInfo?.quotedMessage) {
            target = contextInfo.participant;
        }
        
        if (!target) {
            return sock.sendMessage(groupId, { text: '❌ Tag user yang mau di-add!\nCara: !add @user', quoted: msg });
        }
        
        try {
            // ===== COBA TAMBAHIN LANGSUNG =====
            await sock.groupParticipantsUpdate(groupId, [target], 'add');
            await sock.sendMessage(groupId, {
                text: `✅ *ADDED!*\n\n@${target.split('@')[0]} telah ditambahkan ke grup!`,
                mentions: [target],
                quoted: msg
            });
            console.log(`✅ Add @${target.split('@')[0]} ke ${metadata.subject}`);
            
        } catch (addError) {
            // ===== KALO GAGAL, KIRIM LINK GRUP =====
            console.log('⚠️ Gagal add langsung, kirim link grup...');
            
            try {
                const inviteCode = await sock.groupInviteCode(groupId);
                const link = `https://chat.whatsapp.com/${inviteCode}`;
                
                await sock.sendMessage(groupId, {
                    text: `❌ Gagal menambahkan @${target.split('@')[0]} secara langsung.\n\n` +
                        `📎 *Link Undangan Grup:*\n${link}\n\n` +
                        `📝 Kirim link ini ke @${target.split('@')[0]} untuk bergabung.`,
                    mentions: [target],
                    quoted: msg
                });
                console.log(`✅ Link grup dikirim untuk @${target.split('@')[0]}`);
                
            } catch (linkError) {
                await sock.sendMessage(groupId, {
                    text: `❌ Gagal menambahkan @${target.split('@')[0]} dan gagal membuat link undangan.\n` +
                        `Pastikan bot adalah admin dan coba lagi.`,
                    mentions: [target],
                    quoted: msg
                });
                console.error('❌ Error link:', linkError.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Error add:', error.message);
        await sock.sendMessage(msg.key.remoteJid, { 
            text: '❌ Terjadi error: ' + error.message,
            quoted: msg 
        });
    }
}

module.exports = { add };