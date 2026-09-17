'use strict';
const { app, BrowserWindow, Menu, dialog, screen, protocol: electronProtocol } = require('electron');
const path = require('path');
const fs = require('fs');

const { registerSchemePrivileges, registerProtocolHandler, SCHEME, HOST } = require('./protocol');
const { registerNativeHandlers } = require('./native-services');

const APP_URL = `${SCHEME}://${HOST}/index.html`;
const IS_DEV = !app.isPackaged;

// VARUGAI holds identifiable student data and must work fully disconnected.
// Chromium itself makes a handful of optional background connections
// (component updates, "optimization hints", domain reliability pings, sync)
// unless explicitly told not to; none of that is app behaviour, but it is
// still outbound traffic this attendance register has no business making,
// so it is switched off before the engine starts. Must be set before
// app.whenReady().
app.commandLine.appendSwitch('disable-background-networking');
app.commandLine.appendSwitch('disable-component-update');
app.commandLine.appendSwitch('disable-domain-reliability');
app.commandLine.appendSwitch('disable-sync');
app.commandLine.appendSwitch('disable-features',
  'OptimizationHints,OptimizationHintsFetching,OptimizationGuideModelDownloading,' +
  'Translate,MediaRouter,DialMediaRouteProvider,AutofillServerCommunication,HttpsUpgrades');

// A dedicated, predictable profile directory: %APPDATA%\VARUGAI on Windows
// (and its equivalent elsewhere), independent of whatever productName the
// packager happens to use, so it never moves across upgrades. The smoke
// test uses an isolated temp profile instead, so repeated test runs never
// depend on (or pollute) a real user's attendance data.
app.setName('VARUGAI');
app.setPath('userData', process.env.VARUGAI_SMOKE_TEST
  ? path.join(app.getPath('temp'), 'varugai-smoke-test-profile')
  : path.join(app.getPath('appData'), 'VARUGAI'));

// This is a single-user local register: two instances writing the same
// localStorage-backed data directory at once is how attendance gets lost.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

registerSchemePrivileges(electronProtocol);

let mainWindow = null;
function getMainWindow() { return mainWindow; }

/* ---------- window position/size memory, with off-screen recovery ---------- */
const STATE_FILE = path.join(app.getPath('userData'), 'window-state.json');
const DEFAULT_STATE = { width: 1280, height: 820, x: undefined, y: undefined, maximized: false };
const MIN_WIDTH = 1024, MIN_HEIGHT = 650;

function loadWindowState() {
  try {
    const raw = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    if (typeof raw === 'object' && raw) return Object.assign({}, DEFAULT_STATE, raw);
  } catch (e) { /* first run or corrupt file: use defaults */ }
  return Object.assign({}, DEFAULT_STATE);
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) return;
  try {
    const bounds = win.getNormalBounds ? win.getNormalBounds() : win.getBounds();
    const state = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      maximized: win.isMaximized(),
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch (e) { /* best effort */ }
}

/** Refuse to place the window where no current display can show it. */
function sanitiseBounds(state) {
  const bounds = { width: state.width, height: state.height, x: state.x, y: state.y };
  bounds.width = Math.max(MIN_WIDTH, Math.min(bounds.width || DEFAULT_STATE.width, 20000));
  bounds.height = Math.max(MIN_HEIGHT, Math.min(bounds.height || DEFAULT_STATE.height, 20000));
  if (typeof bounds.x !== 'number' || typeof bounds.y !== 'number') return bounds;

  const displays = screen.getAllDisplays();
  const onScreen = displays.some((d) => {
    const a = d.workArea;
    return bounds.x + 40 < a.x + a.width && bounds.x + bounds.width - 40 > a.x
      && bounds.y + 20 < a.y + a.height && bounds.y + bounds.height - 20 > a.y;
  });
  if (!onScreen) { delete bounds.x; delete bounds.y; }
  return bounds;
}

function createWindow() {
  const state = loadWindowState();
  const bounds = sanitiseBounds(state);

  const win = new BrowserWindow({
    ...bounds,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    backgroundColor: '#eceee9',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: false,
      spellcheck: false,
      enableWebSQL: false,
      devTools: IS_DEV, // completely disabled in a packaged build, not just hidden
    },
  });

  if (state.maximized) win.maximize();

  win.once('ready-to-show', () => win.show());

  if (process.env.VARUGAI_SMOKE_TEST) {
    // Exercised only by tests/run-tests.js — never set in a normal launch.
    win.webContents.on('console-message', (event) => {
      console.log('[renderer]', event.level, event.message, event.sourceId + ':' + event.lineNumber);
    });
    win.webContents.on('did-fail-load', (_e, code, desc, url) => {
      console.log('[did-fail-load]', code, desc, url);
    });
    win.webContents.on('preload-error', (_e, preloadPath, error) => {
      console.log('[preload-error]', preloadPath, error);
    });
    win.webContents.once('did-finish-load', async () => {
      try {
        const hasBridge = await win.webContents.executeJavaScript(
          '!!(window.VarugaiNative && window.VarugaiNative.version)');
        const ver = await win.webContents.executeJavaScript('window.VarugaiNative.version()');
        const hasApp = await win.webContents.executeJavaScript('!!document.getElementById("nav")');
        console.log('[smoke] bridge present:', hasBridge);
        console.log('[smoke] version():', ver);
        console.log('[smoke] app rendered:', hasApp);

        // Drive a full setup -> roster -> mark -> complete cycle through the
        // page's own functions (top-level `function`/`let` in app.js are
        // visible here, since this runs as a sibling script in the same
        // page realm) to prove the ported app still behaves correctly
        // under the app:// origin, and that an open-vs-complete day still
        // produces the correct denominator (spec's release-blocking rule).
        const functional = await win.webContents.executeJavaScript(`(() => {
          const seen = [];
          // A blocking confirm()/alert() with nobody to click it would hang this
          // headless test forever; auto-accept and log instead, purely for the
          // test harness — the shipped app.js is never modified by this.
          window.confirm = (msg) => { seen.push('confirm:' + msg); return true; };
          window.alert = (msg) => { seen.push('alert:' + msg); };

          $('startDate').value = '2026-02-02';
          $('endDate').value = '2026-02-08';
          $('defHours').value = '1';
          $('genDays').onclick();
          const workingDays = Object.keys(S.days).filter(d => S.days[d].on).sort();
          const openDay = workingDays[0];

          $('hasRegNo').value = '0';
          $('rosterText').value = '1, Alice\\n2, Bob';
          $('impRoster').onclick();

          S.roster.forEach(r => setDay(openDay, r.sid, 'P'));
          save();
          const hoursWhileOpen = totals().map(t => t.h); // must all be 0: open day counts nothing

          S.days[openDay].done = true;
          save();
          const afterComplete = totals().map(t => (t.h ? 100 * t.p / t.h : null));

          return {
            rosterOrder: S.roster.map(r => r.name),
            workingDayCount: workingDays.length,
            hoursWhileOpen,
            afterComplete,
            dialogsSeen: seen,
          };
        })()`);
        console.log('[functional]', JSON.stringify(functional));
      } catch (e) {
        console.log('[smoke] error:', e && e.message);
      } finally {
        setTimeout(() => app.quit(), 300);
      }
    });
  }

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== APP_URL) event.preventDefault();
  });
  win.webContents.on('will-attach-webview', (event) => event.preventDefault());

  // Block accidental data loss / dev-tool exposure in the shipped build.
  win.webContents.on('before-input-event', (event, input) => {
    if (IS_DEV) return;
    const key = (input.key || '').toLowerCase();
    const blockReload = (key === 'r' && (input.control || input.meta)) || key === 'f5';
    const blockDevTools = key === 'f12' || (key === 'i' && input.control && input.shift);
    if (blockReload || blockDevTools) event.preventDefault();
  });

  const persist = () => saveWindowState(win);
  win.on('resize', persist);
  win.on('move', persist);
  win.on('close', persist);

  win.loadURL(APP_URL);

  return win;
}

function buildMenu(win) {
  const aboutDialog = () => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'About VARUGAI 15',
      message: 'VARUGAI 15',
      detail: [
        'Semester Attendance Management System',
        `Version ${app.getVersion()}`,
        '',
        'Department of Zoology',
        'Government Arts and Science College, Nagercoil',
        'Created by R. Ramesh',
        '',
        'Offline desktop application. No data leaves this computer',
        'unless you explicitly export a file.',
      ].join('\n'),
      buttons: ['OK'],
      icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    });
  };

  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit', label: 'Exit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(IS_DEV ? [{ type: 'separator' }, { role: 'reload' }, { role: 'toggleDevTools' }] : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'About VARUGAI 15', click: aboutDialog },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  registerProtocolHandler(electronProtocol);

  mainWindow = createWindow();
  buildMenu(mainWindow);
  registerNativeHandlers(getMainWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow();
      buildMenu(mainWindow);
    }
  });
});

// Belt-and-braces network/permission lockdown, in case a future change ever
// introduces a second window or webContents.
app.on('web-contents-created', (_event, contents) => {
  contents.session.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));
  contents.on('will-navigate', (event, url) => {
    if (url !== APP_URL) event.preventDefault();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
