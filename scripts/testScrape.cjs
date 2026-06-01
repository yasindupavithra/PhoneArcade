const axios = require('axios');
const cheerio = require('cheerio');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.gsmarena.com/',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin'
};

async function getGSMArenaImage(productName) {
  try {
    const searchUrl = `https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(productName)}`;
    console.log('Fetching:', searchUrl);
    const searchRes = await axios.get(searchUrl, { headers });
    const $ = cheerio.load(searchRes.data);
    
    const firstLink = $('.makers ul li a').first().attr('href');
    if (!firstLink) {
        console.log(`No results for ${productName}`);
        return null;
    }
    
    const productUrl = `https://www.gsmarena.com/${firstLink}`;
    console.log('Found product link:', productUrl);
    const productRes = await axios.get(productUrl, { headers });
    const $p = cheerio.load(productRes.data);
    
    let imgUrl = $p('.specs-photo-main a img').attr('src');
    
    if (imgUrl) {
        return imgUrl;
    }
    return null;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (err.response) {
      console.error(err.response.status, err.response.statusText);
    }
    return null;
  }
}

getGSMArenaImage('Samsung Galaxy S24 Ultra').then(console.log);
