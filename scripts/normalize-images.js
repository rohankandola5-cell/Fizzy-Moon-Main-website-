import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const INPUT_DIR = join(projectRoot, 'public', 'images');
// Output to normalized directory - update image paths after normalization
// Or set to INPUT_DIR to replace originals (backup recommended first)
const OUTPUT_DIR = join(projectRoot, 'public', 'images-normalized');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

/**
 * Recursively walk directory and find all image files
 */
async function findImages(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await findImages(filePath, fileList);
    } else if (IMAGE_EXTENSIONS.includes(extname(file).toLowerCase())) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Normalize a single image to sRGB
 */
async function normalizeImage(inputPath) {
  const relativePath = relative(INPUT_DIR, inputPath);
  const outputPath = join(OUTPUT_DIR, relativePath);
  
  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });
  
  const ext = extname(inputPath).toLowerCase();
  const isJpeg = ext === '.jpg' || ext === '.jpeg';
  
  try {
    let pipeline = sharp(inputPath)
      .toColorspace('srgb') // Convert to sRGB color space for consistent rendering
      .removeAlpha(); // Remove alpha channel for consistency
    
    if (isJpeg) {
      pipeline = pipeline.jpeg({ 
        quality: 85,
        mozjpeg: true 
      });
    } else {
      pipeline = pipeline.png({ 
        compressionLevel: 6,
        adaptiveFiltering: true
      });
    }
    
    await pipeline.toFile(outputPath);
    
    console.log(`✓ Normalized: ${relativePath}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to normalize ${relativePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('Starting image normalization...\n');
  console.log(`Input directory: ${INPUT_DIR}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);
  
  try {
    // Ensure output directory exists
    await mkdir(OUTPUT_DIR, { recursive: true });
    
    // Find all images
    const images = await findImages(INPUT_DIR);
    
    if (images.length === 0) {
      console.log('No images found in', INPUT_DIR);
      return;
    }
    
    console.log(`Found ${images.length} image(s) to process\n`);
    
    // Process images
    let successCount = 0;
    let failCount = 0;
    
    for (const imagePath of images) {
      const success = await normalizeImage(imagePath);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
    
    console.log(`\n✓ Completed: ${successCount} succeeded, ${failCount} failed`);
    console.log(`\nNormalized images have been saved to: ${OUTPUT_DIR}`);
    console.log('All images have been converted to sRGB color space for consistent rendering across devices.');
    if (OUTPUT_DIR !== INPUT_DIR) {
      console.log('\n⚠️  Next steps:');
      console.log('1. Review the normalized images in /public/images-normalized/');
      console.log('2. Replace originals in /public/images/ with normalized versions');
      console.log('3. Or update image paths in your code to use /images-normalized/');
    } else {
      console.log('\n⚠️  Note: Original images have been replaced. Make sure to backup your originals before running this script.');
    }
    
  } catch (error) {
    console.error('Error during normalization:', error);
    process.exit(1);
  }
}

main();

