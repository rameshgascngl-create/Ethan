#!/usr/bin/env python3
"""Fail-closed source gate for the VARUGAI Android release.

This is intentionally stdlib-only so CI can run it before Gradle downloads anything.
It verifies the Android package is shipping the canonical desktop/web academic payload
and preserves release-blocking attendance, privacy, signing and backup invariants.
"""
from pathlib import Path
import hashlib
import sys

ROOT = Path(__file__).resolve().parents[2]
ANDROID = ROOT / "android"
ASSETS = ANDROID / "app" / "src" / "main" / "assets"

failures = []

def require(condition: bool, message: str) -> None:
    if not condition:
        failures.append(message)

def text(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def same_file(a: Path, b: Path, label: str) -> None:
    if not a.is_file() or not b.is_file():
        failures.append(f"{label}: missing file")
        return
    ha = hashlib.sha256(a.read_bytes()).hexdigest()
    hb = hashlib.sha256(b.read_bytes()).hexdigest()
    require(ha == hb, f"{label}: Android asset diverges from canonical source ({ha} != {hb})")
    if ha == hb:
        print(f"PASS {label}: sha256 {ha}")

# The Android APK must contain the exact canonical VARUGAI web application.
same_file(ROOT / "app" / "index.html", ASSETS / "index.html", "canonical index.html")
same_file(ROOT / "app" / "app.js", ASSETS / "app.js", "canonical app.js")
same_file(ROOT / "app" / "styles.css", ASSETS / "styles.css", "canonical styles.css")

manifest = text(ANDROID / "app" / "src" / "main" / "AndroidManifest.xml")
gradle = text(ANDROID / "app" / "build.gradle.kts")
host = text(ANDROID / "app" / "src" / "main" / "java" / "com" / "gasczoology" / "varugai" / "MainActivity.kt")
js = text(ASSETS / "app.js")
html = text(ASSETS / "index.html")
css = text(ASSETS / "styles.css")

# Android identity and release posture.
require('applicationId = "com.gasczoology.varugai"' in gradle, "wrong/missing applicationId")
require('versionCode = 15101' in gradle, "wrong/missing versionCode")
require('versionName = "15.1.1"' in gradle, "wrong/missing versionName")
require('minSdk = 24' in gradle, "wrong/missing minSdk")
require('targetSdk = 36' in gradle, "wrong/missing targetSdk")
require('compileSdk = 36' in gradle, "wrong/missing compileSdk")
require('System.getenv("VARUGAI_KEYSTORE_FILE")' in gradle, "release keystore file is not injected from CI")
require('System.getenv("VARUGAI_KEYSTORE_PASSWORD")' in gradle, "keystore password is not injected from CI")
require('System.getenv("VARUGAI_KEY_ALIAS")' in gradle, "key alias is not injected from CI")
require('System.getenv("VARUGAI_KEY_PASSWORD")' in gradle, "key password is not injected from CI")

# Privacy/security: the installed APK must be structurally offline.
require('android.permission.INTERNET' not in manifest, "INTERNET permission declared")
require('<uses-permission' not in manifest, "unexpected Android permission declared")
require('android:allowBackup="false"' in manifest, "cloud/device backup must be disabled for attendance data")
require('android:usesCleartextTraffic="false"' in manifest, "cleartext traffic is not explicitly disabled")
require('WebViewAssetLoader' in host, "WebViewAssetLoader missing")
require('allowFileAccess = false' in host, "WebView file access must be disabled")
require('mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW' in host, "mixed content must be blocked")
require('setGeolocationEnabled(false)' in host, "geolocation must be disabled")
require('WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)' in host, "WebView debugging must be release-disabled")
require('External navigation is blocked in VARUGAI' in host, "external navigation block missing")
require('addJavascriptInterface(VarugaiBridge(), "VarugaiAndroid")' in host, "expected narrow native bridge missing")
require('fun saveExcel' not in host, "Android bridge must not expose saveExcel; generic MIME-aware saveBase64 must be used")
require('fun saveBase64' in host and 'fun printPage' in host and 'fun recoverySnapshot' in host,
        "required native bridge methods missing")


# Device-QA regression gate for the native inset correction.
require('val rootContainer = FrameLayout(this)' in host, "inset-aware native root container missing")
require('webView.setPadding(0, 0, 0, 0)' in host, "WebView must remain unpadded by handled system-bar insets")
require('ViewCompat.setOnApplyWindowInsetsListener(rootContainer)' in host,
        "window inset listener must be attached to the native root container")
require('ViewCompat.setOnApplyWindowInsetsListener(webView)' not in host,
        "system-bar insets must not be applied directly to WebView")
require('WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()' in host,
        "system-bar/display-cutout inset mask missing")
require('view.setPadding(safe.left, safe.top, safe.right, safe.bottom)' in host,
        "safe insets are not applied to the native root container")
require('.setInsets(handledInsetTypes, Insets.NONE)' in host,
        "handled native insets are not coordinated before child dispatch")
require('ViewCompat.requestApplyInsets(rootContainer)' in host,
        "root container does not request dynamic inset application")
require('onBackPressedDispatcher.addCallback' in host and 'handleNormalBack()' in host,
        "Android Back handling changed or missing")

# The web navigation payload must remain unchanged and fixed at the viewport bottom.
for tab in ('setup', 'roster', 'grid', 'summary', 'data'):
    require(f'data-t="{tab}"' in html, f"missing bottom navigation tab: {tab}")
require('class="tabs" id="nav"' in html, "bottom navigation container missing")
require('position:fixed' in css.replace(' ', ''), "fixed-bottom navigation positioning missing")
require('bottom:0' in css.replace(' ', ''), "bottom navigation no longer anchored at bottom:0")

# Browser-side network lock.
require("connect-src 'none'" in html, "CSP connect-src is not locked to none")
require("object-src 'none'" in html, "CSP object-src is not locked to none")
require("frame-src 'none'" in html, "CSP frame-src is not locked to none")

# Release-blocking attendance logic.
require("if(!S.days[d].done)return;                 // open days never count" in js,
        "open-day denominator exclusion changed")
require("else if(v==='O'){out[i].p++;out[i].od++;out[i].eq+=1/n;}" in js,
        "OD no longer counts as present")
require("if(!inRoll(r,d))return;" in js, "enrolment-date denominator gate missing")
require("Completing the day records them ABSENT" in js, "completion blank-to-absence safeguard changed")

# Backup compatibility and tamper detection.
require("format:'varugai-backup',schema:2" in js, "backup format/schema identity changed")
require('checksum:fnv(payload)' in js, "backup checksum generation missing")
require('raw.checksum&&raw.checksum!==sum' in js, "backup checksum validation missing")
require("const APPVER='15.1.0'" in js,
        "canonical web payload version changed; native 15.1.1 correction must not modify the web application payload")

if failures:
    print("\nRELEASE SOURCE GATE: FAIL", file=sys.stderr)
    for item in failures:
        print(f" - {item}", file=sys.stderr)
    sys.exit(1)

print("\nRELEASE SOURCE GATE: PASS")
