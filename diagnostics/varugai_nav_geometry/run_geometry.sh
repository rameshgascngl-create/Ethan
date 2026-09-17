#!/usr/bin/env bash
set -euo pipefail

OUT="diagnostics/varugai_nav_geometry/evidence"
APK="android/app/build/outputs/apk/debug/app-debug.apk"
PKG="com.gasczoology.varugai.debug"
ACTIVITY="com.gasczoology.varugai.MainActivity"
mkdir -p "$OUT"

if [[ ! -s "$APK" ]]; then
  echo "Diagnostic APK not found: $APK" >&2
  exit 1
fi

adb wait-for-device
adb shell input keyevent 82 || true
adb install -r "$APK"

# Force classic three-button navigation when the emulator image exposes the
# standard SystemUI navbar overlays. Keep fallbacks non-fatal because overlay
# package names vary by API/system image.
adb shell cmd overlay enable-exclusive --category com.android.internal.systemui.navbar.threebutton || \
adb shell cmd overlay enable --user 0 com.android.internal.systemui.navbar.threebutton || true
adb shell settings put secure navigation_mode 0 || true
sleep 2

{
  echo "=== DEVICE ==="
  adb shell getprop ro.build.version.release
  adb shell getprop ro.build.version.sdk
  adb shell wm size
  adb shell wm density
  echo "navigation_mode=$(adb shell settings get secure navigation_mode 2>/dev/null || true)"
  echo "=== NAVBAR OVERLAYS ==="
  adb shell cmd overlay list 2>/dev/null | grep -E 'navbar|gestural|threebutton|twobutton' || true
} > "$OUT/device.txt"

capture_stage() {
  local name="$1"
  adb exec-out screencap -p > "$OUT/${name}.png"
  adb shell dumpsys window > "$OUT/${name}-window.txt" || true
  adb shell dumpsys activity top > "$OUT/${name}-activity.txt" || true
  adb shell dumpsys display > "$OUT/${name}-display.txt" || true
  adb logcat -d -v threadtime VARUGAI_DIAG:I '*:S' > "$OUT/${name}-geometry.log" || true
}

launch_stage() {
  local rotation="$1"
  local name="$2"
  adb shell settings put system accelerometer_rotation 0
  adb shell settings put system user_rotation "$rotation"
  adb shell am force-stop "$PKG"
  adb logcat -c
  adb shell am start -W -n "$PKG/$ACTIVITY" > "$OUT/${name}-launch.txt"
  sleep 5
  capture_stage "$name"
}

# 0 = portrait, 1 = 90-degree landscape on standard emulator images.
launch_stage 0 portrait

# Rotate the running application rather than relaunching from scratch so the
# evidence also captures the normal Android configuration-change path.
adb logcat -c
adb shell settings put system user_rotation 1
sleep 5
capture_stage landscape

# Return to portrait to verify the geometry after a full rotation cycle.
adb logcat -c
adb shell settings put system user_rotation 0
sleep 5
capture_stage portrait-return

{
  echo "=== PORTRAIT ==="
  cat "$OUT/portrait-geometry.log"
  echo
  echo "=== LANDSCAPE ==="
  cat "$OUT/landscape-geometry.log"
  echo
  echo "=== PORTRAIT RETURN ==="
  cat "$OUT/portrait-return-geometry.log"
} > "$OUT/geometry-comparison.txt"

cat "$OUT/geometry-comparison.txt"
