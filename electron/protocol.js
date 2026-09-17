'use strict';
/*
 * Registers a stable, local-only "app://varugai/" origin for the renderer
 * instead of loading the UI over file://. A file:// document gets an opaque
 * origin whose storage behaviour varies across Chromium versions; a
 * registered standard+secure scheme behaves like a normal origin (stable
 * localStorage, no "not secure" quirks) while never touching the network —
 * it is served entirely from files bundled inside the app.
 */
const path = require('path');
const fs = require('fs');

const SCHEME = 'app';
const HOST = 'varugai';
const APP_ROOT = path.join(__dirname, '..', 'app');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

/** Must be called before app.whenReady(). */
function registerSchemePrivileges(protocol) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: false,
        corsEnabled: false,
        stream: false,
        bypassCSP: false,
        allowServiceWorkers: false,
      },
    },
  ]);
}

/** Must be called after app.whenReady(). Serves only files inside app/. */
function registerProtocolHandler(protocol) {
  protocol.handle(SCHEME, (request) => {
    const url = new URL(request.url);
    if (url.hostname !== HOST) {
      return new Response('Not found', { status: 404 });
    }
    let reqPath = decodeURIComponent(url.pathname);
    if (reqPath === '' || reqPath === '/') reqPath = '/index.html';

    // Resolve against the app root and refuse anything that would escape it
    // (defends against "../" traversal in a crafted request).
    const resolved = path.normalize(path.join(APP_ROOT, reqPath));
    if (!resolved.startsWith(APP_ROOT + path.sep) && resolved !== APP_ROOT) {
      return new Response('Forbidden', { status: 403 });
    }

    let data;
    try {
      data = fs.readFileSync(resolved);
    } catch (e) {
      return new Response('Not found', { status: 404 });
    }
    const ext = path.extname(resolved).toLowerCase();
    const type = MIME_TYPES[ext] || 'application/octet-stream';
    return new Response(data, { headers: { 'Content-Type': type } });
  });
}

module.exports = { SCHEME, HOST, registerSchemePrivileges, registerProtocolHandler };
