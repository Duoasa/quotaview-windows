export async function selfTest() {
  const check = (ok, message) => { if (!ok) throw Error(`Glass: ${message}`); };
  const wait = async (predicate) => {
    for (let i = 0; i < 100; i++) {
      if (predicate()) return;
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    throw Error('Glass lifecycle timed out');
  };
  const root = document.getElementById('root');
  const initial = document.querySelectorAll('filter[id^="liquid-glass-lens-"]').length;
  const fixture = document.createElement('div');
  fixture.className = 'app theme-dark material-glass';
  fixture.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#17191f;padding:24px';
  fixture.innerHTML = `<div class="island-preview" style="height:320px;padding:35px 24px">
    <div class="preview-shell" style="height:160px;--black-ratio:20%">
      <div style="padding:24px;font-size:18px;color:#f4f4f7">QuotaView · Liquid Glass</div>
      <div style="padding:0 24px;color:#f4f4f7">Windows · 边缘折射 / 色散 / 玻璃高光</div>
    </div>
    <div style="text-align:center;margin-top:30px"><div class="quota-capsule" style="height:40px">Codex　84%　·　Claude　72%</div></div>
  </div>`;
  root.append(fixture);
  const surface = fixture.querySelector('.preview-shell');
  const capsule = fixture.querySelector('.quota-capsule');
  const lens = () => surface.style.getPropertyValue('--glass-lens');
  await wait(() => lens().includes('url('));
  check(getComputedStyle(surface).backdropFilter.includes('url('), 'filter missing');
  const id = lens().match(/#([^)]*)/)[1];
  check(document.getElementById(id).querySelectorAll('feDisplacementMap').length === 3, 'RGB dispersion missing');
  surface.style.width = '360px';
  await wait(() => document.getElementById(id)?.getAttribute('width') === '360');
  fixture.className = 'app theme-light material-glass';
  await wait(() => getComputedStyle(capsule).color === 'rgb(21, 23, 29)');
  fixture.className = 'app theme-dark material-solid';
  await wait(() => !lens() && !surface.hasAttribute('data-liquid-glass'));
  check(getComputedStyle(surface).backdropFilter === 'none', 'solid material still filters');
  fixture.className = 'app theme-dark material-glass';
  await wait(() => lens().includes('url('));
  // Leave the synthetic fixture for main-process capture, never real user data.
  return {refraction: true, dispersion: true, resize: true, lightTheme: true, solidFallback: true,
    async cleanup() {
      fixture.remove();
      await wait(() => document.querySelectorAll('filter[id^="liquid-glass-lens-"]').length === initial);
      return true;
    }};
}
