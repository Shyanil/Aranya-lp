export async function submitLead(fields, formSource) {
  const params = new URLSearchParams(window.location.search);
  const tracking = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].map(key => [key, params.get(key) || '']));
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...fields, ...tracking, form_source: formSource, source_url: window.location.href }),
  });
  if (!response.ok) throw new Error('Unable to send your enquiry. Please try again.');
}
