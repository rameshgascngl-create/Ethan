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
adb shell svc power stayon true || true
adb shell input keyevent KEYCODE_WAKEUP || true
adb shell locksettings set-disabled true || true
adb shell wm dismiss-keyguard || true
adb shell settings put secure immersive_mode_confirmations confirmed || true
adb shell settings put system accelerometer_rotation 0 || true
adb shell input keyevent 82 || true

adb install -r "$APK"

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

wait_for_orientation() {
  local want="$1"
  local i
  for i in $(seq 1 30); do
    if adb shell dumpsys activity top 2>/dev/null | grep -m1 'mCurrentConfig=' | grep -q "$want"; then
      return 0
    fi
    sleep 1
  done
  echo "Timed out waiting for orientation marker: $want" >&2
  adb shell dumpsys activity top >&2 || true
  return 1
}

dismiss_system_overlays() {
  adb shell settings put secure immersive_mode_confirmations confirmed || true
  adb shell wm dismiss-keyguard || true
  adb shell input keyevent KEYCODE_BACK || true
  sleep 1
}

capture_stage() {
  local name="$1"
  dismiss_system_overlays
  adb exec-out screencap -p > "$OUT/${name}.png"
  adb shell dumpsys window > "$OUT/${name}-window.txt" || true
  adb shell dumpsys activity top > "$OUT/${name}-activity.txt" || true
  adb shell dumpsys display > "$OUT/${name}-display.txt" || true
  adb logcat -d -v threadtime VARUGAI_DIAG:I '*:S' > "$OUT/${name}-geometry.log" || true
}

lock_rotation() {
  local rot="$1"
  adb shell wm user-rotation lock "$rot" 2>/dev/null || {
    adb shell settings put system accelerometer_rotation 0 || true
    adb shell settings put system user_rotation "$rot" || true
  }
}

launch_in_orientation() {
  local rot="$1"
  local marker="$2"
  local name="$3"
  lock_rotation "$rot"
  adb shell am force-stop "$PKG"
  adb logcat -c
  adb shell am start -W -n "$PKG/$ACTIVITY" > "$OUT/${name}-launch.txt"
  wait_for_orientation "$marker"
  sleep 3
  capture_stage "$name"
}

launch_in_orientation 0 " port " portrait
launch_in_orientation 1 " land " landscape

adb logcat -c
lock_rotation 0
wait_for_orientation " port "
sleep 3
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

cat "$OUT/device.txt"
cat "$OUT/geometry-comparison.txt"
