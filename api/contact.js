/**
 * VERCEL SERVERLESS FUNCTION: /api/contact
 * Works automatically when hosted on Vercel!
 *
 * Add these 2 Environment Variables in your Vercel Project Settings:
 * 1. TELEGRAM_BOT_TOKEN
 * 2. TELEGRAM_CHAT_ID
 */

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, timestamp, referrer } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({
      error: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables are missing.'
    });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'Unknown IP';
  const timeFormatted = timestamp ? new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST' : new Date().toLocaleString();

  const escapeHtml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const telegramMessage = `
🚀 <b>New Portfolio Message Received!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>From:</b> ${escapeHtml(name)}
✉️ <b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
🕒 <b>Time:</b> ${escapeHtml(timeFormatted)}
📍 <b>IP:</b> ${escapeHtml(clientIp)}
🔗 <b>Referrer:</b> ${escapeHtml(referrer || 'Direct')}
━━━━━━━━━━━━━━━━━━━━
💬 <b>Message:</b>
${escapeHtml(message)}
  `.trim();

  try {
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const result = await response.json();

    if (!result.ok) {
      return res.status(502).json({ error: 'Telegram delivery failed', details: result.description });
    }

    return res.status(200).json({ success: true, message: 'Delivered to Telegram!' });
  } catch (err) {
    console.error('Telegram dispatch error:', err);
    return res.status(500).json({ error: 'Failed to dispatch message to Telegram.' });
  }
}
