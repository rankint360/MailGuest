const byId = id => document.getElementById(id);
const buttons = ['copy', 'new', 'delete', 'refresh'].map(byId);
const key = 'mailguest-mailbox-v3';
let mailbox;
let changing = false;
let refreshing;

async function api(operation, token) {
  const response = await fetch('/api/' + operation, {
    method: 'POST',
    headers: token ? {'X-Mailbox-Token': token} : {},
    cache: 'no-store',
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error('Mail request failed');
  return response.json();
}

function plainText(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script,style,head,template').forEach(node => node.remove());
  template.content.querySelectorAll('br,p,div,li,tr,td').forEach(node => node.after('\n'));
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
      const account = await api('address');
      if (!account.address || !account.token) throw new Error('No address available');
      next = {address: account.address, token: account.token, expires: Date.now() + 3600000, messages: []};
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
function readMessage(message) {
  byId('subject').textContent = message.subject || '(No subject)';
  byId('sender').textContent = message.from || '';
  byId('body').textContent = message.body?.trim() || plainText(message.html || '') || '(Empty message)';
  byId('reader').showModal();
}
async function refresh(manual = false) {
  if (!mailbox || changing || refreshing === mailbox) return;
  const account = mailbox;
  refreshing = account;
  if (manual) status('Checking mail…');
  try {
    if (Date.now() >= account.expires) throw Object.assign(new Error('Address expired'), {expired: true});
    const result = await api('inbox', account.token);
    if (mailbox !== account) return;
    if (result.expired) throw Object.assign(new Error('Session expired'), {expired: true});
    if (!Array.isArray(result.emails)) throw new Error('Invalid inbox response');
    if (result.emails.length) {
      account.messages = [...result.emails.reverse(), ...account.messages];
      try { sessionStorage.setItem(key, JSON.stringify(account)); } catch {}
    }
    if (changing) return;
    const messages = account.messages;
    const focused = document.activeElement?.dataset.messageId;
    if (!messages.length) empty('Your inbox is empty', 'Waiting for incoming mail.');
    else {
      byId('count').textContent = messages.length;
      byId('messages').replaceChildren(...messages.map((message, index) => {
        const row = document.createElement('button');
        row.className = 'message';
        row.dataset.messageId = String(messages.length - index);
        const summary = document.createElement('span');
        summary.textContent = (message.from || 'Unknown sender') + ' · ' + (message.subject || '(No subject)');
        const received = document.createElement('time');
        const date = new Date(message.date);
        received.dateTime = date.toISOString();
        received.textContent = date.toLocaleString(undefined, {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
        row.append(summary, received);
        row.onclick = () => readMessage(message);
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
