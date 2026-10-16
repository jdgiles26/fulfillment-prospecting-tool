// CDP verification: drives headless Chrome through the full Prospect Finder
// flow and saves screenshots at each stage. Uses Node's built-in WebSocket.
const { spawn, execSync } = require('child_process');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const OUT = '/tmp/pf-shots';
fs.mkdirSync(OUT, { recursive: true });

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`,
    '--window-size=1400,900', '--hide-scrollbars', '--mute-audio',
    '--user-data-dir=/tmp/pf-chrome-profile', 'about:blank',
  ], { stdio: 'ignore' });

  await new Promise((r) => setTimeout(r, 2500));

  const list = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json());
  const page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  };
  await new Promise((r) => (ws.onopen = r));

  const evaluate = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
    return res.result.value;
  };
  const shot = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'));
    console.log('saved', name);
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:7100/' });
  await new Promise((r) => setTimeout(r, 2500));
  await shot('1-initial');

  // Fill a broad search: industry "goods", geo AR + TN
  await evaluate(`(() => {
    const inputs = document.querySelectorAll('.search-form input');
    // industry field
    const setVal = (el, v) => { const p = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; p.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
    setVal(inputs[0], 'goods');
    setVal(inputs[2], 'AR');   // first geo state
    document.querySelector('.search-form .link-btn').click(); // add another location
    return 'filled';
  })()`);
  await new Promise((r) => setTimeout(r, 300));
  await evaluate(`(() => {
    const inputs = document.querySelectorAll('.search-form input');
    const setVal = (el, v) => { const p = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set; p.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };
    setVal(inputs[5], 'TN');   // second geo state
    setVal(inputs[6], '50');
    setVal(inputs[7], '200');
    return 'done';
  })()`);
  await evaluate(`document.querySelector('.primary-btn').click()`);
  await new Promise((r) => setTimeout(r, 800));
  await shot('2-assessment-results');

  // Open first result detail
  await evaluate(`document.querySelector('tbody tr').click()`);
  await new Promise((r) => setTimeout(r, 700));
  await shot('3-detail');

  const state = await evaluate(`(() => ({
    rows: document.querySelectorAll('tbody tr').length,
    fitNums: [...document.querySelectorAll('.fit-num')].map(e => e.textContent),
    banner: document.querySelector('.assessment-text strong')?.textContent,
    detailTitle: document.querySelector('.detail-header h2')?.textContent,
    fitRows: document.querySelectorAll('.fit-row').length,
  }))()`);
  console.log('STATE', JSON.stringify(state));

  await send('Browser.close').catch(() => {});
  chrome.kill();
}

main().catch((e) => { console.error(e); process.exit(1); });
