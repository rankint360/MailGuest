const byId = id => document.getElementById(id);
const buttons = ['copy', 'new', 'delete', 'refresh'].map(byId);
const key = 'relaybox-mailbox-v2';
let mailbox;
let changing = false;
let refreshing;

async function api(operation, params = {}) {
  const query = new URLSearchParams({f: operation, ...params, t: Date.now()});
  const response = await fetch('https://api.guerrillamail.com/ajax.php?' + query, {
    credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error('Mail request failed');
  return response.json();
}

function plainText(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.textContent.trim();
}

function status(message) { byId('status').textContent = message; }
function display() {
  byId('address').value = mailbox?.address || '';
  byId('address').placeholder = changing ? 'Preparing your address…' : 'No active address';
  updateTimer();
  buttons.forEach(button => button.disabled = changing || (button.id !== 'new' && !mailbox));
}
function save(value) {
  mailbox = value;
  try {
    if (value) sessionStorage.setItem(key, JSON.stringify(value));
    else sessionStorage.removeItem(key);
  } catch {}
  display();
}
function empty(title, detail) {
  const box = document.createElement('div');
  box.className = 'empty';
  const icon = document.createElement('i');
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '✉';
  const heading = document.createElement('b');
  heading.textContent = title;
  const description = document.createElement('p');
  description.textContent = detail;
  box.append(icon, heading, description);
  byId('messages').replaceChildren(box);
  byId('count').textContent = '0';
}
async function change(create) {
  if (changing) return;
  changing = true;
  display();
  status(create ? 'Creating address…' : 'Removing address…');
  let next;
  try {
    if (create) {
      const account = await api('get_email_address');
      if (!account.email_addr || !account.sid_token) throw new Error('No address available');
      next = {address: account.email_addr, token: account.sid_token, expires: account.email_timestamp * 1000 + 3600000};
    }
    if (byId('reader').open) byId('reader').close();
    save(next);
    empty(next ? 'Your inbox is empty' : 'No active address', next ? 'Waiting for incoming mail.' : 'Create an address to receive messages.');
    status(next ? 'Address ready' : 'Address removed');
  } catch {
    status(create ? 'Could not create an address. Try again.' : 'Could not remove this address. Try again.');
    if (!mailbox) {
      byId('address').placeholder = 'No active address';
      empty('No active address', 'Use New address to try again.');
    }
  } finally {
    changing = false;
    display();
    if (next && mailbox === next) refresh();
  }
}
let activeRead = 0;
async function readMessage(account, id) {
  const dialog = byId('reader');
  byId('subject').textContent = 'Loading message…';
  byId('sender').textContent = '';
  byId('body').textContent = '';
  const request = ++activeRead;
  dialog.showModal();
  try {
    const message = await api('fetch_email', {sid_token: account.token, email_id: id});
    if (mailbox !== account || !dialog.open || request !== activeRead) return;
    if (!message.mail_id) throw new Error('Message unavailable');
    byId('subject').textContent = plainText(message.mail_subject || '') || '(No subject)';
    byId('sender').textContent = message.mail_from || '';
    byId('body').textContent = plainText(message.mail_body || '') || '(Empty message)';
  } catch {
    if (dialog.open && request === activeRead) byId('subject').textContent = 'Could not load this message';
  }
}
async function refresh(manual = false) {
  if (!mailbox || changing || refreshing === mailbox) return;
  const account = mailbox;
  refreshing = account;
  if (manual) status('Checking mail…');
  try {
    if (Date.now() >= account.expires) throw Object.assign(new Error('Address expired'), {expired: true});
    const result = await api('get_email_list', {sid_token: account.token, offset: '0'});
    if (mailbox !== account || changing) return;
    if (result.email !== account.address) throw Object.assign(new Error('Session expired'), {expired: true});
    if (result.sid_token && result.sid_token !== account.token) {
      account.token = result.sid_token;
      save(account);
    }
    const messages = result.list;
    const focused = document.activeElement?.dataset.messageId;
    if (!messages.length) empty('Your inbox is empty', 'Waiting for incoming mail.');
    else {
      byId('count').textContent = result.count ?? messages.length;
      byId('messages').replaceChildren(...messages.map(message => {
        const row = document.createElement('button');
        row.className = 'message';
        row.dataset.messageId = message.mail_id;
        const summary = document.createElement('span');
        summary.textContent = (message.mail_from || 'Unknown sender') + ' · ' + (plainText(message.mail_subject || '') || '(No subject)');
        const received = document.createElement('time');
        const date = new Date(Number(message.mail_timestamp) * 1000);
        received.dateTime = date.toISOString();
        received.textContent = date.toLocaleString(undefined, {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
        row.append(summary, received);
        row.onclick = () => readMessage(account, message.mail_id);
        return row;
      }));
      if (focused) [...byId('messages').children].find(row => row.dataset.messageId === focused)?.focus({preventScroll: true});
    }
    if (manual || byId('status').textContent.startsWith('Inbox unavailable')) status('Inbox up to date');
  } catch (error) {
    if (mailbox !== account || changing) return;
    if (error.expired) {
      if (byId('reader').open) byId('reader').close();
      save(undefined);
      empty('Address expired', 'Create a new address to receive mail.');
      status('Address expired');
      return;
    }
    status('Inbox unavailable. Try refreshing or creating a new address.');
  } finally { if (refreshing === account) refreshing = undefined; }
}

function updateTimer() {
  const seconds = mailbox ? Math.max(0, Math.ceil((mailbox.expires - Date.now()) / 1000)) : 0;
  const value = Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  byId('timer').textContent = mailbox ? value + ' left' : '';
}

byId('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(mailbox.address); status('Address copied'); }
  catch { byId('address').select(); status('Address selected. Press Ctrl+C or ⌘C to copy.'); }
};
byId('new').onclick = () => { if (!mailbox || confirm('Switch to a new address?')) change(true); };
byId('delete').onclick = () => { if (confirm('Remove this address from MailGuest?')) change(false); };
byId('refresh').onclick = () => refresh(true);
byId('close').onclick = () => byId('reader').close();

try { mailbox = JSON.parse(sessionStorage.getItem(key)); } catch {}
display();
if (mailbox) {
  empty('Checking your inbox', 'Looking for incoming mail.');
  refresh();
} else {
  empty('Preparing your inbox', 'Creating a temporary email address.');
  change(true);
}
setInterval(() => {
  updateTimer();
  if (mailbox && Date.now() >= mailbox.expires) refresh();
}, 1000);
setInterval(() => { if (!document.hidden) refresh(); }, 15000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
});