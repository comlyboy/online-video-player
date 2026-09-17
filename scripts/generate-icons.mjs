import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(rootDir, "public");
const iconsDir = path.join(publicDir, "icons");
const sourceSvgPath = path.join(publicDir, "icon.svg");

const BRAND_BACKGROUND = "#0891b2";
const BRAND_INK = "#020617";

async function renderPng(svgBuffer, size, outputPath) {
  await sharp(svgBuffer, { density: 384 }).resize(size, size).png().toFile(outputPath);
}

function buildMaskableSvg() {
  // 512 canvas, icon shrunk to ~65% and centered, so OS masks (circle/squircle) never clip the glyph.
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BRAND_BACKGROUND}" />
  <g transform="translate(90 90) scale(0.648)">
    <path d="M206 160c0-14.9 16.4-24 29.1-16.2l134 82c12.2 7.5 12.2 25 0 32.5l-134 82c-12.7 7.8-29.1-1.3-29.1-16.2V160Z" fill="${BRAND_INK}" />
  </g>
</svg>`;
}

function buildOgImageSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a" />
      <stop offset="1" stop-color="#020617" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="486" y="145" width="228" height="228" rx="50" fill="#0891b2" />
  <path d="M576 214c0-9.9 10.9-16 19.4-10.8l67 41c8.1 5 8.1 16.6 0 21.6l-67 41c-8.5 5.2-19.4-0.9-19.4-10.8V214Z" fill="#020617" />
  <text x="600" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#e2e8f0">Online Video Player</text>
  <text x="600" y="500" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">Streaming platforms and direct video URLs, in one place</text>
</svg>`;
}

async function main() {
  await mkdir(iconsDir, { recursive: true });

  const sourceSvgBuffer = await sharp(sourceSvgPath).toBuffer();

  await renderPng(sourceSvgBuffer, 512, path.join(iconsDir, "icon-512.png"));
  await renderPng(sourceSvgBuffer, 192, path.join(iconsDir, "icon-192.png"));
  await renderPng(sourceSvgBuffer, 180, path.join(publicDir, "apple-touch-icon.png"));
  await renderPng(sourceSvgBuffer, 32, path.join(publicDir, "favicon-32.png"));
  await renderPng(sourceSvgBuffer, 16, path.join(publicDir, "favicon-16.png"));

  const maskableSvg = buildMaskableSvg();
  await renderPng(Buffer.from(maskableSvg), 512, path.join(iconsDir, "icon-maskable-512.png"));

  const ogSvg = buildOgImageSvg();
  await sharp(Buffer.from(ogSvg), { density: 192 })
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, "og-image.png"));

  console.log("Generated icons and OG image in public/");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
