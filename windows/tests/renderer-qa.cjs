// Runs in isolated smoke windows with fixture data, never in a normal session.
const fs = require("node:fs");
const path = require("node:path");
module.exports = async function verifyUI({ island, preferences, folder }) {
  const now = Date.now();
  const days = Array.from({ length: 294 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - 293 + index);
    return {
      date: date.toISOString().slice(0, 10),
      total: 100000 + index * 711,
      cost: 0.8 + (index % 13) * 0.4,
    };
  });
  const fixture = {
    locale: "zh",
    settings: {
      language: "zh",
      theme: "dark",
      islandWidth: 680,
      autoExpand: false,
    },
    tasks: [
      {
        id: "qa-think",
        provider: "codex",
        title: "规划下一次产品迭代",
        status: "thinking",
        model: "6 Astra · High",
        publicText: "梳理目标，分析实现方案",
        tokens: { total: 24800 },
        startedAt: now - 60000,
      },
      {
        id: "qa-work",
        provider: "codex",
        title: "构建 QuotaView Windows",
        status: "working",
        model: "6 Sol · High",
        publicText: "编译应用，验证构建结果",
        tokens: { total: 128000 },
        progress: { completed: 3, total: 5 },
        startedAt: now - 120000,
      },
    ],
    quotas: {
      codex: {
        updatedAt: now,
        account: { plan: "Plus" },
        credits: { balance: 25 },
        windows: [
          { windowMinutes: 300, usedPercent: 28, resetAt: now + 10800000 },
          { windowMinutes: 10080, usedPercent: 36, resetAt: now + 600000000 },
        ],
      },
    },
    usage: {
      codex: { days, localDays: days, summary: { lifetimeTokens: 2100000000 } },
    },
    providers: { codex: { connected: true, enabled: true } },
    ui: { expanded: false, pinned: false },
  };
  const run = (win, code) =>
    win.webContents.executeJavaScript(
      `(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));const check=(v,m)=>{if(!v)throw Error(m);};${code}})()`,
    );
  const inject = async (win, value) =>
    run(
      win,
      `window.QVUITest.setSnapshot(${JSON.stringify(value)});await wait(150);return true;`,
    );
  const capture = async (win, name) => {
    if (!win.capture || !folder) return null;
    const target = path.join(folder, name);
    fs.mkdirSync(target, { recursive: true });
    return win.capture(target);
  };
  await inject(island, fixture);
  const hover = await run(
    island,
    `
    const main=document.querySelector('.island-window');
    const enter=()=>main.dispatchEvent(new MouseEvent('mouseover',{bubbles:true,relatedTarget:document.body}));
    const leave=()=>main.dispatchEvent(new MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body}));
    enter();await wait(80);check(main.classList.contains('collapsed'),'Hover opened before dwell');
    await wait(220);check(main.classList.contains('expanded'),'Hover did not expand with automatic popups disabled');
    document.querySelector('[aria-label="固定展开"]').click();leave();await wait(550);
    check(main.classList.contains('expanded'),'Pinned island collapsed');
    enter();document.querySelector('[aria-label="取消固定"]').click();leave();await wait(550);
    check(main.classList.contains('collapsed'),'Pointer exit did not collapse');
    enter();await wait(250);main.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(200);
    check(main.classList.contains('collapsed'),'Escape did not collapse');
    enter();await wait(250);check(main.classList.contains('collapsed'),'Collapsed island reopened before pointer exit');
    leave();enter();await wait(250);check(main.classList.contains('expanded'),'Hover did not rearm after exit');
    return {dwell:true,pinned:true,leave:true,escape:true,reentry:true};
  `,
  );
  await inject(island, {
    ...fixture,
    ui: { expanded: true, pinned: false },
    tasks: [
      {
        ...fixture.tasks[1],
        id: "qa-wait",
        status: "waiting",
        title: "发布前的最终检查",
        progress: { completed: 1, total: 3 },
      },
      ...fixture.tasks,
    ],
  });
  await run(
    island,
    `document.querySelector('.island-window').dispatchEvent(new MouseEvent('mouseout',{bubbles:true,relatedTarget:document.body}));await wait(550);check(document.querySelector('.island-window.expanded'),'Pending request was collapsed');return true;`,
  );
  await capture(island, "tasks");
  const motion = await run(
    island,
    `
    const canvases=[...document.querySelectorAll('.qv-orb-canvas,.qv-quantum-canvas')];
    const before=canvases.map(c=>c.toDataURL()),frames=window.QVEffects.diagnostics().frames;
    await wait(450);
    check(window.QVEffects.diagnostics().frames>frames+2,'Task effect scheduler stalled');
    check(canvases.some((c,i)=>c.classList.contains('qv-orb-canvas')&&c.toDataURL()!==before[i]),'Task orb is static');
    check(canvases.some((c,i)=>c.classList.contains('qv-quantum-canvas')&&c.toDataURL()!==before[i]),'Task quantum field is static');
    return window.QVEffects.diagnostics();
  `,
  );
  const usage = await run(
    island,
    `
    document.querySelector('.island-header .quota-capsule').click();await wait(500);
    check(document.querySelectorAll('.quota-card').length===2,'Quota layout');
    check(document.querySelectorAll('.usage-summary-stat').length===3,'Token metrics layout');
    const account=document.querySelector('.account-bento').getBoundingClientRect(),metrics=document.querySelector('.usage-bento-metrics').getBoundingClientRect();
    check(account.left>=metrics.right && Math.abs(account.top-metrics.top)<2,'Account is not beside the quota/token cards');
    const ticket=document.querySelector('.recharge-ticket');check(ticket&&ticket.getAttribute('aria-disabled')==='true'&&ticket.tabIndex===-1,'Recharge card must be noninteractive');
    ticket.click();check(document.querySelector('.usage-dashboard'),'Recharge card navigated');
    document.querySelectorAll('.activity-mode button')[1].click();await wait(70);check(document.querySelectorAll('.activity-cell').length===42,'Weekly aggregation');
    document.querySelectorAll('.activity-mode button')[2].click();await wait(70);check(document.querySelectorAll('.activity-cell').length===294,'Cumulative activity');
    document.querySelectorAll('.activity-mode button')[0].click();await wait(80);
    check(document.querySelector('.usage-panel').scrollWidth<=document.querySelector('.usage-panel').clientWidth+1,'Usage overflow');
    return {bento:true,ticketDisplayOnly:true,activityModes:true};
  `,
  );
  await capture(island, "usage");
  await run(
    island,
    "await window.quotaView.updateSettings({islandWidth:520});await wait(250);const el=document.querySelector('.usage-panel');check(el.scrollWidth<=el.clientWidth+1,'Narrow usage overflow');return true;",
  );
  await capture(island, "usage-narrow");
  await run(
    island,
    "await window.quotaView.updateSettings({islandWidth:680});return true;",
  );
  await inject(preferences, fixture);
  const settings = await run(
    preferences,
    `
    document.querySelector('[data-page="island"]').click();await wait(180);
    const text=document.querySelector('.settings-content').textContent;
    check(!text.includes('空闲')&&!text.includes('任务特效')&&!document.querySelector('.effect-choices'),'Removed preferences remain visible');
    const controls=[...document.querySelectorAll('.window-controls button')].map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
    check(controls.length===3&&controls.every(r=>Math.abs(r.width-46)<1&&Math.abs(r.height-36)<1),'Caption control sizes');
    check(controls[2].x+controls[2].width<=innerWidth&&controls[0].y<3,'Caption controls are misplaced');
    const detail=document.querySelector('.settings-detail');check(detail.scrollWidth<=detail.clientWidth+1,'Settings horizontal overflow');
    return {removedPreferences:true,controls,viewport:{width:innerWidth,height:innerHeight,dpi:devicePixelRatio}};
  `,
  );
  await capture(preferences, "settings-island");
  await run(
    preferences,
    `document.querySelector('[data-page="usage"]').click();await wait(100);check(document.querySelectorAll('.settings-content [role="switch"]').length===2,'Usage must expose only two optional modules');return true;`,
  );
  await capture(preferences, "settings-usage");
  // Visit every settings page to catch render errors and horizontal clipping.
  await run(
    preferences,
    `for(const page of ['general','connections','proxy','feedback','about']){document.querySelector('[data-page="'+page+'"]').click();await wait(100);check(!document.querySelector('.fatal-error'),'Settings render failure: '+page);const el=document.querySelector('.settings-detail');check(el.scrollWidth<=el.clientWidth+1,'Settings overflow: '+page);}return true;`,
  );
  preferences.setBounds({
    ...preferences.getBounds(),
    width: 720,
    height: 520,
  });
  await run(
    preferences,
    "await wait(200);for(const page of ['island','connections','proxy','general','usage']){document.querySelector('[data-page=\"'+page+'\"]').click();await wait(100);const el=document.querySelector('.settings-detail');check(el.scrollWidth<=el.clientWidth+1,'Narrow settings overflow: '+page);}return true;",
  );
  await capture(preferences, "settings-narrow");
  const displays = require("electron").screen.getAllDisplays();
  const target = displays.find((d) => d.bounds.x < 0) || displays[0];
  preferences.setBounds({
    ...target.bounds,
    x: target.bounds.x + 30,
    y: target.bounds.y + 30,
    width: 720,
    height: 520,
  });
  preferences.maximize();
  await run(
    preferences,
    "await wait(150);check(document.documentElement.classList.contains('window-maximized'),'Native maximize did not reach titlebar');return true;",
  );
  const maximized = await capture(preferences, "settings-maximized");
  if (maximized) {
    const b = maximized.bounds,
      a = maximized.workArea;
    if (
      b.x < a.x - 2 ||
      b.y < a.y - 2 ||
      b.x + b.width > a.x + a.width + 2 ||
      b.y + b.height > a.y + a.height + 2
    )
      throw Error(
        "Maximized settings escaped display work area: " +
          JSON.stringify(maximized),
      );
  }
  preferences.unmaximize();
  preferences.minimize();
  preferences.show();
  await run(
    preferences,
    "await wait(150);check(!document.hidden,'Minimized window did not restore');check(!document.documentElement.classList.contains('window-maximized'),'Restore titlebar state is stale');return true;",
  );
  const native = await capture(preferences, "settings-restored");
  if (native && native.state !== "Normal")
    throw Error("Window did not return to Normal state");
  return { hover, motion, usage, settings, native };
};
