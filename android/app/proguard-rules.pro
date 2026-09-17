# Preserve the narrow JavaScript bridge. Only methods explicitly annotated with
# @JavascriptInterface are exposed to the trusted local page.
-keepclassmembers class com.gasczoology.varugai.MainActivity$VarugaiBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes *Annotation*
