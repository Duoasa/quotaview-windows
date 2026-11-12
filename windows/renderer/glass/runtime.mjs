import { liquidGlass } from './lens.mjs';

// React owns the restored renderer. Keep material lifecycle independent of its
// generated symbols; only observe actual surface mounts and theme/material state.
const selector = '.island-shell, .preview-shell, .quota-capsule, .proxy-route > div > span';
const root = document.getElementById('root');
const lenses = new Map();
const transparency = matchMedia('(prefers-reduced-transparency: reduce)');
const contrast = matchMedia('(forced-colors: active)');
let frame = 0;
function sync() {
  frame = 0;
  const surfaces = new Set(root.querySelectorAll(selector));
  for (const [el, lens] of lenses) {
    if (!surfaces.has(el)) { lens.destroy(); lenses.delete(el); }
  }
  for (const el of surfaces) {
    const enabled = !transparency.matches && !contrast.matches &&
      !el.closest('.material-solid') && !el.matches('.collapsed .island-shell');
    el.toggleAttribute('data-liquid-glass', enabled);
    if (!enabled) {
      lenses.get(el)?.destroy();
      lenses.delete(el);
      continue;
    }
    // Desktop pixels are outside Chromium's backdrop. Only create expensive
    // refraction maps where the renderer actually owns a background image.
    if (!el.closest('.island-preview, .proxy-preview')) continue;
    if (!lenses.has(el)) lenses.set(el, liquidGlass(el, {
      rim: 32, edge: 1.1, power: 2.6, dispersion: 0.15,
    }));
  }
}
function schedule() { if (!frame) frame = requestAnimationFrame(sync); }
const observer = new MutationObserver(records => {
  if (records.some(r => r.type === 'childList' ||
    r.target.matches('.app, .island-window, .island-preview'))) schedule();
});
observer.observe(root, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
transparency.addEventListener('change', schedule);
contrast.addEventListener('change', schedule);
schedule();
if (new URLSearchParams(location.search).get('effectsSmoke') === '1') {
  window.QVGlass = {selfTest: async () => {
    const {selfTest} = await import('./smoke.mjs');
    const result = await selfTest();
    window.QVGlass.cleanup = result.cleanup;
    delete result.cleanup;
    return result;
  }};
}
window.addEventListener('pagehide', () => {
  observer.disconnect();
  cancelAnimationFrame(frame);
  transparency.removeEventListener('change', schedule);
  contrast.removeEventListener('change', schedule);
  for (const lens of lenses.values()) lens.destroy();
  lenses.clear();
}, {once: true});
