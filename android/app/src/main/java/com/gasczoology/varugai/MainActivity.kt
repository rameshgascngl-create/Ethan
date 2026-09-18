package com.gasczoology.varugai

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.print.PrintAttributes
import android.print.PrintManager
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.graphics.Insets
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewAssetLoader
import java.io.File
import java.io.FileOutputStream
import java.nio.charset.StandardCharsets
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicLong

class MainActivity : AppCompatActivity() {

    companion object {
        private const val APP_ORIGIN = "https://appassets.androidplatform.net"
        private const val START_URL = "$APP_ORIGIN/assets/index.html"
        private const val MAX_EXPORT_BYTES = 40 * 1024 * 1024
        private const val MAX_RECOVERY_BYTES = 8 * 1024 * 1024
        private const val EXIT_WINDOW_MS = 2200L
    }

    private lateinit var webView: WebView
    private lateinit var assetLoader: WebViewAssetLoader
    private val ioExecutor = Executors.newSingleThreadExecutor()
    private val snapshotSequence = AtomicLong(0)
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var pendingExport: PendingExport? = null
    private var lastBackPress = 0L

    private data class PendingExport(
        val displayName: String,
        val mimeType: String,
        val bytes: ByteArray
    )

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val callback = fileChooserCallback
        fileChooserCallback = null
        callback?.onReceiveValue(
            WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
        )
    }

    private val createDocumentLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val export = pendingExport
        pendingExport = null
        if (export == null || result.resultCode != Activity.RESULT_OK) return@registerForActivityResult
        val uri = result.data?.data ?: return@registerForActivityResult
        try {
            contentResolver.openOutputStream(uri, "w")?.use { out ->
                out.write(export.bytes)
                out.flush()
            } ?: error("The selected destination could not be opened")
            toast("Saved ${export.displayName}")
        } catch (_: Exception) {
            toast(getString(R.string.save_failed))
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        WindowCompat.setDecorFitsSystemWindows(window, false)

        assetLoader = WebViewAssetLoader.Builder()
            .setDomain("appassets.androidplatform.net")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        val rootContainer = FrameLayout(this)
        webView = WebView(this)
        webView.setPadding(0, 0, 0, 0)
        rootContainer.addView(
            webView,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )
        setContentView(rootContainer)

        val handledInsetTypes =
            WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
        ViewCompat.setOnApplyWindowInsetsListener(rootContainer) { view, insets ->
            val safe = insets.getInsets(handledInsetTypes)
            view.setPadding(safe.left, safe.top, safe.right, safe.bottom)

            WindowInsetsCompat.Builder(insets)
                .setInsets(handledInsetTypes, Insets.NONE)
                .build()
        }
        ViewCompat.requestApplyInsets(rootContainer)

        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = false
            allowContentAccess = true
            javaScriptCanOpenWindowsAutomatically = false
            setSupportMultipleWindows(false)
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = true
            setGeolocationEnabled(false)
            builtInZoomControls = false
            displayZoomControls = false
            textZoom = 100
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                safeBrowsingEnabled = true
            }
        }

        webView.addJavascriptInterface(VarugaiBridge(), "VarugaiAndroid")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? = assetLoader.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val uri = request.url
                val trusted = uri.scheme == "https" && uri.host == "appassets.androidplatform.net"
                if (!trusted) {
                    toast("External navigation is blocked in VARUGAI")
                }
                return !trusted
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                // Android printing already exposes "Save as PDF" through the system print UI.
                // Hide the Electron-only native PDF button while keeping the element present.
                view.evaluateJavascript(
                    "(function(){" +
                        "var p=document.getElementById('stPdf');if(p)p.style.display='none';" +
                        "var b=document.getElementById('stPrint');if(b)b.textContent='Print / Save PDF';" +
                    "})()",
                    null
                )
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = filePathCallback
                return try {
                    val intent = fileChooserParams?.createIntent()
                        ?: Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                            addCategory(Intent.CATEGORY_OPENABLE)
                            type = "*/*"
                        }
                    fileChooserLauncher.launch(intent)
                    true
                } catch (_: ActivityNotFoundException) {
                    fileChooserCallback = null
                    false
                }
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript(
                    "document.body.classList.contains('printing')"
                ) { result ->
                    if (result == "true") {
                        webView.evaluateJavascript(
                            "document.body.classList.remove('printing');" +
                                "var b=document.getElementById('stmtBack');if(b)b.remove();",
                            null
                        )
                    } else {
                        handleNormalBack()
                    }
                }
            }
        })

        val restored = savedInstanceState != null && webView.restoreState(savedInstanceState) != null
        if (!restored) webView.loadUrl(START_URL)
    }

    private fun handleNormalBack() {
        if (webView.canGoBack()) {
            webView.goBack()
            return
        }
        val now = SystemClock.elapsedRealtime()
        if (now - lastBackPress <= EXIT_WINDOW_MS) {
            finish()
        } else {
            lastBackPress = now
            toast(getString(R.string.exit_prompt))
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onPause() {
        webView.onPause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onDestroy() {
        fileChooserCallback?.onReceiveValue(null)
        fileChooserCallback = null
        if (::webView.isInitialized) {
            webView.removeJavascriptInterface("VarugaiAndroid")
            webView.stopLoading()
            webView.destroy()
        }
        ioExecutor.shutdown()
        super.onDestroy()
    }

    private fun toast(message: String) {
        runOnUiThread { Toast.makeText(this, message, Toast.LENGTH_SHORT).show() }
    }

    private fun sanitizeFileName(raw: String): String {
        val leaf = raw.substringAfterLast('/').substringAfterLast('\\').ifBlank { "VARUGAI_export" }
        return leaf.replace(Regex("[\\\\/:*?\"<>|\\u0000-\\u001F]"), "_").take(180)
    }

    private fun normalizeMime(raw: String, name: String): String {
        val mime = raw.trim().lowercase()
        if (mime.matches(Regex("^[a-z0-9.+-]+/[a-z0-9.+-]+$"))) return mime
        return when {
            name.endsWith(".xlsx", true) -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            name.endsWith(".json", true) -> "application/json"
            name.endsWith(".csv", true) -> "text/csv"
            name.endsWith(".html", true) -> "text/html"
            else -> "application/octet-stream"
        }
    }

    private fun beginExport(name: String, mime: String, bytes: ByteArray) {
        runOnUiThread {
            if (pendingExport != null) {
                toast("Finish the current save first")
                return@runOnUiThread
            }
            val cleanName = sanitizeFileName(name)
            val safeMime = normalizeMime(mime, cleanName)
            pendingExport = PendingExport(cleanName, safeMime, bytes)
            val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = safeMime
                putExtra(Intent.EXTRA_TITLE, cleanName)
            }
            try {
                createDocumentLauncher.launch(intent)
            } catch (_: ActivityNotFoundException) {
                pendingExport = null
                toast(getString(R.string.save_failed))
            }
        }
    }

    private fun printCurrentPage() {
        runOnUiThread {
            val manager = getSystemService(Context.PRINT_SERVICE) as PrintManager
            val jobName = "VARUGAI attendance statement"
            val adapter = webView.createPrintDocumentAdapter(jobName)
            val attributes = PrintAttributes.Builder()
                .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                .build()
            manager.print(jobName, adapter, attributes)
        }
    }

    inner class VarugaiBridge {
        @JavascriptInterface
        fun version(): String = BuildConfig.VERSION_NAME

        @JavascriptInterface
        fun saveBase64(name: String, data: String, mime: String) {
            // Base64 expands bytes by about 4/3. Reject before decoding to cap memory use.
            if (data.length > ((MAX_EXPORT_BYTES * 4L / 3L) + 16L)) {
                toast("Export is too large")
                return
            }
            val bytes = try {
                Base64.decode(data, Base64.DEFAULT)
            } catch (_: IllegalArgumentException) {
                toast(getString(R.string.save_failed))
                return
            }
            if (bytes.size > MAX_EXPORT_BYTES) {
                toast("Export is too large")
                return
            }
            beginExport(name, mime, bytes)
        }

        @JavascriptInterface
        fun printPage() {
            printCurrentPage()
        }

        @JavascriptInterface
        fun recoverySnapshot(registerId: String, json: String) {
            if (json.toByteArray(StandardCharsets.UTF_8).size > MAX_RECOVERY_BYTES) return
            val safeId = registerId.replace(Regex("[^A-Za-z0-9._-]"), "_").take(80)
            val payload = json.toByteArray(StandardCharsets.UTF_8)
            ioExecutor.execute {
                try {
                    val dir = File(filesDir, "recovery").apply { mkdirs() }
                    val prefix = if (safeId.isBlank()) "register" else safeId
                    val stamp = System.currentTimeMillis()
                    val seq = snapshotSequence.incrementAndGet()
                    val target = File(dir, "${prefix}__${stamp}__${seq}.json")
                    val temp = File(dir, ".${target.name}.tmp")
                    FileOutputStream(temp).use { out ->
                        out.write(payload)
                        out.fd.sync()
                    }
                    if (!temp.renameTo(target)) {
                        temp.copyTo(target, overwrite = true)
                        temp.delete()
                    }
                    dir.listFiles { file -> file.name.startsWith("${prefix}__") && file.extension == "json" }
                        ?.sortedByDescending { it.lastModified() }
                        ?.drop(15)
                        ?.forEach { it.delete() }
                } catch (_: Exception) {
                    // Recovery snapshots are additive only; primary localStorage save must remain unaffected.
                }
            }
        }
    }
}
