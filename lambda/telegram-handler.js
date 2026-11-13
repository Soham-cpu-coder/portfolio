/**
 * AWS LAMBDA FUNCTION: Telegram Notification Dispatcher
 * Runtime: Node.js 18.x or 20.x (Native fetch enabled, zero npm dependencies needed)
 *
 * Environment Variables required in AWS Lambda Console:
 * - TELEGRAM_BOT_TOKEN: e.g. "123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
 * - TELEGRAM_CHAT_ID: e.g. "987654321"
 * - ALLOWED_ORIGIN: e.g. "https://soham-mali.vercel.app" or "*" (for testing)
 */

exports.handler = async (event) => {
  // Configured allowed origin (or allow all if set to '*')
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

  // Common CORS headers for Function URL
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // 1. Handle CORS Preflight request
  const httpMethod = event.requestContext?.http?.method || event.httpMethod;
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST
  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // 2. Read environment variables (with your configured defaults)
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '9268893507:AAHNuOAicRlnXuJTuKKV97mJ7CCR-lBRyEA';
  const chatId = process.env.TELEGRAM_CHAT_ID || '1994600280';

  if (!botToken || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in environment variables.');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server configuration error' })
    };
  }

  try {
    // 3. Parse request body
    let data = {};
    if (event.body) {
      data = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }

    const { name, email, message, timestamp, referrer } = data;

    // Validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Name, email, and message are required.' })
      };
    }

    // 4. Extract client metadata
    const headers = event.headers || {};
    const clientIp = headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                     event.requestContext?.http?.sourceIp || 
                     'Unknown IP';
    const country = headers['cloudfront-viewer-country-name'] || 
                    headers['cloudfront-viewer-country'] || 
                    headers['x-country'] || 
                    'N/A';
    const city = headers['cloudfront-viewer-city'] || 'N/A';
    const timeFormatted = timestamp ? new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST' : new Date().toLocaleString();

    // 5. Construct Telegram HTML Message
    const escapeHtml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const telegramMessage = `
🚀 <b>New Portfolio Message Received!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>From:</b> ${escapeHtml(name)}
✉️ <b>Email:</b> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
🕒 <b>Time:</b> ${escapeHtml(timeFormatted)}
📍 <b>Location:</b> ${escapeHtml(city)}, ${escapeHtml(country)} (IP: ${escapeHtml(clientIp)})
🔗 <b>Referrer:</b> ${escapeHtml(referrer || 'Direct')}
━━━━━━━━━━━━━━━━━━━━
💬 <b>Message:</b>
${escapeHtml(message)}
    `.trim();

    // 6. Send to Telegram Bot API using native fetch
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
      console.error('Telegram API error:', result);
      return {
        statusCode: 502,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to deliver to Telegram', details: result.description })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: 'Message successfully sent to Telegram!' })
    };

  } catch (err) {
    console.error('Lambda handler execution error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
