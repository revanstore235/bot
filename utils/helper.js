const { setting } = require('../setting.js');

const cooldowns = new Map();

function normalizeJid(jid = '') {
    return jid.split(':')[0] + '@s.whatsapp.net';
}

function getParticipant(metadata, jid) {
    const id = normalizeJid(jid);
    return metadata.participants.find(p => normalizeJid(p.id) === id);
}

function botIsAdmin(sock, metadata) {
    const botId = normalizeJid(sock.authState.creds.me?.id || '');
    return metadata.participants.some(
        p => normalizeJid(p.id) === botId && (p.admin === 'admin' || p.admin === 'superadmin')
    );
}

function isCooldown(userId, command) {
    const key = `${userId}-${command}`;
    const now = Date.now();
    const cooldownTime = setting.cooldowns[command] || 3;
    if (cooldowns.has(key)) {
        const end = cooldowns.get(key);
        if (now < end) return Math.ceil((end - now) / 1000);
    }
    cooldowns.set(key, now + (cooldownTime * 1000));
    return false;
}

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (h > 0) parts.push(`${h}j`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
}

module.exports = {
    cooldowns,
    normalizeJid,
    getParticipant,
    botIsAdmin,
    isCooldown,
    formatUptime
};
