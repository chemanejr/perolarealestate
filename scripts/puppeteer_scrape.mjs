import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';

puppeteer.use(StealthPlugin());

const OUT_DIR = path.join(process.cwd(), 'public', 'perola', 'images');
const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
const LOG_FILE = path.join(process.cwd(), 'scripts', 'puppeteer_log.txt');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(LOG_FILE, 'Starting Puppeteer Scrape...\n', 'utf8');

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + '\n', 'utf8');
}

async function downloadImageContent(page, imageUrl, destPath) {
    try {
        const base64 = await page.evaluate(async (url) => {
            try {
                const resp = await fetch(url);
                if (!resp.ok) return null;
                const blob = await resp.blob();
                return await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                return null;
            }
        }, imageUrl);
        
        if (base64) {
            const data = base64.replace(/^data:image\/\w+;base64,/, "");
            const buf = Buffer.from(data, 'base64');
            fs.writeFileSync(destPath, buf);
            return true;
        }
        return false;
    } catch(e) {
        return false;
    }
}

async function run() {
    log("Parsing properties...");
    const properties = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    
    const siteMap = {
        'imobiliariaduma': { indexUrl: 'https://imobiliariaduma-mz.com/propriedades/', selector: '.property-title a, a.btn-primary' },
        'sawa-sawa': { indexUrl: 'http://sawa-sawa-imobiliaria.com/', selector: '.tm-property-title a, article.property a' },
        'hibis': { indexUrl: 'https://www.hibis.co.mz/', selector: 'a[href*="/imovel"], a.property-link' },
        'casaesol': { indexUrl: 'https://www.casaesol.co.mz/properties', selector: 'a[href*="/property/"]' }
    };

    log("Launching browser...");
    let browser;
    try {
       browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    } catch(err) {
       log("Error launching browser: " + err.message);
       return;
    }
    
    log("Browser launched. Opening page...");
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let summaryData = [];

    for (const siteDb of ['imobiliariaduma', 'sawa-sawa', 'hibis', 'casaesol']) {
        const siteProps = properties.filter(p => p.source_site === siteDb);
        if (siteProps.length === 0) continue;

        const info = siteMap[siteDb];
        log(`\nNavigating to index: ${info.indexUrl}`);
        
        const galleryLinks = [];
        try {
            await page.goto(info.indexUrl, { waitUntil: 'load', timeout: 60000 });
            await new Promise(r => setTimeout(r, 5000));
            
            const links = await page.evaluate((sel, base) => {
                const anchors = Array.from(document.querySelectorAll(sel));
                return anchors.map(a => {
                    if (a.href.startsWith('http')) return a.href;
                    return new URL(a.getAttribute('href'), base).href;
                });
            }, info.selector, info.indexUrl);
            
            const unique = [...new Set(links)];
            for (const l of unique) {
                if (galleryLinks.length < siteProps.length) {
                    galleryLinks.push(l);
                }
            }
        } catch (e) {
            log(`Failed to scrape index of ${siteDb}: ${e.message}`);
        }

        log(`Found ${galleryLinks.length} listings for ${siteDb}`);

        for (let i = 0; i < siteProps.length; i++) {
            const prop = siteProps[i];
            const listingUrl = galleryLinks[i];
            
            if (!listingUrl) {
                log(`[!] No URL found for property ID ${prop.id}`);
                summaryData.push(`- Prop ${prop.id}: 0 images (no URL)`);
                continue;
            }

            log(`Navigating to ${listingUrl} for Property ${prop.id}`);
            try {
                await page.goto(listingUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
                await new Promise(r => setTimeout(r, 2000));
                
                const imageUrls = await page.evaluate(() => {
                    const imgs = Array.from(document.querySelectorAll('img'));
                    const valid = [];
                    for (const img of imgs) {
                        const w = img.width;
                        let src = img.getAttribute('data-src') || img.src;
                        if (!src) continue;
                        if (src.includes('logo') || src.includes('icon') || src.includes('avatar') || img.className.toLowerCase().includes('logo')) continue;
                        if (src.endsWith('.svg') || src.endsWith('.gif')) continue;
                        if (w > 0 && w < 200) continue;
                        
                        if (src.startsWith('//')) src = 'https:' + src;
                        else if (src.startsWith('/')) src = window.location.origin + src;
                        
                        if (!valid.includes(src)) valid.push(src);
                    }
                    return valid;
                });

                log(`Property ${prop.id}: Extracted ${imageUrls.length} image URLs to download.`);
                
                const downloadedLocalPaths = [];
                let counter = 1;
                for (let j = 0; j < imageUrls.length; j++) {
                    const u = imageUrls[j];
                    const ext = u.split('?')[0].split('.').pop().toLowerCase() || 'jpg';
                    const safeExt = ['jpg','jpeg','png','webp'].includes(ext) ? ext : 'jpg';
                    const filename = `${siteDb}_${prop.id}_${counter}.${safeExt}`;
                    const localPath = path.join(OUT_DIR, filename);

                    log(` Downloading ${u} to ${filename}...`);
                    const success = await downloadImageContent(page, u, localPath);
                    if (success) {
                        downloadedLocalPaths.push(`/perola/images/${filename}`);
                        counter++;
                    }
                    if (counter > 5) break; 
                }

                if (downloadedLocalPaths.length > 0) {
                    prop.images = downloadedLocalPaths;
                }
                summaryData.push(`- Prop ${prop.id}: downloaded ${downloadedLocalPaths.length} images.`);

            } catch (err) {
                log(`Error on Property ${prop.id} -> ${listingUrl} Details: ${err.message}`);
                summaryData.push(`- Prop ${prop.id}: Failed (${err.message})`);
            }
        }
    }

    try { await browser.close(); } catch(e) {}
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf8');
    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'summary_scrape.txt'), summaryData.join('\n'));
    log("Completed!");
}

run();
