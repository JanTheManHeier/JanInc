const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!user || !pass) return null;
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        requireTLS: true,
        auth: { user, pass },
        tls: { ciphers: 'SSLv3' },
    });
    return transporter;
}

async function sendMail({ to, cc, subject, text, html }) {
    const tx = getTransporter();
    if (!tx) {
        return { ok: false, reason: 'SMTP not configured (missing SMTP_USER / SMTP_PASS)' };
    }
    const from = process.env.SMTP_FROM || `Jans agent <${process.env.SMTP_USER}>`;
    try {
        const info = await tx.sendMail({ from, to, cc, subject, text, html });
        return { ok: true, messageId: info.messageId };
    } catch (err) {
        return { ok: false, reason: err.message };
    }
}

module.exports = { sendMail };
