import leads from '../lib/leads.cjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/leads') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: 'POST' } });
    }
    let body = '';
    if (request.body) {
      const reader = request.body.getReader();
      const decoder = new TextDecoder();
      let size = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 16384) {
          await reader.cancel();
          return Response.json({ error: 'Submission too large' }, { status: 413 });
        }
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
    }
    const result = await leads.handleLead(request.method, body, { webhookUrl: env.PABBLY_WEBHOOK_URL || '' });
    return new Response(result.body, { status: result.statusCode, headers: result.headers });
  },
};
