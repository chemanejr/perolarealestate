import fs from 'fs';

const sites = [
  { name: 'duma', url: 'https://imobiliariaduma-mz.com/propriedades/' },
  { name: 'sawa', url: 'http://sawa-sawa-imobiliaria.com/' },
  { name: 'hibis', url: 'https://www.hibis.co.mz/' },
  { name: 'casaesol', url: 'https://www.casaesol.co.mz/properties' },
];

(async () => {
  for (const site of sites) {
    try {
      console.log(`Fetching ${site.name}...`);
      const res = await fetch(site.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      const html = await res.text();
      fs.writeFileSync(`scripts/${site.name}.html`, html);
      console.log(`Saved scripts/${site.name}.html`);
    } catch(err) {
      console.error(`Error on ${site.name}:`, err.message);
    }
  }
})();
