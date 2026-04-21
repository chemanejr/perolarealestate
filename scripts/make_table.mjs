import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
const properties = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

let md = '| ID | Site | Property Title | Original Price | Final Price (+5%) |\n';
md += '|---|---|---|---|---|\n';

properties.forEach(p => {
  md += `| ${p.id} | ${p.source_site} | ${p.title} | ${p.original_price} | ${p.price} |\n`;
});

fs.writeFileSync('table.md', md);
