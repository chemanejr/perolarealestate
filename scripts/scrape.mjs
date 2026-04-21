import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import * as cheerio from 'cheerio';

const OUT_DIR = path.join(process.cwd(), 'public', 'perola', 'images');
const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
const LOG_FILE = path.join(process.cwd(), 'scripts', 'log.txt');
fs.mkdirSync(OUT_DIR, { recursive: true });

function log(msg) {
  fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function downloadImage(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    await pipeline(res.body, fs.createWriteStream(dest));
    return true;
  } catch (err) {
    return false;
  }
}

function convertPrice(priceStr) {
  if (!priceStr || priceStr.toLowerCase().includes('consultar')) return priceStr || '';
  const re = /(?:\d{1,3}(?:[.,]\d{3})*|\d+)/g;
  let matches = [...priceStr.matchAll(re)];
  if (matches.length === 0) return priceStr;
  let newStr = priceStr;
  for (const match of matches.reverse()) {
    const origStr = match[0];
    const plainNum = parseInt(origStr.replace(/[.,]/g, ''), 10);
    if (isNaN(plainNum)) continue;
    const addedNum = Math.round(plainNum * 1.05);
    const formatted = addedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    newStr = newStr.substring(0, match.index) + formatted + newStr.substring(match.index + origStr.length);
  }
  return newStr;
}

const properties = [];
let gId = 1;

async function fetchHtml(url) {
  log('Fetching ' + url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  return res.text();
}

async function scrapeCasaesol() {
  try {
    const html = await fetchHtml('https://www.casaesol.co.mz/properties');
    const match = html.match(/window\.__PRELOADED_STATE__ = (\{.*?\});/);
    if (!match) throw new Error("Could not find PRELOADED_STATE");
    const json = JSON.parse(match[1]);
    const items = json.highlights.list.slice(0, 6);
    let counter = 1;
    for (const item of items) {
      const images = [];
      if (item.MAINPHOTO) images.push(item.MAINPHOTO);
      const original_price = `${item.MAINPURPOSE_PRICE} ${item.MAINPURPOSE_COIN}`;
      const final_price = convertPrice(original_price);
      const localImages = [];
      for (let i = 0; i < images.length; i++) {
        const ext = images[i].split('.').pop() || 'jpg';
        const filename = `casaesol_${counter}_${i+1}.${ext}`;
        const localPath = path.join(OUT_DIR, filename);
        if (await downloadImage(images[i], localPath)) localImages.push(`/perola/images/${filename}`);
        else localImages.push(images[i]);
      }
      properties.push({
        id: gId++, source_site: 'casaesol', title: item.Note || `Property ${item.PROPERTYID}`,
        original_price, price: final_price, location: `${item.LOCATIONTHIRDLEVEL}, ${item.LOCATIONSECONDLEVEL}`,
        type: item.Type || 'House', bedrooms: item.Bedrooms?.toString() || '', bathrooms: item.BathRooms?.toString() || '',
        description: item.Description || '', images: localImages, hosted_externally: localImages.some(u => u.startsWith('http'))
      });
      counter++;
    }
    log('Done Casaesol ' + properties.length);
  } catch (e) { log('Error Casaesol ' + e.message); }
}

async function genericScrape(siteName, indexUrl, propertySelector, getDetailsFn) {
  try {
    const html = await fetchHtml(indexUrl);
    const $ = cheerio.load(html);
    const links = [];
    $(propertySelector).each((i, el) => {
        let href = $(el).attr('href');
        if (href && !links.includes(href)) links.push(href);
    });
    const propLinks = links.slice(0, 6);
    log(`Found ${propLinks.length} links for ${siteName}`);
    let counter = 1;
    for (const link of propLinks) {
       const fullLink = link.startsWith('http') ? link : new URL(link, indexUrl).href;
       const phtml = await fetchHtml(fullLink);
       const p$ = cheerio.load(phtml);
       const details = getDetailsFn(p$, fullLink);
       const final_price = convertPrice(details.price);
       const localImages = [];
       for (let i = 0; i < details.images.length; i++) {
          const u = details.images[i];
          const ext = 'jpg';
          const filename = `${siteName}_${counter}_${i+1}.${ext}`;
          const localPath = path.join(OUT_DIR, filename);
          if (await downloadImage(u, localPath)) localImages.push(`/perola/images/${filename}`);
          else localImages.push(u);
       }
       properties.push({
          id: gId++, source_site: siteName, title: details.title, original_price: details.price,
          price: final_price, location: details.location, type: details.type, bedrooms: details.bedrooms,
          bathrooms: details.bathrooms, description: details.description, images: localImages,
          hosted_externally: localImages.some(u => u.startsWith('http'))
       });
       counter++;
    }
  } catch (e) { log(`Error Generic Scrape ${siteName}: ` + e.message + '\n' + e.stack); }
}

async function scrapeDuma() {
  await genericScrape('duma', 'https://imobiliariaduma-mz.com/propriedades/', '.property-title a, a.btn-primary', ($, url) => {
     return {
       title: $('h1').text().trim(),
       price: $('.price').first().text().replace(/\n/g, '').trim() || 'Consultar',
       location: $('.property-address, .location').text().trim() || 'Maputo',
       type: 'Moradia / Apartamento',
       bedrooms: $('.bedrooms, .property-meta-bed').text().replace(/\D/g,'') || '',
       bathrooms: $('.bathrooms, .property-meta-bath').text().replace(/\D/g,'') || '',
       description: $('.content-area p').text().trim() || $('article.property').text().slice(0, 200).trim(),
       images: [$('meta[property="og:image"]').attr('content')].filter(Boolean)
     };
  });
}

async function scrapeSawa() {
  await genericScrape('sawa', 'http://sawa-sawa-imobiliaria.com/', '.tm-property-title a, article.property a', ($, url) => {
     return {
       title: $('h1').text().trim() || $('title').text().replace('- Sawa Sawa Imobiliaria', '').trim(),
       price: $('.tm-property-price').text().trim() || 'Consultar',
       location: 'Maputo',
       type: 'Moradia / Apartamento',
       bedrooms: '', bathrooms: '',
       description: $('.tm-property-details').text().trim() || '',
       images: [$('meta[property="og:image"]').attr('content')].filter(Boolean)
     };
  });
}

async function scrapeHibis() {
  await genericScrape('hibis', 'https://www.hibis.co.mz/', 'a[href*="/imovel"], a.property-link', ($, url) => {
     return {
       title: $('h1').text().trim() || $('title').text().trim(),
       price: $('.price, .property-price').text().trim() || 'Consultar',
       location: $('.location, .address').text().trim() || 'Maputo',
       type: 'Imóvel', bedrooms: '', bathrooms: '',
       description: $('.description, .details').text().trim() || '',
       images: [$('meta[property="og:image"]').attr('content')].filter(Boolean)
     };
  });
}

(async () => {
   try {
     fs.writeFileSync(LOG_FILE, 'Starting scrape...\n');
     await scrapeCasaesol();
     await scrapeDuma();
     await scrapeSawa();
     await scrapeHibis();
     fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2));
     log(`Saved ${properties.length} properties to ${DATA_FILE}`);
   } catch(e) {
     log('Fatal: ' + e.message);
   }
})();
