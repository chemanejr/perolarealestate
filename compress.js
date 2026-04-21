import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, 'public', 'perola', 'images');

async function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await processDirectory(filePath);
        } else if (file.match(/\.(png|jpe?g)$/i)) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            
            // Skip converting if we somehow already have webp or are processing webp
            if (ext.toLowerCase() === '.webp') continue;
            
            const newFilePath = path.join(dir, `${baseName}.webp`);
            
            console.log(`Processing: ${file}`);
            try {
                await sharp(filePath)
                    .resize({ width: 1000, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(newFilePath);
                
                console.log(`Converted to WebP: ${baseName}.webp`);
                
                // Delete original file
                fs.unlinkSync(filePath);
                console.log(`Deleted original: ${file}`);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
}

async function main() {
    console.log('Started image processing...');
    await processDirectory(imagesDir);
    console.log('Image processing completed.');
}

main().catch(console.error);
