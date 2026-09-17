'use strict';
/*
 * Preload script. Runs in an isolated world (contextIsolation: true) with
 * Node integration disabled in the renderer, so this is the *only* place
 * that may touch ipcRenderer. It exposes a narrow, explicit surface —
 * window.VarugaiNative — mirroring the interface the app already looks for
 * (the same shape the Android WebView bridge used), and nothing else.
 * No filesystem, shell, process, or require access ever reaches page code.
 */
const { contextBridge, ipcRenderer } = require('electron');

function invoke(channel, payload) {
  return ipcRenderer.invoke(channel, payload);
}

const api = Object.freeze({
  /** Save arbitrary base64-encoded bytes under a suggested filename. */
  saveBase64: (name, data, mime) => invoke('varugai:save-file', { name, data, mime }),

  /** Save an Excel workbook (base64 .xlsx bytes) under a suggested filename. */
  saveExcel: (name, data) => invoke('varugai:save-file', {
    name,
    data,
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }),

  /** Render the current attendance statement view to a Windows-native A4 PDF and save it. */
  savePdf: (name) => invoke('varugai:save-pdf', { name }),

  /** Print the current page via the OS print dialog (Electron's native print, not window.print()). */
  printPage: () => invoke('varugai:print'),

  /** Packaged application version, read from package.json at build time — never hard-coded. */
  version: () => invoke('varugai:version'),

  /** Best-effort atomic recovery snapshot, additional to normal localStorage persistence. */
  recoverySnapshot: (registerId, json) => invoke('varugai:recovery-snapshot', { registerId, json }),
});

contextBridge.exposeInMainWorld('VarugaiNative', api);
// The app also checks window.VarugaiAndroid (the name used by the earlier Android
// wrapper); exposing the same object under both names keeps a single code path.
contextBridge.exposeInMainWorld('VarugaiAndroid', api);
