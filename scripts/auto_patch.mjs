import fs from 'fs';
import path from 'path';

const IMG_DIR = path.join(process.cwd(), 'public', 'perola', 'images');
const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');

const properties = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const files = fs.readdirSync(IMG_DIR);

// Find property ID 1
const propIndex = properties.findIndex(p => p.id === 1);
if (propIndex !== -1) {
    // Collect all exact files starting with imobiliariaduma_1_
    // that are images and sort them.
    const propImages = files
        .filter(f => f.startsWith('imobiliariaduma_1_'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/_(\d+)\./)?.[1] || 0);
            const numB = parseInt(b.match(/_(\d+)\./)?.[1] || 0);
            return numA - numB;
        })
        .map(f => `/perola/images/${f}`);
        
    if (propImages.length > 0) {
        properties[propIndex].images = propImages;
        properties[propIndex].hosted_externally = false;
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf-8');
        console.log(`Updated ID 1 with ${propImages.length} images:`, propImages);
    } else {
        console.log("No files found matching imobiliariaduma_1_");
    }
} else {
    console.log("Property ID 1 not found!");
}
