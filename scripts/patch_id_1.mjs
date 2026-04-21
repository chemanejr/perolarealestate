import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public', 'properties.json');
const properties = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

// ID 1: Moradia T4 Sommerschield
const propIndex = properties.findIndex(p => p.id === 1);
if (propIndex !== -1) {
    properties[propIndex].images = [
        "/perola/images/imobiliariaduma_1_1.jpg",
        "/perola/images/imobiliariaduma_1_2.jpg",
        "/perola/images/imobiliariaduma_1_3.jpg",
        "/perola/images/imobiliariaduma_1_4.jpg",
        "/perola/images/imobiliariaduma_1_5.jpg"
    ];
    properties[propIndex].hosted_externally = false;
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf-8');
    console.log("Updated properties.json for ID 1 with 5 images.");
} else {
    console.log("Property ID 1 not found!");
}
