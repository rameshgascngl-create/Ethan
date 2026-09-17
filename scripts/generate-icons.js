#!/usr/bin/env node
/*
 * Generates the VARUGAI application icon at every required size, plus a
 * Windows multi-size .ico, with no external image libraries or network
 * fetches — everything is rasterised in code so no source asset can be
 * stretched or go missing. Run: node scripts/generate-icons.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'icons');
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SIZES = [16, 24, 32, 48, 64, 128, 256, 512];
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256];

// VARUGAI palette
const INK = [0x1b, 0x2a, 0x4a, 255];
const PAPER = [0xec, 0xee, 0xe9, 255];
const STAMP = [0x2f, 0x6b, 0x4f, 255];

function lerp(a, b, t) { return a + (b - a) * t; }

function mixPixel(dst, src, alpha) {
  // straight alpha blend of src (with its own alpha) onto opaque dst
  const a = (src[3] / 255) * alpha;
  return [
    Math.round(lerp(dst[0], src[0], a)),
    Math.round(lerp(dst[1], src[1], a)),
    Math.round(lerp(dst[2], src[2], a)),
    255,
  ];
}

// distance from point P to segment AB
function distToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const apx = px - ax, apy = py - ay;
  const abLen2 = abx * abx + aby * aby;
  let t = abLen2 === 0 ? 0 : (apx * abx + apy * aby) / abLen2;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * abx, cy = ay + t * aby;
  const dx = px - cx, dy = py - cy;
  return Math.sqrt(dx * dx + dy * dy);
}

function roundedRectCoverage(x, y, size, radius) {
  // returns 0..1 anti-aliased coverage of a rounded square with given corner radius
  const w = size, h = size;
  const nx = x < radius ? radius : (x > w - radius ? w - radius : x);
  const ny = y < radius ? radius : (y > h - radius ? h - radius : y);
  const inCornerZone = (x < radius || x > w - radius) && (y < radius || y > h - radius);
  if (!inCornerZone) return 1;
  const d = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2);
  if (d <= radius - 0.75) return 1;
  if (d >= radius + 0.75) return 0;
  return 1 - (d - (radius - 0.75)) / 1.5;
}

function renderIcon(size) {
  const px = new Uint8Array(size * size * 4);
  const radius = size * 0.19;
  const thickness = Math.max(1.6, size * 0.135);
  // chevron ("V") vertices, in icon-space fractions
  const ax = size * 0.27, ay = size * 0.26;
  const bx = size * 0.5, by = size * 0.66;
  const cx = size * 0.75, cy = size * 0.24;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cxp = x + 0.5, cyp = y + 0.5;
      const cover = roundedRectCoverage(cxp, cyp, size, radius);
      let pixel = mixPixel(PAPER, INK, cover); // background composited onto paper backdrop (so edges anti-alias cleanly)

      const dLeft = distToSegment(cxp, cyp, ax, ay, bx, by);
      const dRight = distToSegment(cxp, cyp, bx, by, cx, cy);
      const dArm = Math.min(dLeft, dRight);
      const half = thickness / 2;
      let armCover = 0;
      if (dArm <= half - 0.6) armCover = 1;
      else if (dArm < half + 0.6) armCover = 1 - (dArm - (half - 0.6)) / 1.2;
      if (armCover > 0) pixel = mixPixel(pixel, PAPER, armCover * cover);

      // small stamp-green accent dot at the base of the V, present at larger sizes only
      if (size >= 48) {
        const dDot = Math.hypot(cxp - bx, cyp - by - size * 0.02);
        const dotR = size * 0.05;
        let dotCover = 0;
        if (dDot <= dotR - 0.6) dotCover = 1;
        else if (dDot < dotR + 0.6) dotCover = 1 - (dDot - (dotR - 0.6)) / 1.2;
        if (dotCover > 0) pixel = mixPixel(pixel, STAMP, dotCover * cover);
      }

      const i = (y * size + x) * 4;
      px[i] = pixel[0]; px[i + 1] = pixel[1]; px[i + 2] = pixel[2]; px[i + 3] = 255;
    }
  }
  return px;
}

function crc32(buf) {
  let c, table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(rgba, size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;    // bit depth
  ihdr[9] = 6;    // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    Buffer.from(rgba.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function buildIco(pngBuffers, sizes) {
  const n = sizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(n, 4);

  const dirEntries = [];
  const imageData = [];
  let offset = 6 + n * 16;
  for (let i = 0; i < n; i++) {
    const size = sizes[i];
    const png = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry[2] = 0; // palette
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4);  // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    imageData.push(png);
    offset += png.length;
  }
  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pngBySize = {};
  for (const size of SIZES) {
    const rgba = renderIcon(size);
    const png = encodePng(rgba, size);
    pngBySize[size] = png;
    fs.writeFileSync(path.join(OUT_DIR, `icon-${size}.png`), png);
  }
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), pngBySize[256]);
  const ico = buildIco(ICO_SIZES.map(s => pngBySize[s]), ICO_SIZES);
  fs.writeFileSync(path.join(ASSETS_DIR, 'icon.ico'), ico);
  console.log('Generated icon.ico (' + ICO_SIZES.join(',') + ') and ' + SIZES.length + ' PNG sizes in assets/.');
}

main();
