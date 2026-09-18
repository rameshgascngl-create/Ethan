#!/usr/bin/env python3
from pathlib import Path

path = Path("android/app/src/main/java/com/gasczoology/varugai/MainActivity.kt")
s = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str) -> None:
    global s
    count = s.count(old)
    if count != 1:
        raise SystemExit(f"instrumentation anchor {label!r} expected once, found {count}")
    s = s.replace(old, new, 1)

replace_once(
    "import android.content.Context\n",
    "import android.content.Context\nimport android.content.res.Configuration\n",
    "Configuration import",
)
replace_once(
    "import android.util.Base64\n",
    "import android.util.Base64\nimport android.util.Log\n",
    "Log import",
)
replace_once(
    "        private const val EXIT_WINDOW_MS = 2200L\n",
    "        private const val EXIT_WINDOW_MS = 2200L\n        private const val DIAG_TAG = \"VARUGAI_DIAG\"\n",
    "diagnostic tag",
)

old_insets = '''        ViewCompat.setOnApplyWindowInsetsListener(webView) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            insets
        }
'''
new_insets = '''        ViewCompat.setOnApplyWindowInsetsListener(webView) { view, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            val cutout = insets.getInsets(WindowInsetsCompat.Type.displayCutout())
            diagnosticRecord(
                "INSETS_CALLBACK orientation=${diagnosticOrientation()} " +
                    "bars=${bars.left},${bars.top},${bars.right},${bars.bottom} " +
                    "cutout=${cutout.left},${cutout.top},${cutout.right},${cutout.bottom} " +
                    "paddingBefore=${view.paddingLeft},${view.paddingTop},${view.paddingRight},${view.paddingBottom}"
            )
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            view.postDelayed({ dumpDiagnosticGeometry("insetsApplied") }, 250L)
            insets
        }
'''
replace_once(old_insets, new_insets, "window inset listener")

replace_once(
    "                super.onPageFinished(view, url)\n",
    "                super.onPageFinished(view, url)\n                view.postDelayed({ dumpDiagnosticGeometry(\"pageFinished\") }, 500L)\n",
    "page-finished diagnostic",
)

helper = r'''
    private fun diagnosticOrientation(): String = when (resources.configuration.orientation) {
        Configuration.ORIENTATION_PORTRAIT -> "portrait"
        Configuration.ORIENTATION_LANDSCAPE -> "landscape"
        else -> "undefined"
    }

    private fun diagnosticRecord(message: String) {
        Log.i(DIAG_TAG, message)
        try {
            File(filesDir, DIAG_FILE).appendText(
                "${System.currentTimeMillis()} $message\\n",
                Charsets.UTF_8
            )
        } catch (_: Exception) {
            // Diagnostic evidence only; never affect app behaviour.
        }
    }

    private fun dumpDiagnosticGeometry(reason: String) {
        if (!::webView.isInitialized) return
        val orientation = diagnosticOrientation()
        val rootInsets = ViewCompat.getRootWindowInsets(webView)
        val bars = rootInsets?.getInsets(WindowInsetsCompat.Type.systemBars())
        val cutout = rootInsets?.getInsets(WindowInsetsCompat.Type.displayCutout())
        diagnosticRecord(
            "NATIVE reason=$reason orientation=$orientation " +
                "measuredWidth=${webView.measuredWidth} measuredHeight=${webView.measuredHeight} " +
                "width=${webView.width} height=${webView.height} " +
                "paddingLeft=${webView.paddingLeft} paddingTop=${webView.paddingTop} " +
                "paddingRight=${webView.paddingRight} paddingBottom=${webView.paddingBottom} " +
                "systemBars=${bars?.left ?: -1},${bars?.top ?: -1},${bars?.right ?: -1},${bars?.bottom ?: -1} " +
                "displayCutout=${cutout?.left ?: -1},${cutout?.top ?: -1},${cutout?.right ?: -1},${cutout?.bottom ?: -1}"
        )

        val script = """
            (function(){
              var n=document.getElementById('nav');
              var cs=n?window.getComputedStyle(n):null;
              var r=n?n.getBoundingClientRect():null;
              var vv=window.visualViewport;
              return JSON.stringify({
                navExists:!!n,
                display:cs?cs.display:null,
                visibility:cs?cs.visibility:null,
                position:cs?cs.position:null,
                bottom:cs?cs.bottom:null,
                height:cs?cs.height:null,
                zIndex:cs?cs.zIndex:null,
                rect:r?{top:r.top,bottom:r.bottom,height:r.height,left:r.left,right:r.right,width:r.width}:null,
                innerWidth:window.innerWidth,
                innerHeight:window.innerHeight,
                clientWidth:document.documentElement.clientWidth,
                clientHeight:document.documentElement.clientHeight,
                visualViewport:vv?{
                  width:vv.width,
                  height:vv.height,
                  offsetTop:vv.offsetTop,
                  offsetLeft:vv.offsetLeft,
                  scale:vv.scale
                }:null
              });
            })();
        """.trimIndent()

        webView.evaluateJavascript(script) { result ->
            diagnosticRecord("WEB reason=$reason orientation=$orientation result=$result")
        }
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus && ::webView.isInitialized) {
            webView.postDelayed({ dumpDiagnosticGeometry("windowFocus") }, 500L)
        }
    }

    private fun handleNormalBack() {\n",
    helper + "    private fun handleNormalBack() {\n",
    "geometry helper insertion",
)

path.write_text(s, encoding="utf-8")
print(f"Diagnostic instrumentation injected into {path}")
