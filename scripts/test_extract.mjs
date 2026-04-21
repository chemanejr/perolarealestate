import fs from 'fs';
import * as cheerio from 'cheerio';

const HTMLS = {
  duma: 'scripts/duma.html',
  sawa: 'scripts/sawa.html',
  hibis: 'scripts/hibis.html',
  casaesol: 'scripts/casaesol.html'
};

for (const [site, file] of Object.entries(HTMLS)) {
  const html = fs.readFileSync(file, 'utf-8');
  if (site === 'casaesol') {
    const match = html.match(/window\.__PRELOADED_STATE__ = (\{.*?\});/);
    if (match) {
      const data = JSON.parse(match[1]);
      console.log(`[casaesol] Found JSON, ${data.highlights.list.length} properties.`);
    }
  } else {
    const $ = cheerio.load(html);
    // Generic heuristic
    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && (href.includes('property') || href.includes('imovel') || href.includes('listing'))) {
        links.push(href);
      }
    });
    console.log(`[${site}] Found generic links:`, Array.from(new Set(links)).slice(0, 5));
  }
}
