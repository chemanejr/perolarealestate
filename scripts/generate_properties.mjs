import fs from 'fs';
import path from 'path';

const OUT_DIR = path.join(process.cwd(), 'public', 'perola', 'images');
const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Assume there are dummy origin image files in public
const sourceImages = [
  path.join(process.cwd(), 'public', 'hero_1.jpg'),
  path.join(process.cwd(), 'public', 'hero_2.jpg'),
  path.join(process.cwd(), 'public', 'hero_mansion.png'),
  path.join(process.cwd(), 'public', 'villa-exterior.png'),
  path.join(process.cwd(), 'public', 'villa-interior.png')
];

function getExt(filePath) {
  return path.extname(filePath) || '.jpg';
}

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

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
    const formatted = addedNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    newStr = newStr.substring(0, match.index) + formatted + newStr.substring(match.index + origStr.length);
  }
  return newStr;
}

const siteTemplates = {
  'imobiliariaduma': {
      titles: ['Moradia T4 Sommerschield', 'Apartamento Triplex Triunfo', 'Moradia T5 Sommerschield', 'Moradia T3 Costa do Sol', 'Apartamento T2 Polana', 'Cobertura T4 Marginal'],
      prices: ['20.000.000 MT', '15.000.000 - 18.000.000 MT', '25.000.000 MT', '10.000.000 MT', '7.000.000 MT', 'Consultar']
  },
  'sawa-sawa': {
      titles: ['Arrenda-se Duplex T4 Av. Julius Nyerere', 'Moradia T5 Av. do Zimbabwe', 'Apartamento T3 Bairro Central', 'Terreno Costa do Sol', 'Moradia Triunfo Novo', 'Apartamento T1 Museu'],
      prices: ['150.000 MT / Mês', '250.000 MT', '12.000.000 MT', '8.000.000 MT', '30.000.000 MT', '4.000.000 MT']
  },
  'hibis': {
      titles: ['Vivenda T4 Belo Horizonte', 'Apartamento T3 Malhangalene', 'Escritórios Baixa de Maputo', 'Moradia T5 Zimpeto', 'Terreno Marracuene', 'Armazém Machava'],
      prices: ['18.000.000 MT', '6.500.000 MT', '20.000.000 MT', '16.000.000 MT', '1.500.000 MT', '12.000.000 MT']
  },
  'casaesol': {
      titles: ['T2 Mobilado no Platinum', 'T4+1 no Triunfo', 'T3 com Vista ao Mar Polana', 'T2 Condomínio Park Moza', 'Moradia T4 Suites Saphire', 'Apartamento T3 Condomínio Imoinveste'],
      prices: ['160.000 MT', '36.500.000 MT', '28.000.000 MT', '150.000 MT', '18.000.000 MT', '8.000.000 MT']
  }
};

const properties = [];
let idCounter = 1;

for (const [site, data] of Object.entries(siteTemplates)) {
  for (let i = 0; i < 6; i++) {
    const images = [];
    const sourceImageCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 images
    for (let c = 0; c < sourceImageCount; c++) {
      const srcObj = randItem(sourceImages);
      const ext = getExt(srcObj);
      const filename = `${site}_${i+1}_${c+1}${ext}`;
      const destPath = path.join(OUT_DIR, filename);
      if (fs.existsSync(srcObj)) {
        fs.copyFileSync(srcObj, destPath);
        images.push(`/perola/images/${filename}`);
      }
    }
    
    const origPrice = data.prices[i];
    const newPrice = convertPrice(origPrice);
    
    properties.push({
      id: idCounter++,
      source_site: site,
      title: data.titles[i],
      original_price: origPrice,
      price: newPrice,
      location: 'Maputo',
      type: data.titles[i].includes('Apartamento') || data.titles[i].includes('T') ? 'Apartment' : 'House',
      bedrooms: (Math.floor(Math.random() * 4) + 1).toString(),
      bathrooms: (Math.floor(Math.random() * 3) + 1).toString(),
      description: `Excelente oportunidade da ${site}: ${data.titles[i]}. Bem localizado em Maputo.`,
      images: images,
      hosted_externally: false
    });
  }
}

fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf-8');
console.log(`Saved ${properties.length} properties to ${DATA_FILE}.`);
