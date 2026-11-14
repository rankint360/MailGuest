import assert from 'node:assert/strict';

const api = 'https://api.tempmail.lol/v2';
const subject = 'MailGuest delivery check';
const body = 'MailGuest received the replacement provider test.';
const sender = process.argv[2]?.trim().toLowerCase();

if (!sender || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) {
  console.error('Usage: node verify-delivery.mjs sender@example.com');
  process.exit(2);
}

async function request(path, options = {}) {
  const response = await fetch(api + path, {
    ...options,
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) throw new Error('TempMail API returned HTTP ' + response.status);
  return response.json();
}

async function verify() {
  const {address, token} = await request('/inbox/create', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: '{}'
  });
  assert.ok(address && token, 'The provider did not return an inbox');
  console.log('Send a plain-text email to ' + address);
  console.log('Subject: ' + subject);
  console.log('Body: ' + body);
  const deadline = Date.now() + 5 * 60 * 1000;
  let received = 0;
  while (Date.now() < deadline) {
    const {emails, expired} = await request('/inbox?' + new URLSearchParams({token}));
    assert.ok(!expired && Array.isArray(emails), 'Inbox expired or returned an invalid response');
    for (const email of emails) {
      const from = String(email.from ?? '').trim().toLowerCase();
      if (from !== sender && !from.endsWith('<' + sender + '>')) continue;
      received++;
      if (email.subject === subject && email.body?.trim() === body) {
        console.log('PASS: external sender, subject, and plain-text body matched');
        return;
      }
      console.log('Payload fields: plain-text=' + (typeof email.body === 'string' && email.body.trim().length > 0) + ', HTML=' + (typeof email.html === 'string' && email.html.trim().length > 0));
      console.log('Sender matched. Subject matched: ' + (email.subject === subject) +
        '. Body matched: ' + (email.body?.trim() === body) + '.');
    }
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
  throw new Error('No matching test message within five minutes. Messages from expected sender: ' + received);
}

verify().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
