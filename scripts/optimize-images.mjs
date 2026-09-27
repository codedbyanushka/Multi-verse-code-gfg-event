import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, '../assets/marvel-raw');
const OUTPUT_DIR = path.resolve(__dirname, '../public/images/optimized');
const WIDTHS = [320, 640, 1024, 1600];
const MAX_WIDTH = 2400;

async function processImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manifest = {};

  const traverseDir = async (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        await traverseDir(fullPath);
      } else if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
        await processImage(fullPath);
      }
    }
  };

  const processImage = async (inputPath) => {
    const relPath = path.relative(INPUT_DIR, inputPath);
    const heroFolder = path.dirname(relPath);
    const fileName = path.basename(relPath, path.extname(relPath));
    const outFolder = path.join(OUTPUT_DIR, heroFolder);
    
    if (!fs.existsSync(outFolder)) {
      fs.mkdirSync(outFolder, { recursive: true });
    }

    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Auto-rotate based on EXIF to ensure correct orientation before getting width/height
    const rotatedImage = image.rotate();
    const rotatedMetadata = await rotatedImage.metadata();
    
    const aspectRatio = rotatedMetadata.width / rotatedMetadata.height;
    
    if (!manifest[heroFolder]) manifest[heroFolder] = {};
    manifest[heroFolder][fileName] = {
      aspectRatio,
      variants: {}
    };

    const targetWidths = [...WIDTHS];
    if (rotatedMetadata.width > Math.max(...WIDTHS)) {
       targetWidths.push(Math.min(rotatedMetadata.width, MAX_WIDTH));
    } else {
       targetWidths.push(rotatedMetadata.width); // Include original if smaller
    }
    
    // Sort and remove duplicates
    const uniqueWidths = [...new Set(targetWidths)].sort((a,b)=>a-b);

    for (const w of uniqueWidths) {
      const label = w === targetWidths[targetWidths.length - 1] ? 'original' : w.toString();
      const webpPath = path.join(outFolder, `${fileName}-${label}.webp`);
      const avifPath = path.join(outFolder, `${fileName}-${label}.avif`);
      
      const resized = rotatedImage.clone().resize(w, null, { withoutEnlargement: true });
      
      await resized.webp({ quality: 80 }).toFile(webpPath);
      await resized.avif({ quality: 75 }).toFile(avifPath);
      
      manifest[heroFolder][fileName].variants[label] = {
        webp: `/images/optimized/${heroFolder}/${fileName}-${label}.webp`,
        avif: `/images/optimized/${heroFolder}/${fileName}-${label}.avif`,
        width: w
      };
    }
    
    console.log(`Processed ${heroFolder}/${fileName}`);
  };

  await traverseDir(INPUT_DIR);
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'), 
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('Image optimization complete! manifest.json generated.');
}

processImages().catch(console.error);
