async function ping(sock, msg) {
    try {
        const start = Date.now();
        await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!', quoted: msg });
        const latency = Date.now() - start;
        await sock.sendMessage(msg.key.remoteJid, { text: `✅ Online!\n⏱️ ${latency}ms`, quoted: msg });
    } catch (error) {
        console.error('❌ Error ping:', error.message);
    }
}

module.exports = { ping };