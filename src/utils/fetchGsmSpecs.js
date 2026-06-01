/**
 * Fetch GSMArena specs via local dev API (Vite plugin).
 */
export async function fetchGsmSpecs({ name, brand, href }) {
  const endpoint = href ? '/api/gsmarena/product' : '/api/gsmarena/fetch';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, brand, href }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export function applyGsmDataToForm(prev, gsm) {
  const next = { ...prev };

  if (gsm.specs) next.specs = gsm.specs;
  if (gsm.fullSpecs && Object.keys(gsm.fullSpecs).length) next.fullSpecs = gsm.fullSpecs;
  if (gsm.gsmLink) next.gsmLink = gsm.gsmLink;
  if (gsm.gsmarenaName && !next.name?.trim()) next.name = gsm.gsmarenaName;
  if (gsm.image && (!next.image || !next.image.trim())) next.image = gsm.image;

  return next;
}
