const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const docsDir = path.join(__dirname, 'docs');

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to remove directory recursively
function rmDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function build() {
  console.log('Starting slide build and merge process...');

  // 1. Ensure docs directory exists
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // 2. Read index.html template from src
  const indexHtmlPath = path.join(srcDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('Error: src/index.html not found!');
    process.exit(1);
  }
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // 3. Read and merge session HTML files
  const sessionDir = path.join(srcDir, 'session');
  let mergedSlidesHtml = '\n';

  const sessions = ['session1.html', 'session2.html', 'session3.html', 'session4.html', 'session5.html', 'session6.html'];

  sessions.forEach((filename, index) => {
    const sessionNum = index + 1;
    const sessionPath = path.join(sessionDir, filename);

    if (fs.existsSync(sessionPath)) {
      console.log(`Processing ${filename}...`);
      let content = fs.readFileSync(sessionPath, 'utf8');

      // Inject session class to all slide-card sections
      // Matches <section ... class="...slide-card..." ...> and adds session-N
      content = content.replace(
        /(<section\s+[^>]*\bclass=["'])([^"']*\bslide-card\b[^"']*)(["'])/g,
        `$1$2 session-${sessionNum}$3`
      );

      mergedSlidesHtml += `<!-- Start of ${filename} -->\n`;
      mergedSlidesHtml += content.trim() + '\n';
      mergedSlidesHtml += `<!-- End of ${filename} -->\n\n`;
    } else {
      console.warn(`Warning: ${filename} not found in src/session/`);
    }
  });

  // 4. Inject merged slide content into indexHtml
  const canvasTarget = '<canvas class="drawing-canvas-layer" id="drawing-canvas"></canvas>';
  if (indexHtml.includes(canvasTarget)) {
    indexHtml = indexHtml.replace(canvasTarget, `${canvasTarget}${mergedSlidesHtml}`);
    console.log('Successfully merged all session slides into index.html');
  } else {
    console.error('Error: Could not find insertion target (<canvas class="drawing-canvas-layer" id="drawing-canvas"></canvas>) in index.html');
    process.exit(1);
  }

  // 5. Read and inline style.css and app.js
  console.log('Inlining style.css and app.js...');
  const styleCss = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
  const appJs = fs.readFileSync(path.join(srcDir, 'app.js'), 'utf8');

  indexHtml = indexHtml.replace(
    /<link\s+[^>]*href=["']style\.css["'][^>]*>/g,
    `<style>\n${styleCss}\n</style>`
  );
  indexHtml = indexHtml.replace(
    /<script\s+[^>]*src=["']app\.js["'][^>]*>\s*<\/script>/g,
    `<script>\n${appJs}\n</script>`
  );

  // 6. Write index.html to docs/
  fs.writeFileSync(path.join(docsDir, 'index.html'), indexHtml, 'utf8');

  // 7. Cleanup standalone CSS and JS in docs if they exist
  const standaloneCss = path.join(docsDir, 'style.css');
  const standaloneJs = path.join(docsDir, 'app.js');
  if (fs.existsSync(standaloneCss)) {
    fs.unlinkSync(standaloneCss);
  }
  if (fs.existsSync(standaloneJs)) {
    fs.unlinkSync(standaloneJs);
  }

  console.log('Copying images and review files...');
  copyDirSync(path.join(srcDir, 'images'), path.join(docsDir, 'images'));
  copyDirSync(path.join(srcDir, 'review'), path.join(docsDir, 'review'));

  // 8. Cleanup docs/session/ if it exists in deploy folder (no longer needed)
  const docsSessionDir = path.join(docsDir, 'session');
  if (fs.existsSync(docsSessionDir)) {
    console.log('Cleaning up unused docs/session folder...');
    rmDirSync(docsSessionDir);
  }

  console.log('Build completed successfully!');
}

build();
