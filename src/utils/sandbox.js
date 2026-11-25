import axiosRuntime from 'virtual:vueex-axios-runtime'
import vueRuntime from 'vue/dist/vue.global.prod.js?raw'

const boot = `
const root = document.getElementById('preview');
function report(error) {
  const message = document.createElement('pre');
  message.setAttribute('role', 'alert');
  message.style.cssText = 'white-space:pre-wrap;color:#b91c1c;padding:16px;font:14px monospace';
  message.textContent = error?.message || String(error);
  root.append(message);
}
window.addEventListener('error', event => report(event.error || event.message));
window.addEventListener('unhandledrejection', event => report(event.reason));
window.addEventListener('message', function start(event) {
  if (event.source !== parent || event.data?.type !== 'vueex-run') return;
  window.removeEventListener('message', start);
  const { html, css, javascript, code, error } = event.data;
  if (error) { report(error); return; }
  const style = document.createElement('style');
  style.textContent = css || '';
  document.head.append(style);
  if (html) root.innerHTML = html;
  try { Function('Vue', '__axios', code || javascript || '')(Vue, axios); } catch (error) { report(error); }
});
`

export const sandboxDocument = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data: blob:; base-uri 'none'; form-action 'none'; connect-src data:">
</head><body><div id="preview"></div><script>${(vueRuntime + '\n' + axiosRuntime + '\n' + boot).replace(/<\/script/gi, '<\\/script')}</script></body></html>`
