#!/usr/bin/env node
/* Fails fast on a syntax error in any shipped script, before packaging or testing. */
'use strict';
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const TARGET_DIRS = ['electron', 'scripts', 'tests'];

function collect(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collect(full));
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

let failed = false;
for (const dir of TARGET_DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const file of collect(abs)) {
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
      console.log('OK  ', path.relative(ROOT, file));
    } catch (e) {
      failed = true;
      console.error('FAIL', path.relative(ROOT, file));
      console.error(e.stderr ? e.stderr.toString() : e.message);
    }
  }
}
if (failed) process.exit(1);
