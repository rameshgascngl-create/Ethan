#!/usr/bin/env node
/*
 * Fast local/CI checks that do not require a full Windows build:
 *  1. Version is consistent between package.json and the app's own APPVER.
 *  2. The JSON backup format identity and checksum field are unchanged
 *     (backup compatibility is release-blocking — see spec section 20/36).
 *  3. The renderer actually boots inside Electron, the app:// origin loads,
 *     the CSP produces no violations, and window.VarugaiNative is present
 *     with a working version() round-trip through the real IPC bridge.
 */
'use strict';
const { execFileSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
let failures = 0;

function check(name, fn) {
  try {
    fn();
    console.log('PASS', name);
  } catch (e) {
    failures++;
    console.error('FAIL', name, '-', e.message);
  }
}

check('package.json version matches app/app.js APPVER', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const appJs = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  const m = appJs.match(/const APPVER='([^']+)'/);
  if (!m) throw new Error('APPVER constant not found in app/app.js');
  if (m[1] !== pkg.version) throw new Error(`package.json=${pkg.version} vs APPVER=${m[1]}`);
});

check('backup format identity and checksum are intact', () => {
  const appJs = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  if (!appJs.includes("format:'varugai-backup'")) throw new Error('backup format marker missing');
  if (!appJs.includes('schema:2')) throw new Error('backup schema marker missing');
  if (!appJs.includes('checksum:fnv(payload)')) throw new Error('checksum field missing from makeBackup()');
  if (!appJs.includes("raw.checksum&&raw.checksum!==sum")) throw new Error('checksum validation missing from restore path');
});

check('CSP forbids remote connections and inline script', () => {
  const html = fs.readFileSync(path.join(ROOT, 'app', 'index.html'), 'utf8');
  const m = html.match(/Content-Security-Policy" content="([^"]+)"/);
  if (!m) throw new Error('no CSP meta tag found');
  const csp = m[1];
  if (!/connect-src 'none'/.test(csp)) throw new Error("connect-src must be 'none'");
  if (!/object-src 'none'/.test(csp)) throw new Error("object-src must be 'none'");
  if (!/frame-src 'none'/.test(csp)) throw new Error("frame-src must be 'none'");
  if (/script-src[^;]*unsafe-inline/.test(csp)) throw new Error('script-src must not allow unsafe-inline');
});

check('no eval() or Function() in shipped renderer code', () => {
  const appJs = fs.readFileSync(path.join(ROOT, 'app', 'app.js'), 'utf8');
  if (/\beval\s*\(/.test(appJs)) throw new Error('eval() found');
  if (/new\s+Function\s*\(/.test(appJs)) throw new Error('new Function() found');
});

check('renderer boots inside Electron with a working native bridge', () => {
  // require('electron') resolves to the real platform binary (electron.exe on
  // Windows, not the node_modules/.bin/electron.cmd shell shim) — spawning a
  // .cmd directly without `shell: true` silently fails on Windows, which is
  // exactly what happened on windows-latest CI: spawnSync came back with no
  // output at all rather than a real error.
  let electronBin;
  try {
    electronBin = require('electron');
  } catch (e) {
    throw new Error('electron is not installed (run npm install): ' + e.message);
  }
  if (!electronBin || !fs.existsSync(electronBin)) {
    throw new Error('electron binary not found at ' + electronBin);
  }

  // Start from a clean isolated profile every run (electron/main.js routes
  // VARUGAI_SMOKE_TEST to a temp userData dir, never the real %APPDATA%\VARUGAI).
  const smokeProfile = path.join(require('os').tmpdir(), 'varugai-smoke-test-profile');
  fs.rmSync(smokeProfile, { recursive: true, force: true });

  const needsXvfb = process.platform === 'linux' && !process.env.DISPLAY;
  const cmd = needsXvfb ? 'xvfb-run' : electronBin;
  const args = needsXvfb
    ? ['-a', electronBin, ROOT, '--no-sandbox', '--disable-gpu']
    : [ROOT, ...(process.platform === 'linux' ? ['--no-sandbox', '--disable-gpu'] : [])];

  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    env: Object.assign({}, process.env, { VARUGAI_SMOKE_TEST: '1' }),
    timeout: 30000,
    encoding: 'utf8',
  });
  if (result.error) {
    throw new Error('failed to launch Electron (' + cmd + '): ' + result.error.message);
  }
  const out = (result.stdout || '') + (result.stderr || '');
  if (!out.includes('[smoke] bridge present: true')) {
    throw new Error('window.VarugaiNative bridge did not initialise:\n' + out.slice(-2000));
  }
  if (!/\[smoke\] version\(\): \d+\.\d+\.\d+/.test(out)) {
    throw new Error('version() round-trip through IPC failed:\n' + out.slice(-2000));
  }
  if (!out.includes('[smoke] app rendered: true')) {
    throw new Error('the VARUGAI UI did not render:\n' + out.slice(-2000));
  }
  if (/Content Security Policy directive.*blocked/i.test(out)) {
    throw new Error('a CSP violation was reported:\n' + out.slice(-2000));
  }

  const m = out.match(/\[functional\] (\{.*\})/);
  if (!m) throw new Error('functional setup/roster/attendance cycle did not report a result:\n' + out.slice(-2000));
  const r = JSON.parse(m[1]);
  if (JSON.stringify(r.rosterOrder) !== JSON.stringify(['Alice', 'Bob'])) {
    throw new Error('roster was not imported in register order: ' + JSON.stringify(r.rosterOrder));
  }
  if (!r.hoursWhileOpen.every((h) => h === 0)) {
    throw new Error('an OPEN day counted hours in the denominator (release-blocking rule violated): ' + JSON.stringify(r.hoursWhileOpen));
  }
  if (!r.afterComplete.every((p) => p === 100)) {
    throw new Error('percentage after completing a day with all-P marks was not 100%: ' + JSON.stringify(r.afterComplete));
  }
});

if (failures) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}
console.log('\nAll tests passed.');
