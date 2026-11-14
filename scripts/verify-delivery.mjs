import {spawnSync} from 'node:child_process';
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

function normalize(value) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function htmlText(html) {
  if (!normalize(html)) return '';
  const parser = `
import sys
from html.parser import HTMLParser

class MessageText(HTMLParser):
    hidden = 0
    parts = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "head", "template"):
            self.hidden += 1
        elif not self.hidden and tag in ("br", "p", "div", "li", "tr"):
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "head", "template") and self.hidden:
            self.hidden -= 1
        elif not self.hidden and tag in ("p", "div", "li", "tr"):
            self.parts.append(" ")

    def handle_data(self, data):
        if not self.hidden:
            self.parts.append(data)

parser = MessageText()
parser.feed(sys.stdin.read())
parser.close()
sys.stdout.write("".join(parser.parts))
`;
  const result = spawnSync('python', ['-X', 'utf8', '-c', parser], {input: html, encoding: 'utf8'});
  if (result.error || result.status !== 0) throw new Error('HTML verification requires Python 3 on PATH');
  return normalize(result.stdout);
}

function matchesBody(text) {
  return text === body || text.startsWith(body + ' ');
}

async function verify() {
  const {address, token} = await request('/inbox/create', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: '{}'
  });
  assert.ok(address && token, 'The provider did not return an inbox');
  console.log('Send an email to ' + address);
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
      const plainMatches = matchesBody(normalize(email.body));
      const htmlMatches = !plainMatches && matchesBody(htmlText(email.html));
      if (email.subject === subject && (plainMatches || htmlMatches)) {
        console.log('PASS: external sender, subject, and ' + (plainMatches ? 'plain-text' : 'HTML') + ' body matched');
        return;
      }
      console.log('Payload fields: plain-text=' + (typeof email.body === 'string' && email.body.trim().length > 0) + ', HTML=' + (typeof email.html === 'string' && email.html.trim().length > 0));
      console.log('Sender matched. Subject matched: ' + (email.subject === subject) +
        '. Body matched: ' + (plainMatches || htmlMatches) + '.');
    }
    await new Promise(resolve => setTimeout(resolve, 15000));
  }
  throw new Error('No matching test message within five minutes. Messages from expected sender: ' + received);
}

verify().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
