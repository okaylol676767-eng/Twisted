/* ============================================================
   TWISTED — engine.js
   Zero-dependency story engine: scene graph, flags, stats,
   conditional text, effects, autosave.
   ============================================================ */
(function () {
  "use strict";

  const SAVE_KEY = "twisted.save.v1";

  /* ---------------- state ---------------- */
  const defaultState = function () {
    return {
      sceneId: null,
      /* flags: booleans & strings (impression, temper, lastChoiceLabel…) */
      flags: {},
      /* stats: numbers (attraction_ad, attraction_z, trust…) */
      stats: {
        attraction_ad: 0,
        attraction_z: 0,
        trust: 0,
        temper: 0,
        kissed_dinner: 0,
      },
      seen: {},          // sceneId -> true, for autoplay-skip
      actsSeen: {},      // "1" / "2" / "3" -> true
      chapter: 1,
      history: [],
    };
  };

  let state = defaultState();
  let listeners = { scene: [], choice: [], chapter: [], mood: [], end: [] };

  /* ---------------- tiny pub/sub ---------------- */
  function on(evt, fn) { listeners[evt].push(fn); }
  function emit(evt, payload) { listeners[evt].forEach(function (fn) { try { fn(payload); } catch (e) { console.error("[twisted] listener error", e); } }); }

  /* ---------------- story registry ---------------- */
  const chapters = {};   // num -> { title, scenes: {id: scene} }
  function registerChapter(num, def) { chapters[num] = def; }
  function chapterDef(num) {
    const c = chapters[num || state.chapter];
    if (!c) throw new Error("[twisted] missing chapter " + (num || state.chapter));
    return c;
  }
  function scene(id) {
    const c = chapterDef();
    const s = c.scenes[id];
    if (!s) throw new Error("[twisted] unknown scene: " + id);
    return s;
  }

  /* ---------------- flag/stat helpers ---------------- */
  function flag(name) { return !!state.flags[name]; }
  function setFlag(name, val) { state.flags[name] = val; }
  function stat(name) { return state.stats[name] || 0; }
  function addStat(name, delta) {
    state.stats[name] = (state.stats[name] || 0) + delta;
  }

  /* ---------------- conditional text ----------------
     {if:flag}A{else}B{endif} · cond: flag | !flag | stat>=N | stat>N | stat<=N */
  function interp(text) {
    if (!text) return "";
    /* {if:cond}A{else}B{endif} — cond: flag | !flag | stat>=N | stat>N | stat<=N */
    const re = /\{if:([^}]+)\}([\s\S]*?)(?:\{else\}([\s\S]*?))?\{endif\}/;
    let s = text, m;
    let guard = 0;
    while ((m = re.exec(s)) !== null && guard++ < 50) {
      const cond = m[1].trim();
      let truthy = false;
      const ms = cond.match(/^(\w+)\s*(>=|<=|>)\s*(-?\d+)$/);
      const equality = cond.match(/^(\w+)\s*=\s*(.+)$/);
      if (ms) {
        const v = stat(ms[1]);
        truthy = ms[2] === ">=" ? v >= +ms[3] : ms[2] === "<=" ? v <= +ms[3] : v > +ms[3];
      } else if (equality) truthy = state.flags[equality[1]] === equality[2];
      else if (cond.charAt(0) === "!") truthy = !flag(cond.slice(1).trim());
      else truthy = flag(cond);
      s = s.slice(0, m.index) + (truthy ? m[2] : (m[3] || "")) + s.slice(m.index + m[0].length);
    }
    return s;
  }

  /* ---------------- autosave ---------------- */
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) { /* private mode etc. — ignore */ }
  }
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || !data.sceneId) return null;
      return data;
    } catch (e) { return null; }
  }
  function hasSave() { return !!loadSave(); }
  function wipe() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
    state = defaultState();
  }

  /* ---------------- effects ---------------- */
  function applyEffects(sc) {
    if (!sc) return;
    (sc.effects || []).forEach(function (fx) {
      if (fx.set !== undefined) setFlag(fx.set, fx.value === undefined ? true : fx.value);
      if (fx.add) addStat(fx.stat, fx.add);
      if (fx.mood) emit("mood", fx.mood);
    });
  }

  /* ---------------- flow ---------------- */
  function startChapter(num, fromSave) {
    state.chapter = num;
    const def = chapterDef(num);
    if (!fromSave) state.history = [];
    emit("chapter", def);
    goTo(fromSave ? state.sceneId : def.start, { restore: !!fromSave });
  }

  function goTo(id, opts) {
    opts = opts || {};
    const sc = scene(id);
    state.sceneId = id;
    if (!opts.restore) {
      if (!state.seen[id]) state.seen[id] = true;
      applyEffects(sc);
      state.history.push(id);
      if (state.history.length > 400) state.history.shift();
      save();
    }
    emit("scene", { id: id, scene: sc, restore: !!opts.restore });
  }

  function next() {
    const sc = scene(state.sceneId);
    if (sc.choices && sc.choices.length) return;      // must choose
    const target = typeof sc.next === "function" ? sc.next(state) : sc.next;
    if (!target) { endChapter(); return; }
    goTo(target);
  }

  function choose(choiceIdx) {
    const sc = scene(state.sceneId);
    const vis = visibleChoices(sc);
    const ch = vis[choiceIdx];
    if (!ch) return;
    state.flags.lastChoiceLabel = ch.label.replace(/\s*\{[^}]*\}\s*/g, " ").trim().slice(0, 60);
    if (ch.effects) applyEffects({ effects: ch.effects });
    save();
    emit("choice", ch);
    if (ch.goto === null) { endChapter(); return; }
    goTo(typeof ch.goto === "function" ? ch.goto(state) : ch.goto);
  }

  function visibleChoices(sc) {
    if (!sc.choices) return [];
    return sc.choices.filter(function (c) {
      if (!c.if) return true;
      if (c.if.charAt(0) === "!") return !flag(c.if.slice(1).trim());
      return flag(c.if);
    });
  }

  function endChapter() {
    save();
    emit("end", { state: state });
  }

  function freshStart() {
    wipe();
    save();
    startChapter(1, false);
  }

  function continueSaved() {
    const s = loadSave();
    if (!s) return false;
    state = s;
    startChapter(s.chapter || 1, true);
    return true;
  }

  /* ---------------- dev/test hook ---------------- */
  const testApi = {
    jump: function (id) { goTo(id); },
    setFlag: function (k, v) { setFlag(k, v); save(); },
    addStat: function (k, v) { addStat(k, v); save(); },
    state: function () { return JSON.parse(JSON.stringify(state)); },
    visibleChoices: function () { return visibleChoices(scene(state.sceneId)).map(function (c) { return c.label; }); },
    choose: function (i) { choose(i); },
    next: function () { next(); },
    scenes: function () { return Object.keys(chapterDef().scenes); },
  };
  window.TW_TEST = testApi;

  /* ---------------- exports ---------------- */
  window.TwistedEngine = {
    on: on,
    interp: interp,
    registerChapter: registerChapter,
    freshStart: freshStart,
    continueSaved: continueSaved,
    hasSave: hasSave,
    next: next,
    choose: choose,
    visibleChoices: function () { return visibleChoices(scene(state.sceneId)); },
    wipe: wipe,
    save: save,
    flag: flag,
    stat: stat,
    scene: scene,
    state: function () { return state; },
  };
})();
