/** Shared live website URL for env, APK WebView, and version.json. */
function resolveWebUrl() {
  return (
    process.env.WEB_URL ||
    process.env.FRONTEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    'https://thekedari-1.onrender.com'
  ).replace(/\/$/, '');
}

module.exports = { resolveWebUrl };
