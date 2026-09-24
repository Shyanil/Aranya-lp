const { handleLead } = require('../../lib/leads.cjs');

exports.handler = async (event) => handleLead(event.httpMethod,
  event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body);
