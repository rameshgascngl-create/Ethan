'use strict';
/*
 * Implements the "VarugaiNative" desktop bridge invoked through preload.js.
 * Every handler here treats renderer input as untrusted: names are
 * sanitised to a bare filename (never a path), sizes are bounded, and the
 * actual destination on disk is always chosen by the user through a native
 * Save-As dialog — the renderer can never name an arbitrary filesystem
 * path. Nothing here makes a network call; there is none to make.
 */
const { app, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const MAX_EXPORT_BYTES = 25 * 1024 * 1024;      // one exported file (xlsx/json/csv/html)
const MAX_RECOVERY_BYTES = 15 * 1024 * 1024;    // one register's recovery snapshot
const RECOVERY_HISTORY_PER_REGISTER = 15;
const TRUSTED_ORIGIN_PREFIX = 'app://varugai/';

const EXT_FILTERS = {
  '.xlsx': { name: 'Excel Workbook', extensions: ['xlsx'] },
  '.json': { name: 'JSON Backup', extensions: ['json'] },
  '.csv': { name: 'CSV', extensions: ['csv'] },
  '.html': { name: 'Web Page', extensions: ['html'] },
  '.pdf': { name: 'PDF Document', extensions: ['pdf'] },
};

function isTrustedSender(event) {
  try {
    const url = event.senderFrame && event.senderFrame.url;
    return typeof url === 'string' && url.startsWith(TRUSTED_ORIGIN_PREFIX);
  } catch (e) {
    return false;
  }
}

/** Reduce an untrusted, possibly hostile string to a safe bare filename. */
function sanitiseFileName(rawName, fallbackExt) {
  let name = typeof rawName === 'string' ? rawName : '';
  name = path.basename(name);                       // strip any directory component
  name = name.replace(/[^A-Za-z0-9._ -]+/g, '_');    // strip control / separator / traversal chars
  name = name.replace(/^\.+/, '').trim();            // no leading dots (hidden files / "..")
  name = name.slice(0, 150);
  if (!name) name = 'VARUGAI_export' + (fallbackExt || '');
  if (fallbackExt && !name.toLowerCase().endsWith(fallbackExt)) name += fallbackExt;
  return name;
}

function extFilterFor(name) {
  const ext = path.extname(name).toLowerCase();
  const known = EXT_FILTERS[ext];
  return known ? [known, { name: 'All Files', extensions: ['*'] }] : [{ name: 'All Files', extensions: ['*'] }];
}

function exportsDir() {
  const dir = path.join(app.getPath('documents'), 'VARUGAI');
  try { fs.mkdirSync(dir, { recursive: true }); } catch (e) { /* fall back to documents root */ }
  return fs.existsSync(dir) ? dir : app.getPath('documents');
}

function recoveryDir() {
  const dir = path.join(app.getPath('userData'), 'Recovery');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** write temp file -> flush -> close -> atomic rename, never overwrite the target in place. */
function atomicWrite(finalPath, buffer) {
  const tmpPath = finalPath + '.tmp-' + process.pid + '-' + Date.now() + '-' + Math.random().toString(36).slice(2);
  const fd = fs.openSync(tmpPath, 'w');
  try {
    fs.writeSync(fd, buffer);
    fs.fsyncSync(fd);
  } finally {
    fs.closeSync(fd);
  }
  fs.renameSync(tmpPath, finalPath);
}

let recoveryCounter = 0;
const lastRecoveryPayload = new Map(); // registerId -> last json string written

function pruneRecovery(dir, registerId) {
  const prefix = registerId + '__';
  let files;
  try { files = fs.readdirSync(dir); } catch (e) { return; }
  const mine = files.filter((f) => f.startsWith(prefix)).sort(); // ISO timestamps sort lexically
  const excess = mine.length - RECOVERY_HISTORY_PER_REGISTER;
  for (let i = 0; i < excess; i++) {
    try { fs.unlinkSync(path.join(dir, mine[i])); } catch (e) { /* best effort */ }
  }
}

async function handleSaveFile(event, payload) {
  if (!isTrustedSender(event)) return { ok: false, error: 'untrusted sender' };
  const { name, data, mime } = payload || {};
  if (typeof data !== 'string' || !data) return { ok: false, error: 'no data' };

  let bytes;
  try {
    bytes = Buffer.from(data, 'base64');
  } catch (e) {
    return { ok: false, error: 'invalid encoding' };
  }
  if (bytes.length === 0 || bytes.length > MAX_EXPORT_BYTES) {
    return { ok: false, error: 'payload size rejected' };
  }

  const fallbackExt = mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? '.xlsx'
    : mime === 'application/json' ? '.json'
    : mime === 'text/csv' ? '.csv'
    : mime === 'text/html' ? '.html' : '';
  const safeName = sanitiseFileName(name, fallbackExt);

  const win = event.sender.getOwnerBrowserWindow ? event.sender.getOwnerBrowserWindow() : null;
  const result = await dialog.showSaveDialog(win || undefined, {
    title: 'Save VARUGAI file',
    defaultPath: path.join(exportsDir(), safeName),
    filters: extFilterFor(safeName),
  });
  if (result.canceled || !result.filePath) return { ok: false, canceled: true };

  try {
    fs.writeFileSync(result.filePath, bytes);
  } catch (e) {
    return { ok: false, error: 'write failed' };
  }
  return { ok: true, canceled: false };
}

async function handleSavePdf(event, payload, getWindow) {
  if (!isTrustedSender(event)) return { ok: false, error: 'untrusted sender' };
  const win = getWindow();
  if (!win) return { ok: false, error: 'no window' };
  const safeName = sanitiseFileName(payload && payload.name, '.pdf');

  let pdfBuffer;
  try {
    pdfBuffer = await win.webContents.printToPDF({
      pageSize: 'A4',
      landscape: false,
      printBackground: true,
      margins: { marginType: 'none' }, // the page's own @page{margin:12mm} rule controls spacing
      preferCSSPageSize: false,
    });
  } catch (e) {
    return { ok: false, error: 'pdf generation failed' };
  }

  const result = await dialog.showSaveDialog(win, {
    title: 'Save attendance statement as PDF',
    defaultPath: path.join(exportsDir(), safeName),
    filters: [EXT_FILTERS['.pdf'], { name: 'All Files', extensions: ['*'] }],
  });
  if (result.canceled || !result.filePath) return { ok: false, canceled: true };

  try {
    fs.writeFileSync(result.filePath, pdfBuffer);
  } catch (e) {
    return { ok: false, error: 'write failed' };
  }
  return { ok: true, canceled: false };
}

function handlePrint(event, getWindow) {
  if (!isTrustedSender(event)) return Promise.resolve({ ok: false, error: 'untrusted sender' });
  const win = getWindow();
  if (!win) return Promise.resolve({ ok: false, error: 'no window' });
  return new Promise((resolve) => {
    win.webContents.print({ silent: false, printBackground: true, margins: { marginType: 'default' } },
      (success, failureReason) => {
        resolve(success ? { ok: true } : { ok: false, error: failureReason || 'cancelled' });
      });
  });
}

function handleRecoverySnapshot(event, payload) {
  if (!isTrustedSender(event)) return { ok: false };
  const registerId = payload && payload.registerId;
  const json = payload && payload.json;
  if (typeof registerId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(registerId)) return { ok: false };
  if (typeof json !== 'string' || json.length === 0 || json.length > MAX_RECOVERY_BYTES) return { ok: false };
  if (lastRecoveryPayload.get(registerId) === json) return { ok: true, skipped: true };

  try {
    const dir = recoveryDir();
    recoveryCounter = (recoveryCounter + 1) % 1000000;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${registerId}__${stamp}__${String(recoveryCounter).padStart(6, '0')}.json`;
    atomicWrite(path.join(dir, fileName), Buffer.from(json, 'utf8'));
    pruneRecovery(dir, registerId);
    lastRecoveryPayload.set(registerId, json);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: 'recovery write failed' };
  }
}

/**
 * Wires up every varugai:* IPC handler. `getWindow` is a function returning
 * the current (single) BrowserWindow, since it may be recreated.
 */
function registerNativeHandlers(getWindow) {
  ipcMain.handle('varugai:save-file', (event, payload) => handleSaveFile(event, payload));
  ipcMain.handle('varugai:save-pdf', (event, payload) => handleSavePdf(event, payload, getWindow));
  ipcMain.handle('varugai:print', (event) => handlePrint(event, getWindow));
  ipcMain.handle('varugai:version', (event) => {
    if (!isTrustedSender(event)) return '';
    return app.getVersion();
  });
  ipcMain.handle('varugai:recovery-snapshot', (event, payload) => handleRecoverySnapshot(event, payload));
}

module.exports = { registerNativeHandlers, sanitiseFileName };
