import fs from 'fs';
import * as cheerio from 'cheerio';

let out = '';
function log(msg) { out += msg + '\n'; }

const htmlCasa = fs.readFileSync('scripts/casaesol.html', 'utf8');
const match = htmlCasa.match(/window\.__PRELOADED_STATE__ = ([\s\S]*?);<\/script>/);
if (match) {
  log("CASAESOL: Success!");
} else {
  log("CASAESOL: Failed Regex.");
}

const htmlDuma = fs.readFileSync('scripts/duma.html', 'utf8');
const $d = cheerio.load(htmlDuma);
log("DUMA LINKS: " + $d('a').map((i, el) => $d(el).attr('href')).get().filter(h => h && h.includes('property')).slice(0, 5).join(', '));

const htmlSawa = fs.readFileSync('scripts/sawa.html', 'utf8');
const $s = cheerio.load(htmlSawa);
log("SAWA LINKS: " + $s('a').map((i, el) => $s(el).attr('href')).get().filter(h => h && (h.includes('property') || h.includes('imovel') || h.includes('moradia') || h.includes('apartamento'))).slice(0, 5).join(', '));

const htmlHibis = fs.readFileSync('scripts/hibis.html', 'utf8');
const $h = cheerio.load(htmlHibis);
log("HIBIS LINKS: " + $h('a').map((i, el) => $h(el).attr('href')).get().filter(h => h && h.includes('imovel')).slice(0, 5).join(', '));

fs.writeFileSync('scripts/out_utf8.txt', out, 'utf8');
