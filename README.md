# VARUGAI 15 — Windows Desktop Application

Semester Attendance Management System, packaged as a genuine offline Windows
desktop application with Electron. Department of Zoology, Government Arts
and Science College, Nagercoil. Created by R. Ramesh.

This is **not** a browser shortcut and **not** a PWA. It is an installable
Windows app with its own Start Menu entry, its own process, its own stable
local storage origin, and zero network dependency.

## What this is

- The attendance logic, calculations, calendar, roster, summary, integrity
  checks and correction log are the original `VARUGAI_15_Semester_Grid`
  application (`app/index.html` + `app/app.js` + `app/styles.css`), split
  into external files only so a strict Content-Security-Policy could drop
  `script-src 'unsafe-inline'` entirely. No attendance calculation, no
  denominator rule, and no data schema was changed.
- Two small, clearly-marked additions were made to `app/app.js` for desktop
  compatibility (see "What was added" below); everything else is the
  original source, byte-for-byte.
- `electron/` is the desktop shell: window creation, a locked-down
  `app://varugai/` origin, a narrow native bridge, and Windows packaging.

## Project layout

```
package.json           npm scripts + electron-builder configuration
electron/
  main.js               app lifecycle, window, menu, security policy
  preload.js             contextBridge: the only thing exposed to the page
  protocol.js             registers and serves the app://varugai origin
  native-services.js       file save / print / PDF / recovery snapshots
app/
  index.html              original UI markup (CSP added, one new button)
  app.js                   original application logic (two small additions)
  styles.css               original stylesheet, unchanged
assets/
  icon.ico, icon.png, icons/   generated, multi-size Windows icon
tests/
  run-tests.js             version/backup/CSP checks + a real Electron boot
scripts/
  generate-icons.js        builds icon.ico/png from nothing (no image libs)
  syntax-check.js          node --check across every shipped script
  make-checksums.js        SHA-256SUMS.txt for the built artifacts
.github/workflows/
  windows-build.yml        builds Setup/Portable/unpacked on windows-latest
```

## Building

Requires Node.js 18+. All packaging dependencies are `devDependencies` —
the shipped app itself has **zero** npm dependencies at runtime.

```bash
npm install
npm test                 # syntax check + backup/CSP guards + Electron boot test
npm run dist:win         # Setup.exe + Portable.exe + unpacked dir, all in release/
npm run checksums        # writes release/SHA-256SUMS.txt
```

`npm run dist:win` produces, under `release/`:

- `VARUGAI-15.1.0-Setup.exe` — NSIS installer. Per-user install (no admin
  rights required), lets the user choose the install folder, creates a
  Start Menu entry and an optional Desktop shortcut, and **never** touches
  `%APPDATA%\VARUGAI` on install, upgrade, or uninstall.
- `VARUGAI-15.1.0-Portable.exe` — a single portable executable, no
  installation step.
- `win-unpacked/` — the raw unpacked Windows build.

Building the NSIS installer and the portable target requires Windows (or
Wine on Linux/macOS); the GitHub Actions workflow builds all three targets
natively on `windows-latest` on every push/PR/tag and on manual dispatch,
and uploads the installers, the unpacked build (zipped), a source archive,
and `SHA-256SUMS.txt` as build artifacts.

The unpacked `--win dir` target *was* built and smoke-tested during
development of this project directly in this (Linux) environment — it
needs no Wine, since it is a plain file copy — confirming the
`electron-builder` configuration, `app.asar` contents, and icon embedding
are all correct ahead of the first Windows CI run.

## Security model

- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`,
  no `webviewTag`, no remote module.
- The renderer only ever sees `window.VarugaiNative` (and the identically-
  shaped `window.VarugaiAndroid` alias, for source compatibility with the
  code that already looks for either name). Both are built with
  `contextBridge.exposeInMainWorld` in `electron/preload.js` — nothing else
  crosses the isolation boundary.
- Every native call is handled in the main process
  (`electron/native-services.js`), which sanitises filenames to a bare
  name (no path component can be injected from the renderer), bounds
  payload sizes, and always routes the actual filesystem destination
  through a native "Save As" dialog the user drives.
- New windows, external navigation, permission requests (camera, mic,
  geolocation, notifications, …) and `<webview>` attachment are all denied
  at the Electron level, globally, not just for the main window.
- Content-Security-Policy (`app/index.html`):
  `default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline';
  img-src 'self' data:; font-src 'self'; connect-src 'none';
  object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'`.
  `connect-src 'none'` means the page cannot make a network request even if
  it tried — `fetch`, `XMLHttpRequest` and WebSocket are all blocked by the
  browser engine itself, not just by the absence of an internet connection.
  `style-src` keeps `'unsafe-inline'` because the app extensively uses
  inline `style="…"` attributes in both static and dynamically generated
  markup; rewriting all of that into class-based CSS was judged too high a
  regression risk for a packaging task and was intentionally left alone
  (see spec §28, option B). `script-src` has **no** `unsafe-inline` and no
  `unsafe-eval` — all logic runs from the external, CSP-covered `app.js`.
- The UI is served from a registered, privileged `app://varugai/` origin
  (`electron/protocol.js`), not from `file://`. This keeps `localStorage`
  behaviour stable across Electron/Chromium upgrades and confines file
  reads to the `app/` folder inside the package (path traversal is
  rejected explicitly).
- Devtools and the reload/`F5`/`Ctrl+R` shortcuts are disabled entirely in
  a packaged build (`app.isPackaged`); they remain available when running
  from source for development.

## Data and storage

- Attendance data continues to live in `localStorage` under the
  `app://varugai/` origin, using the same `varugai.v15.*` keys and the same
  state shape as the original app. Electron's profile (which is where that
  storage physically lives) is pinned to `%APPDATA%\VARUGAI` via
  `app.setPath('userData', …)`, independent of the installer's product
  name, so it never moves across an upgrade.
- **Recovery snapshots** (spec §19): every successful `save()` additionally
  asks the main process, over the native bridge, to write an atomic
  snapshot to `%APPDATA%\VARUGAI\Recovery\`. Each write goes to a temp file
  in the same directory, is `fsync`'d, closed, and then renamed into place
  — the existing snapshot set is never edited in place. The last 15
  snapshots per register are kept; older ones are pruned after each
  successful write. This is a safety net only and never changes what
  `localStorage` holds or what a JSON backup contains.
- **JSON backup format is unchanged**: `{"format":"varugai-backup",
  "schema":2, "appVersion":"15.1.0", "checksum": <FNV-1a of the payload>,
  "data": {...}}`. Checksum validation and schema/newer-version rejection
  are exactly as in the source; `tests/run-tests.js` asserts these markers
  are present so a future change cannot silently break backup
  compatibility.
- **"Save statement as PDF"** (spec §25) is additive: a new button next to
  the existing "Print" and "Save as a file" controls, calling
  `webContents.printToPDF()` on the current statement view (A4, no
  margins beyond the page's own `@page{margin:12mm}` rule) and writing the
  result through the same native Save-As flow as every other export.
  Nothing existing was removed or altered.

## What was added to `app/app.js` (the only logic-level changes)

1. `snapshotRecovery()` — called at the end of the existing `save()`
   function. It is wrapped in `try/catch`, feature-detects the native
   bridge, and is a complete no-op in a plain browser; it cannot affect
   whether `save()` itself succeeds.
2. The `stPdf` button handler, mirroring the existing `stSave` handler.
3. `stSave`'s handler was changed from reading `document.querySelectorAll('style')`
   (which returned nothing once the CSS moved to an external `styles.css`
   file) to a `STYLE_CSS` constant holding the same CSS text, so the
   self-contained HTML statement it exports keeps working exactly as
   before.

No calculation, no threshold, no denominator rule, no roster/calendar
workflow, and no keyboard/UI behaviour was changed.

## Offline guarantee

There is no code path in `app/`, `electron/`, or the packaged app that
makes a network request: the CSP blocks it at the renderer, and the main
process never calls `fetch`/`http`/`https`/`net`. The app was smoke-tested
launching, rendering, and completing a native-bridge round trip with no
CSP violations (`tests/run-tests.js`).

## Version

`15.1.0` everywhere: `package.json`, the in-app `APPVER` constant used for
JSON backups, the Setup/Portable artifact filenames, and the About dialog
(which reads `app.getVersion()` from the packaged `package.json` at
runtime rather than a hard-coded string, so it cannot drift).
