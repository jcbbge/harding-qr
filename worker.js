export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (request.method === 'GET') {
      if (key) {
        const value = await env.MY_KV.get(key);
        return new Response(value || 'Key not found', { status: value ? 200 : 404 });
      }
      return new Response('Please provide a key', { status: 400 });
    }

    if (request.method === 'POST') {
      if (key) {
        const value = await request.text();
        await env.MY_KV.put(key, value);
        return new Response('Value stored successfully', { status: 200 });
      }
      return new Response('Please provide a key', { status: 400 });
    }

    return new Response('Method not allowed', { status: 405 });
  },
};
