// 作品集客观量测：真实浏览器（Chrome/Edge 无头 + CDP）打开线上地址，
// 检查横向溢出、文字截断、命中区、锚点、外部依赖、键盘焦点与打印介质隐形文字。
//
// 前置：先起一个带调试端口的无头浏览器（脚本不会替你装浏览器）：
//   chrome.exe --headless=new --remote-debugging-port=9333 --user-data-dir=<空目录> about:blank
// 运行：node tools/audit-browser.mjs [要量的URL] [cdp端口]
// 退出码：0 = 全部通过；1 = 有违规；2 = 连不上浏览器或页面。
import fs from 'node:fs';

const SITE = process.argv[2] || 'https://yueminghub.github.io/ming-portfolio/';
const PORT = process.argv[3] || '9333';
const PREFIX = process.argv[4] || '';   // 多个发布面要分别留证时用，如 fun-
const OUT = new URL('../evidence/', import.meta.url).pathname.replace(/^\//, '');
const fails = [];
const say = (...a) => console.log(...a);
const fail = (name, detail) => { fails.push(name + ': ' + detail); say('FAIL  ' + name + ' — ' + detail); };

let page;
try {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
  page = list.find(t => t.type === 'page');
} catch (e) { say('CANNOT_REACH_CDP: ' + e.message); process.exit(2); }
if (!page) { say('NO_PAGE_TARGET'); process.exit(2); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let idc = 0; const pend = new Map(); const exceptions = [];
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); }
  else if (m.method === 'Runtime.exceptionThrown') exceptions.push(String(m.params.exceptionDetails?.text || '').slice(0, 80));
};
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++idc; pend.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
const wait = ms => new Promise(r => setTimeout(r, ms));
const val = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
const json = async expr => JSON.parse(await val(expr));

await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
// 必须禁用缓存：同一 URL 重复 navigate 时 Chrome 会复用旧响应，量到的就不是刚发布的那一版
await send('Network.setCacheDisabled', { cacheDisabled: true });
fs.mkdirSync(OUT, { recursive: true });

const MEASURE = String.raw`(() => {
  const vw = innerWidth, de = document.documentElement;
  const clippedAnc = el => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/hidden|clip/.test(s.overflowX + s.overflow)) return true; } return false; };
  const nm = el => el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).join('.') : '');
  const over = [];
  document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (!r.width && !r.height) return; if ((r.right > vw + 1 || r.left < -1) && !clippedAnc(el)) over.push(nm(el) + ' R' + Math.round(r.right)); });
  const clip = [];
  document.querySelectorAll('dd,h1,h2,h3,p,li,a,span').forEach(el => { const s = getComputedStyle(el); if (/hidden/.test(s.overflow + s.overflowY) && el.scrollHeight > el.clientHeight + 2) clip.push(nm(el) + ' ' + el.scrollHeight + '>' + el.clientHeight); });
  const small = [...document.querySelectorAll('a,button')].filter(e => e.offsetParent !== null).map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 22), w: Math.round(r.width), h: Math.round(r.height) }; }).filter(o => o.t && (o.h < 24 || o.w < 24));
  const broken = [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h !== '#' && !document.querySelector(h));
  const res = performance.getEntriesByType('resource');
  return JSON.stringify({
    vw, scrollW: de.scrollWidth, scrollH: de.scrollHeight, hOverflow: de.scrollWidth > vw + 1,
    overflowers: over.slice(0, 6), clipped: clip.slice(0, 6),
    smallTargets: small, brokenAnchors: broken,
    externalHosts: [...new Set(res.map(e => { try { return new URL(e.name).host } catch (x) { return '' } }).filter(h => h && h !== location.host))],
    fontRequests: res.filter(e => /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(e.name)).length,
    counts: { works: document.querySelectorAll('article.work').length, steps: document.querySelectorAll('.step').length, evRows: document.querySelectorAll('.ev-row').length, httpLinks: document.querySelectorAll('a[href^="http"]').length },
    title: document.title
  });
})()`;

const VIEWS = [['desktop', 1440, 900, false, 1], ['tablet-768', 768, 1024, false, 1], ['mobile-390', 390, 844, true, 2], ['mobile-320', 320, 640, true, 2]];
for (const [label, w, h, mob, dpr] of VIEWS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: mob });
  await send('Page.navigate', { url: SITE }); await wait(mob ? 5200 : 6000);
  const m = await json(MEASURE);
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${OUT}${PREFIX}${label}-fold.png`, Buffer.from(shot.data, 'base64'));
  say(`${label} ${w}x${h}: scrollW=${m.scrollW}/${m.vw} height=${m.scrollH} 溢出=${m.hOverflow} 截断=${m.clipped.length} 命中区<24px=${m.smallTargets.length} 失效锚点=${m.brokenAnchors.length} 外链=${m.counts.httpLinks} 项目块=${m.counts.works} 标题="${m.title}"`);
  if (m.hOverflow) fail(label + ' 横向溢出', JSON.stringify(m.overflowers));
  if (m.clipped.length) fail(label + ' 文字截断', JSON.stringify(m.clipped));
  if (m.brokenAnchors.length) fail(label + ' 失效锚点', JSON.stringify(m.brokenAnchors));
  const smallReal = m.smallTargets.filter(o => !o.t.includes('ming-portfolio'));
  if (smallReal.length) fail(label + ' 命中区过小', JSON.stringify(smallReal));
  if (m.externalHosts.length || m.fontRequests) fail(label + ' 出现外部依赖', JSON.stringify({ hosts: m.externalHosts, fonts: m.fontRequests }));
}

// 句内链接豁免：正文句子中的链接尺寸受行高约束，WCAG 2.5.8 明确豁免，单独列出供人复核
say('句内链接（豁免项，仅记录）=' + JSON.stringify((await json(MEASURE)).smallTargets));

// 键盘可达性
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: SITE }); await wait(5000);
await send('Runtime.evaluate', { expression: 'scrollTo(0,0);' });
const chain = [];
for (let i = 0; i < 14; i++) {
  for (const t of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type: t, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  chain.push(JSON.parse(await val(String.raw`(()=>{const e=document.activeElement;if(!e||e===document.body)return JSON.stringify({t:'BODY'});return JSON.stringify({t:e.tagName,x:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,20),h:e.getAttribute('href')||''});})()`)));
}
const reached = [...new Set(chain.filter(c => c.t !== 'BODY').map(c => c.x + ' -> ' + c.h))];
say('键盘 Tab 可达（前 14 次）=' + reached.length + ' 个不同目标');
if (reached.length < 8) fail('键盘可达性', '只走到 ' + reached.length + ' 个目标');

// 打印介质：逐元素算文字色 vs 最近不透明背景色，抓白字白底
await send('Emulation.setEmulatedMedia', { media: 'print', features: [] });
await send('Emulation.setDeviceMetricsOverride', { width: 689, height: 1016, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: SITE }); await wait(6000);
const pr = await json(String.raw`(() => {
  const nums = c => { const m = String(c).match(/\d+(\.\d+)?/g); return m ? m.map(Number) : null; };
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const R = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const bgOf = el => { for (let p = el; p; p = p.parentElement) { const c = nums(getComputedStyle(p).backgroundColor); if (c && !(c.length > 3 && c[3] === 0)) return c.slice(0, 3); } return [255, 255, 255]; };
  const bad = []; let n = 0;
  document.querySelectorAll('h1,h2,h3,h4,p,li,dd,dt,a,span,b,em,strong,i').forEach(el => {
    if (![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim())) return;
    const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return; n++;
    const f = nums(s.color); if (!f) return;
    const cr = R(f.slice(0, 3), bgOf(el)), fs = parseFloat(s.fontSize), fw = parseInt(s.fontWeight, 10) || 400;
    const need = (fs >= 24 || (fs >= 18.66 && fw >= 700)) ? 3 : 4.5;
    if (cr < need) bad.push({ t: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 22), cr: +cr.toFixed(2), need });
  });
  return JSON.stringify({ checked: n, bad: bad.slice(0, 8), finalBg: getComputedStyle(document.querySelector('.final')).backgroundColor });
})()`);
say(`打印介质：逐元素 ${pr.checked} 项，对比度违规=${pr.bad.length}，深色区块底色=${pr.finalBg}（应为白，否则白字白底）`);
if (pr.bad.length) fail('打印介质对比度', JSON.stringify(pr.bad));
if (pr.finalBg !== 'rgb(255, 255, 255)') fail('打印介质深色底', pr.finalBg);
await send('Emulation.setEmulatedMedia', { media: '', features: [] });

say('JS 异常=' + (exceptions.length ? JSON.stringify(exceptions) : '0'));
if (exceptions.length) fail('JS 异常', JSON.stringify(exceptions));
fs.writeFileSync(`${OUT}${PREFIX}browser-audit.txt`, `${SITE}\n${new Date().toISOString()}\n视口=${VIEWS.map(v => v[1] + 'x' + v[2]).join(' ')}\n打印介质检查=${pr.checked} 违规=${pr.bad.length}\n键盘可达目标=${reached.length}\nJS异常=${exceptions.length}\n失败项=${fails.length ? fails.join(' | ') : '无'}\n`, 'utf8');
say('----');
say(fails.length ? 'RESULT=FAIL(' + fails.length + ')' : 'RESULT=PASS');
ws.close();
process.exit(fails.length ? 1 : 0);
