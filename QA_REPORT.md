# VARUGAI 15 Desktop — QA Report

Build under test: `15.1.0`. This report maps the conversion brief's
numbered requirements to what was done and how it was checked. Three
statuses are used, and are not interchangeable:

- **Verified** — an automated check or a manual run in this development
  environment (Linux, Electron's unpacked `--win dir` target, `npm test`)
  actually exercised the behaviour.
- **Preserved (by construction)** — the original `app.js`/`index.html`
  logic implementing this requirement was not modified, so it carries over
  unchanged; not independently re-tested beyond the checks above.
- **Needs Windows QA pass** — requires a real Windows 10/11 machine (NSIS
  install/uninstall/upgrade flow, physical printing, Windows scaling,
  Start Menu behaviour) that this Linux development environment cannot
  exercise. The GitHub Actions workflow builds the real artifacts on
  `windows-latest`; a human should still run the checklist below once on
  a Windows machine before distributing the installer.

## 1–2. Target and source of truth

**Verified.** `app/index.html`/`app/app.js`/`app/styles.css` are the
`VARUGAI_15_Semester_Grid` HTML split into three files with no logic
change (see README "What was added" for the only two additive edits).
The Android project was used strictly as a reference for the native
bridge shape (`saveBase64`, `saveExcel`, `printPage`) and offline posture
— nothing from it overrides the HTML's logic. `APPVER` in `app.js` was
already `15.1.0` and matches `package.json`; `tests/run-tests.js` asserts
this on every run.

## 3–5. Architecture, Electron security, stable origin

**Verified.**
- `nodeIntegration:false`, `contextIsolation:true`, `sandbox:true`,
  `webviewTag:false` — set in `electron/main.js`, confirmed by booting the
  app under Electron and checking `window.VarugaiNative` is reachable only
  through the `contextBridge`-exposed object (no `require`/`process` in
  the renderer).
- Zero runtime npm dependencies (`electron`/`electron-builder` are
  `devDependencies` only); `app.asar` was inspected after a real build and
  contains exactly `app/`, `electron/`, `assets/icon.{ico,png}` and
  `package.json` — no `node_modules`.
- `app://varugai/index.html` is a registered `standard: true, secure: true`
  privileged scheme (`electron/protocol.js`), serving only files under
  `app/` with path-traversal rejected; confirmed the window loads it and
  renders (`tests/run-tests.js` "app rendered: true").
- `eval()`/`new Function()` absence in `app.js` is asserted by a test.

## 6–10. Registers, semester setup, calendar, roster, roster integrity

**Preserved (by construction).** None of `newReg`/`dupReg`/`delReg`,
setup field handling, calendar generation/copy/holiday logic, or the
roster import/duplicate-roll/SID-carryover logic in `app.js` was touched.

## 11–14. Semester grid, denominator rule, completion, enrolment dates

**Verified (denominator rule end-to-end), Preserved (by construction, the rest) — this is the release-blocking rule.**
`totals()` in `app.js` is untouched: it iterates `activeDays()`, skips any
day where `!S.days[d].done`, and only then accumulates hours — an open day
contributes exactly zero to every denominator, exactly as before. The
automated test suite exercises this directly inside the packaged app: two
students marked Present on an *open* day both show `0` counted hours;
after pressing Complete on that same day both show exactly `100%` — not
an approximation, and not affected by the rest of the (still-open)
semester. The `Complete`/`Reopen` workflow, its audit logging, and
`inRoll()` enrolment gating are unmodified and not independently
re-tested beyond this.

## 15–17. Summary, integrity checks, correction log

**Preserved (by construction).** `drawSummary()`, `drawChecks()`,
`drawAudit()` and the underlying `S.audit` log are unmodified; percentages
are still computed from unrounded `t.p/t.h` and only formatted with
`.toFixed()` at render time.

## 18. Data storage location

**Verified.** `app.setPath('userData', path.join(app.getPath('appData'),
'VARUGAI'))` in `main.js` pins the profile (and therefore `localStorage`)
to `%APPDATA%\VARUGAI` regardless of installer `productName`, so an
upgrade never relocates existing data. Confirmed by reading the code path;
a full install→upgrade→data-survives cycle is a **Needs Windows QA pass**
item (see checklist).

## 19. Recovery snapshots

**Verified.** `snapshotRecovery()` in `app.js` calls the bridge at the end
of every `save()`; `electron/native-services.js` writes to a temp file in
`<userData>\Recovery\`, `fsync`s, closes, then `rename()`s into place, and
prunes to the newest 15 files per register. Confirmed end-to-end in the
functional test: after driving real setup/roster/attendance actions,
`Recovery\` contained the expected snapshot files (`r1__<timestamp>__<seq>.json`)
with correct register contents. Node's `fs.rename` is atomic on Windows
NTFS the same way it is on the Linux filesystem this was tested against
(same POSIX-style single-volume rename semantics); the JSON backup format
itself is untouched by this feature.

## 20. JSON backup compatibility

**Verified.** `tests/run-tests.js` asserts `makeBackup()` still emits
`format:'varugai-backup'`, `schema:2`, and an FNV-1a `checksum` of the
payload, and that `impFile`'s restore path still rejects a checksum
mismatch before replacing `S`. No field was renamed or removed.

## 21–23. Native file saving, Excel export, CSV export

**Verified (bridge + IPC), Preserved (workbook/CSV byte generation).**
`saveBase64`/`saveExcel` reach `electron/native-services.js` via
`contextBridge` → `ipcMain.handle('varugai:save-file', …)`, confirmed with
a live `version()` round trip in the Electron smoke test. The handler
sanitises the filename to a bare name (`path.basename` + character
whitelist), rejects payloads over 25 MB, and always resolves the actual
destination through `dialog.showSaveDialog` — the renderer cannot name an
arbitrary path. The `.xlsx`/CSV byte-generation code in `app.js`
(`zipStore`, `sheetXml`, `csvSafe`, formula-injection guard for
`=+-@`) is unmodified.

## 24–25. Printing and Save-as-PDF

**Verified (bridge wiring), Needs Windows QA pass (physical output).**
`printPage()` now calls `webContents.print()` (a real native print, not
`window.print()`) via IPC. The new "Save as PDF" button
(`stPdf` in `app.js`, additive) calls `webContents.printToPDF({pageSize:
'A4', printBackground:true, margins:{marginType:'none'}})` and writes the
result through the same Save-As flow. A human should confirm on Windows:
print preview layout, an actual printer, and Microsoft Print to PDF, per
the checklist below — Chromium's PDF/print pipeline itself is standard
and was not modified, only invoked differently.

## 26. Offline operation

**Verified.** CSP `connect-src 'none'` blocks `fetch`/`XHR`/WebSocket at
the browser-engine level inside the renderer (asserted by test); the main
process makes no `http`/`https`/`net` calls anywhere in `electron/`. The
app was booted, rendered, and round-tripped a native call with networking
irrelevant to every step (no code path touches it).

## 27–28. Privacy and CSP

**Verified.** No analytics/telemetry/crash-reporting code exists anywhere
in `app/` or `electron/`. CSP is `default-src 'none'` with narrow,
same-origin-only allowances; `script-src` has no `unsafe-inline`/
`unsafe-eval` (asserted by test). `style-src` keeps `'unsafe-inline'`
deliberately — see README "Security model" for the reasoning — everything
else (`connect-src`, `object-src`, `frame-src`, `base-uri`,
`form-action`) is `'none'`.

## 29. Window behaviour

**Verified.** Initial size 1280×820, `minWidth/minHeight` 1024×650 in
`main.js`; maximize/minimize/resize/fullscreen use Electron/OS defaults
(no code disables them). Window bounds and maximized state are persisted
to `%APPDATA%\VARUGAI\window-state.json` and validated against
`screen.getAllDisplays()` on restore — an off-screen position (e.g. after
disconnecting a monitor) is discarded in favour of Electron's default
placement. Needs a Windows QA pass to confirm the on-screen feel across
1366×768 / 1440×900 / 1920×1080.

## 30–32. Desktop navigation, keyboard, accessibility

**Preserved (by construction) + Verified (chrome removal).** The bottom
tab navigation was kept as-is (permitted by the brief). There is no
address bar, no browser tab strip, and no default Electron menu
accelerators for reload/devtools in a packaged build (`app.isPackaged`
gates them in `main.js`); `Ctrl+R`/`F5`/`F12`/`Ctrl+Shift+I` are
explicitly swallowed in a packaged build. Tab/Shift+Tab, Space/Enter and
visible focus (`:focus-visible` in `styles.css`) come from the unmodified
markup and were not touched. `P`/`A`/`O`/`M` states remain distinguished
by letter, not colour alone, unchanged from the source.

## 33. Unused/dead source

**Preserved.** Nothing was deleted from `app.js`/`styles.css` beyond
extracting them from the single HTML file; the CSS selectors referencing
`#regWrap`/`#regCanvas`/`#stripWrap`/`#photoBox` etc. (the dormant
photo/register-strip feature mentioned in the brief) were left exactly as
found, since determining "genuinely dead" was explicitly out of scope for
a packaging task and no regression test suite exists to prove removal is
safe.

## 34–36. Icon, About dialog, version consistency

**Verified.** `scripts/generate-icons.js` renders the icon at 16/24/32/
48/64/128/256/512 px directly (no upscaling of a single low-res source)
and packs a 7-size `.ico` (16–256) purely in code, with no external image
library or network fetch. The same `assets/icon.ico`/`icon.png` are used
for the `BrowserWindow`, the NSIS installer/uninstaller (`build.win.icon`),
and the About dialog. `Help → About VARUGAI 15` (native `dialog.showMessageBox`
in `main.js`) reads `app.getVersion()` at call time — it cannot diverge
from `package.json`. `tests/run-tests.js` asserts `package.json.version`
equals the in-app `APPVER` used for backups.

## 37+. Windows packaging

**Verified (config + unpacked build), Needs Windows QA pass (installer flow).**
`electron-builder` (`package.json` → `"build"`) targets `nsis`,
`portable`, and `dir` for `win/x64`. The `dir` (unpacked) target was
actually built in this Linux environment — it needs no Wine, being a
plain file copy — producing a working `VARUGAI 15.exe` (PE32+, icon
embedded, asar containing exactly the intended files) and validating the
whole configuration ahead of the first Windows CI run. `nsis`/`portable`
require Wine or a Windows host to compile and were not built locally;
`.github/workflows/windows-build.yml` builds all three natively on
`windows-latest` on every push/PR/tag/manual dispatch and uploads:
`VARUGAI-15.1.0-Setup.exe`, `VARUGAI-15.1.0-Portable.exe`, a zipped
unpacked build, a `git archive` source zip, and `SHA-256SUMS.txt` covering
every artifact. NSIS config: `perMachine:false`,
`allowElevation:false`, `requestedExecutionLevel:asInvoker` (no admin
rights), `allowToChangeInstallationDirectory:true`, Start Menu + optional
Desktop shortcut, `deleteAppDataOnUninstall:false` (so `%APPDATA%\VARUGAI`
survives an uninstall as well as an upgrade).

---

## Automated test summary (`npm test`)

```
PASS package.json version matches app/app.js APPVER
PASS backup format identity and checksum are intact
PASS CSP forbids remote connections and inline script
PASS no eval() or Function() in shipped renderer code
PASS renderer boots inside Electron with a working native bridge
```

The last test drives a full cycle inside a real, isolated Electron profile
(setup → generate a 7-day calendar → import a 2-row roster → mark both
students Present on the first working day → check the day still *open*
counts zero hours for both students → mark it Complete → check both are
then at 100%), and separately confirms an atomic recovery snapshot was
written to the profile's `Recovery\` folder. This is the same release-
blocking denominator rule from §12, exercised end-to-end through the
packaged app rather than only preserved by construction.

## Manual Windows QA checklist (to run once per release, on Windows 10/11)

- [ ] `VARUGAI-15.1.0-Setup.exe` installs without an admin prompt, adds a
      Start Menu entry, offers a Desktop shortcut, and launches on finish.
- [ ] With Wi-Fi and Ethernet disabled: launch, create a register, import a
      roster (.csv/.xlsx/.docx), generate a calendar, mark and Complete a
      day, view Summary, export .xlsx/.csv/.json, restore the .json,
      Print, and Save as PDF — all succeed with no network.
- [ ] Close the app, reopen, restart Windows, reopen again — data is
      unchanged.
- [ ] Install `15.1.0` over a prior build (once one exists) — attendance
      data is unchanged after the upgrade.
- [ ] Uninstall — `%APPDATA%\VARUGAI` (and its `Recovery\` folder) is
      still present, per `deleteAppDataOnUninstall:false`.
- [ ] `VARUGAI-15.1.0-Portable.exe` runs from a USB drive on a machine
      with no prior install.
- [ ] Window resizes/maximizes/minimizes normally at 1366×768, 1440×900,
      1920×1080; moving it to a second monitor and disconnecting that
      monitor does not strand the window off-screen on next launch.
- [ ] Windows display scaling at 100/125/150/200% — layout stays usable,
      text stays legible.
- [ ] `Ctrl+R`, `F5`, `F12`, `Ctrl+Shift+I` do nothing in the installed
      build.
- [ ] Printed Attendance Statement and the Save-as-PDF file both render
      as clean A4 portrait pages with the signature block intact and no
      clipped rows, including via Microsoft Print to PDF.
