function kolkataTimestamp(now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).map(({ type, value }) => [type, value]));
  const date = `${parts.day}/${parts.month}/${parts.year}`;
  const time = `${parts.hour}:${parts.minute}:${parts.second}`;
  return { date, time, submitted_at: `${date} ${time}`, timezone: 'Asia/Kolkata' };
}

async function handleLead(method, body, { webhookUrl = process.env.PABBLY_WEBHOOK_URL, fetchImpl = fetch, now = new Date() } = {}) {
  const reply = (statusCode, data) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(data) });
  if (method !== 'POST') return reply(405, { error: 'Method not allowed' });
  if (new TextEncoder().encode(body || '').byteLength > 16384) return reply(413, { error: 'Submission too large' });
  let input;
  try { input = JSON.parse(body); } catch { return reply(400, { error: 'Invalid JSON' }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(400, { error: 'Invalid submission' });
  const keys = ['name', 'phone', 'email', 'pincode', 'interest', 'message', 'form_source', 'source_url', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const lead = Object.fromEntries(keys.map(key => [key, typeof input[key] === 'string' ? input[key].trim() : '']));
  if (!lead.name || !/^\+?[\d\s-]{7,}$/.test(lead.phone) || (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) || (lead.pincode && !/^\d{6}$/.test(lead.pincode)) || !['main_enquiry', 'coming_soon'].includes(lead.form_source)) {
    return reply(400, { error: 'Please check your form details' });
  }
  if (!webhookUrl) return reply(503, { error: 'Enquiries are temporarily unavailable' });
  try {
    const response = await fetchImpl(webhookUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, ...kolkataTimestamp(now) }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Webhook rejected');
    return reply(200, { success: true });
  } catch {
    return reply(502, { error: 'Unable to send your enquiry. Please try again.' });
  }
}

module.exports = { handleLead, kolkataTimestamp };
