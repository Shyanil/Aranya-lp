const { test } = require('node:test');
const assert = require('node:assert/strict');
const { handleLead, kolkataTimestamp } = require('../lib/leads.cjs');

test('Kolkata timestamp rolls over the day and year with dd/mm/yy and 12-hour AM/PM time', () => {
  assert.deepEqual(kolkataTimestamp(new Date('2026-12-31T20:35:07Z')), {
    date: '01/01/27', time: '02:05:07 AM', submitted_at: '01/01/27 02:05:07 AM', timezone: 'Asia/Kolkata',
  });
});

test('Kolkata midnight uses 12 AM', () => {
  assert.equal(kolkataTimestamp(new Date('2026-09-24T18:30:00Z')).time, '12:00:00 AM');
});

for (const form_source of ['main_enquiry', 'coming_soon']) {
  test(`${form_source} forwards fields and server-generated time`, async () => {
    const result = await handleLead('POST', JSON.stringify({
      name: ' Test Lead ', phone: '9999999999', email: 'test@example.com', pincode: '781001',
      interest: '2bhk', message: 'Test', form_source, utm_source: 'test', source_url: 'https://example.com/',
      submitted_at: 'untrusted', unexpected: 'ignored',
    }), {
      webhookUrl: 'https://example.com/webhook', now: new Date('2026-09-24T06:30:00Z'),
      fetchImpl: async (url, options) => {
        assert.equal(url, 'https://example.com/webhook');
        assert.equal(options.method, 'POST');
        const payload = JSON.parse(options.body);
        assert.equal(payload.name, 'Test Lead');
        assert.equal(payload.form_source, form_source);
        assert.equal(payload.submitted_at, '24/09/26 12:00:00 PM');
        assert.equal(payload.time, '12:00:00 PM');
        assert.equal(payload.phone, '9999999999');
        assert.equal(payload.interest, '2bhk');
        assert.equal(payload.utm_source, 'test');
        assert.equal(payload.pincode, '781001');
        assert.equal(payload.unexpected, undefined);
        return { ok: true };
      },
    });
    assert.equal(result.statusCode, 200);
  });
}

test('normalizes +91 phone numbers to 10 digits before the webhook', async () => {
  const result = await handleLead('POST', JSON.stringify({
    name: 'Test', phone: '+91 98765 43210', form_source: 'coming_soon', interest: '3bhk',
  }), {
    webhookUrl: 'https://example.com/webhook', now: new Date('2026-09-24T06:30:00Z'),
    fetchImpl: async (_url, options) => {
      const payload = JSON.parse(options.body);
      assert.equal(payload.phone, '9876543210');
      assert.equal(payload.interest, '3bhk');
      return { ok: true };
    },
  });
  assert.equal(result.statusCode, 200);
});

test('invalid requests never reach the webhook', async () => {
  const options = { fetchImpl: () => assert.fail('Unexpected webhook call') };
  assert.equal((await handleLead('GET', '', options)).statusCode, 405);
  assert.equal((await handleLead('POST', '{', options)).statusCode, 400);
  assert.equal((await handleLead('POST', 'null', options)).statusCode, 400);
  assert.equal((await handleLead('POST', '{}', options)).statusCode, 400);
  assert.equal((await handleLead('POST', 'x'.repeat(16385), options)).statusCode, 413);
});

test('rejects short and oversized phone numbers before forwarding', async () => {
  for (const phone of ['987654321', '98765432101', '9198765432101']) {
    const result = await handleLead('POST', JSON.stringify({
      name: 'Test', phone, form_source: 'coming_soon', interest: '2bhk',
    }), { webhookUrl: 'https://example.com/webhook', fetchImpl: () => assert.fail('Unexpected webhook call') });
    assert.equal(result.statusCode, 400);
  }
});

test('missing configuration and webhook failures do not report success', async () => {
  const body = JSON.stringify({ name: 'Test', phone: '9999999999', form_source: 'coming_soon' });
  assert.equal((await handleLead('POST', body, { webhookUrl: '' })).statusCode, 503);
  assert.equal((await handleLead('POST', body, { webhookUrl: 'https://example.com', fetchImpl: async () => ({ ok: false }) })).statusCode, 502);
  assert.equal((await handleLead('POST', body, { webhookUrl: 'https://example.com', fetchImpl: async () => { throw new Error('timeout'); } })).statusCode, 502);
});
