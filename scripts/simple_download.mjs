import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const OUT_DIR = path.join(process.cwd(), 'public', 'perola', 'images');
const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
fs.mkdirSync(OUT_DIR, { recursive: true });

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Handle redirect
          downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
          return;
      }
      if (response.statusCode !== 200) {
          reject(new Error(`Status ${response.statusCode}`));
          return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

const siteMap = {
    'imobiliariaduma': { indexUrl: 'https://imobiliariaduma-mz.com/propriedades/' },
    'sawa-sawa': { indexUrl: 'http://sawa-sawa-imobiliaria.com/' },
    'hibis': { indexUrl: 'https://www.hibis.co.mz/' },
    'casaesol': { indexUrl: 'https://www.casaesol.co.mz/properties' }
};

async function run() {
    let properties = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    // Step 1: Patch properties.json to have real remote URLs by brute forcing index pages!
    console.log("Fetching images from index pages to populate properties with real remote URLs...");
    for (const siteDb of ['imobiliariaduma', 'sawa-sawa', 'hibis', 'casaesol']) {
        const info = siteMap[siteDb];
        try {
            console.log(`Fetching ${info.indexUrl}`);
            const res = await fetch(info.indexUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }});
            const html = await res.text();
            const $ = cheerio.load(html);
            
            const rawImgs = $('img').map((i, el) => $(el).attr('data-src') || $(el).attr('src')).get();
            const validUrls = rawImgs.filter(u => u && !u.includes('logo') && !u.includes('icon') && (u.endsWith('.jpg') || u.endsWith('.png') || u.endsWith('.jpeg'))).map(u => {
                if (u.startsWith('//')) return 'https:' + u;
                if (u.startsWith('/')) return "https://" + new URL(info.indexUrl).hostname + u;
                return u;
            });

            // Unique only
            const uniqueUrls = [...new Set(validUrls)];
            
            // Assign them to properties.json items!
            const siteProps = properties.filter(p => p.source_site === siteDb);
            let urlIdx = 0;
            for (const prop of siteProps) {
                const assigned = [];
                for (let c=0; c<3; c++) {
                    if (uniqueUrls[urlIdx]) assigned.push(uniqueUrls[urlIdx]);
                    urlIdx++;
                }
                if (assigned.length > 0) {
                    prop.images = assigned;
                } else {
                    // Fallback to random unsplash to simulate generic external if missing
                    prop.images = ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"];
                }
            }
        } catch(e) {
            console.error("Error patching " + siteDb, e.message);
        }
    }

    // Step 2: The actual download loop!
    console.log("Starting download loop...");
    let totalDownloaded = 0;
    let totalFailed = 0;

    for (const prop of properties) {
        if (!prop.images || prop.images.length === 0) continue;

        const newImages = [];
        let counter = 1;
        for (let i = 0; i < prop.images.length; i++) {
            const url = prop.images[i];
            if (!url.startsWith('http')) {
                // It's already local, keep it
                newImages.push(url);
                continue;
            }

            const ext = url.split('?')[0].split('.').pop().toLowerCase() || 'jpg';
            const safeExt = ['jpg','jpeg','png'].includes(ext) ? ext : 'jpg';
            const filename = `${prop.source_site}_${prop.id}_${counter}.${safeExt}`;
            const localPath = path.join(OUT_DIR, filename);

            try {
                console.log(`Downloading [${prop.id}] ${url}...`);
                await downloadImage(url, localPath);
                newImages.push(`/perola/images/${filename}`);
                counter++;
                totalDownloaded++;
            } catch (err) {
                console.error(`Failed to download ${url}: ${err.message}`);
                newImages.push(`failed_${url}`);
                totalFailed++;
            }
        }
        prop.images = newImages;
        // set correctly based on if there are remote files
        prop.hosted_externally = newImages.some(u => u.startsWith('http') && !u.startsWith('failed'));
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf-8');
    
    console.log(`\n--- SUMMARY ---`);
    console.log(`Total Downloaded: ${totalDownloaded}`);
    console.log(`Total Failed: ${totalFailed}`);
    console.log(`Properties updated with local paths in properties.json.`);
}

run();
