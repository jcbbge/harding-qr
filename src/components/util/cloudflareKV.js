const WORKER_URL = 'https://roleco-prd.jr-gantt.workers.dev';

export async function getKVValue(key) {
  const response = await fetch(`${WORKER_URL}?key=${encodeURIComponent(key)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch value from KV store');
  }
  return response.text();
}

export async function setKVValue(key, value) {
  const response = await fetch(`${WORKER_URL}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    body: value,
  });
  if (!response.ok) {
    throw new Error('Failed to set value in KV store');
  }
  return response.text();
}
