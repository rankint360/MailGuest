import assets from './assets.js';

const upstream = 'https://api.tempmail.lol/v2';
const noStore = {'Cache-Control': 'no-store'};

export default {
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (!path.startsWith('/api/')) {
      const asset = Object.hasOwn(assets, path) ? assets[path] : null;
      if (!asset) return new Response('Page not found', {status: 404});
      return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.data), c => c.charCodeAt(0)), {
        headers: {'Content-Type': asset.type, 'X-Content-Type-Options': 'nosniff'}
      });
    }
    if (request.method !== 'POST') return new Response(null, {status: 405, headers: {Allow: 'POST'}});
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) return new Response(null, {status: 403});
    let endpoint;
    let options;
    if (path === '/api/address') {
      endpoint = '/inbox/create';
      options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: '{}'};
    } else if (path === '/api/inbox') {
      const token = request.headers.get('X-Mailbox-Token');
      if (!token || token.length > 512) return new Response(null, {status: 400});
      endpoint = '/inbox?' + new URLSearchParams({token});
    } else {
      return new Response(null, {status: 404});
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(upstream + endpoint, {...options, redirect: 'manual', signal: controller.signal});
      if (!response.ok) console.warn("Mail provider HTTP status", path, response.status);
      if (!response.ok) return new Response(null, {status: response.status === 429 ? 429 : 502, headers: noStore});
      return Response.json(await response.json(), {headers: noStore});
    } catch (error) {
      console.error('Mail provider request failed', path, error.name);
      return new Response(null, {status: 502, headers: noStore});
    } finally {
      clearTimeout(timeout);
    }
  }
};

