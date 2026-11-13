/**
 * VERCEL SERVERLESS FUNCTION: /api/contact
 * CommonJS format ensures 100% compatibility across all Node runtimes on Vercel.
 */

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed (Expected POST)' });
  }

  // Parse Body safely
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { name, email, message, timestamp, referrer } = body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in Name, Email, and Message.' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res.status(500).json({
      error: 'Environment variables missing: Please ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set in Vercel Settings.'
    });
  }

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.socket?.remoteAddress || 
                   'Unknown IP';
  const timeFormatted = timestamp ? new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST' : new Date().toLocaleString();

  const escapeHtml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const telegramMessage = `
🚀 <b>New Portfolio Message!</b>
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
      console.error('Telegram API rejected message:', result);
      return res.status(502).json({
        error: `Telegram Error: ${result.description} (Code ${result.error_code})`
      });
    }

    return res.status(200).json({ success: true, message: 'Message sent to Telegram!' });

  } catch (err) {
    console.error('Fetch execution error:', err);
    return res.status(500).json({ error: `Server dispatch failed: ${err.message}` });
  }
};
