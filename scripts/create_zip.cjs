const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const SCREENSHOTS_DIR = path.join(__dirname, '../public/screenshots');
const ZIP_OUTPUT = path.join(__dirname, '../public/panap-ats-screenshots.zip');

async function createZip() {
  const zip = new JSZip();
  const folder = zip.folder('panap-ats-screenshots');

  const files = fs.readdirSync(SCREENSHOTS_DIR);
  console.log(`Adding ${files.length} files to ZIP...`);

  for (const file of files) {
    const filePath = path.join(SCREENSHOTS_DIR, file);
    const content = fs.readFileSync(filePath);
    folder.file(file, content);
    console.log(`+ Added: ${file}`);
  }

  console.log('Generating ZIP buffer...');
  const zipBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  fs.writeFileSync(ZIP_OUTPUT, zipBuffer);
  const stat = fs.statSync(ZIP_OUTPUT);
  console.log(`\nSUCCESS! Created ZIP archive: ${ZIP_OUTPUT}`);
  console.log(`ZIP file size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
}

createZip().catch((err) => {
  console.error('Error generating zip:', err);
  process.exit(1);
});
