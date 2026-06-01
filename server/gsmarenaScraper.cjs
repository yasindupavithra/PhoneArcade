const axios = require('axios');
const cheerio = require('cheerio');

const BASE = 'https://www.gsmarena.com';

const headers = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.gsmarena.com/',
};

function cleanQuery(name) {
  return String(name || '')
    .replace(/\([^)]+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSpecTables($) {
  const fullSpecs = {};

  $('#specs-list table').each((_, table) => {
    let section = '';
    const lines = [];

    const flush = () => {
      if (section && lines.length) {
        fullSpecs[section] = lines.join('\n');
      }
      lines.length = 0;
    };

    $(table)
      .find('tr')
      .each((__, tr) => {
        const $tr = $(tr);
        const th = $tr.find('th').first();
        if (th.length) {
          flush();
          section = normalizeText(th.text());
          return;
        }

        const label = normalizeText($tr.find('td.ttl').text());
        let value = normalizeText($tr.find('td.nfo').text());
        if (!label || !value) return;

        lines.push(`${label}: ${value}`);
      });

    flush();
  });

  return fullSpecs;
}

function buildShortSpecs($) {
  const chipset = normalizeText($('[data-spec="chipset"]').text());
  const cpu = normalizeText($('[data-spec="cpu"]').text());
  const display =
    normalizeText($('[data-spec="displaysize"]').text()) +
    (normalizeText($('[data-spec="displayres"]').text())
      ? ` · ${normalizeText($('[data-spec="displayres"]').text())}`
      : '');
  const camera =
    normalizeText($('[data-spec="cam1modules"]').text()) ||
    normalizeText($('[data-spec="cam1mp"]').text());
  const battery = normalizeText($('[data-spec="batdescription1"]').text());
  const storage =
    normalizeText($('[data-spec="internalmemory"]').text()) ||
    normalizeText($('[data-spec="storage"]').text());

  return [chipset || cpu, display, camera, storage, battery].filter(Boolean).join(' • ');
}

async function fetchHtml(url) {
  const res = await axios.get(url, { headers, timeout: 25000 });
  return res.data;
}

/**
 * Search GSMArena by phone name.
 * @returns {Promise<Array<{ name: string, href: string, url: string, thumb?: string }>>}
 */
async function searchGsmarena(query) {
  const q = cleanQuery(query);
  if (!q) return [];

  const searchUrl = `${BASE}/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(q)}`;
  const html = await fetchHtml(searchUrl);
  const $ = cheerio.load(html);
  const results = [];

  $('.makers ul li').each((_, li) => {
    const $a = $(li).find('a').first();
    const href = $a.attr('href');
    if (!href) return;
    const name = normalizeText($a.find('strong span').text() || $a.text());
    const thumb = $(li).find('img').attr('src');
    results.push({
      name,
      href,
      url: `${BASE}/${href.replace(/^\//, '')}`,
      thumb: thumb ? (thumb.startsWith('http') ? thumb : `${BASE}/${thumb.replace(/^\//, '')}`) : undefined,
    });
  });

  return results.slice(0, 8);
}

/**
 * Fetch full specs from a GSMArena product page URL or relative href.
 */
async function fetchProductPage(hrefOrUrl) {
  const url = hrefOrUrl.startsWith('http')
    ? hrefOrUrl
    : `${BASE}/${hrefOrUrl.replace(/^\//, '')}`;

  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const fullSpecs = parseSpecTables($);
  const specs = buildShortSpecs($);
  const gsmarenaName = normalizeText($('.specs-phone-name-title').text());
  const image = $('.specs-photo-main a img').attr('src');
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${BASE}/${image.replace(/^\//, '')}`
    : null;

  return {
    gsmLink: url,
    gsmarenaName,
    fullSpecs,
    specs,
    image: imageUrl,
    specCount: Object.keys(fullSpecs).length,
  };
}

/**
 * Search + pick best match (first result) and load full specs.
 */
async function fetchFromGsmarena(query, { href } = {}) {
  if (href) {
    return fetchProductPage(href);
  }

  const q = cleanQuery(query);
  if (!q) {
    throw new Error('Enter a product name to search GSMArena.');
  }

  const candidates = await searchGsmarena(q);
  if (!candidates.length) {
    throw new Error(`No GSMArena results for "${q}". Try brand + model (e.g. Samsung Galaxy S24 Ultra).`);
  }

  if (candidates.length > 1) {
    return {
      needsPick: true,
      candidates,
      query: q,
    };
  }

  const picked = await fetchProductPage(candidates[0].href);
  return {
    needsPick: false,
    picked: candidates[0],
    ...picked,
  };
}

module.exports = {
  searchGsmarena,
  fetchProductPage,
  fetchFromGsmarena,
  cleanQuery,
};
