#!/usr/bin/env node
/*
 * Writes SHA-256SUMS.txt next to the electron-builder output, covering every
 * installer/portable/zip artifact so a user (or CI) can verify a download
 * has not been altered in transit.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RELEASE_DIR = path.join(__dirname, '..', 'release');
const ARTIFACT_EXTENSIONS = new Set(['.exe', '.zip']);

function sha256(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function main() {
  if (!fs.existsSync(RELEASE_DIR)) {
    console.error('No release/ directory yet — run a dist:win build first.');
    process.exit(1);
  }
  const files = fs.readdirSync(RELEASE_DIR)
    .filter((f) => ARTIFACT_EXTENSIONS.has(path.extname(f)))
    .sort();
  if (!files.length) {
    console.error('No .exe/.zip artifacts found in release/.');
    process.exit(1);
  }
  const lines = files.map((f) => `${sha256(path.join(RELEASE_DIR, f))}  ${f}`);
  const outFile = path.join(RELEASE_DIR, 'SHA-256SUMS.txt');
  fs.writeFileSync(outFile, lines.join('\n') + '\n');
  console.log(lines.join('\n'));
  console.log('\nWritten to', outFile);
}

main();
