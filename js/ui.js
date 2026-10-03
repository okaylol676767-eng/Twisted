/* ============================================================
   TWISTED — ui.js
   Scenes, illustrated backgrounds, consistent character models,
   dialogue sequencing + typewriter, transitions, choices and menus.
   ============================================================ */
(function () {
  "use strict";
  const E = window.TwistedEngine;
  const $ = function (id) { return document.getElementById(id); };
  const el = {
    body: document.body, titleScreen: $("titleScreen"), introScreen: $("introScreen"), gameScreen: $("gameScreen"), endScreen: $("endScreen"),
    btnNew: $("btnNew"), btnContinue: $("btnContinue"), btnMenu: $("btnMenu"), btnResume: $("btnResume"), btnSaveQuit: $("btnSaveQuit"), btnWipe: $("btnWipe"), btnCheats: $("btnCheats"), flagDump: $("flagDump"),
    btnVoiceToggle: $("btnVoiceToggle"), btnVoiceReplay: $("btnVoiceReplay"), voiceAdeline: $("voiceAdeline"), voiceZade: $("voiceZade"),
    hudPov: $("hudPov"), stage: $("stage"), sceneBackground: $("sceneBackground"), sceneProps: $("sceneProps"), sceneForeground: $("sceneForeground"), visualTransition: $("visualTransition"),
    slotLeft: $("slotLeft"), slotRight: $("slotRight"), imgLeft: $("imgLeft"), imgRight: $("imgRight"), cueLeft: $("cueLeft"), cueRight: $("cueRight"),
    actCard: $("actCard"), actKicker: $("actKicker"), actTitle: $("actTitle"), actSub: $("actSub"), dialogue: $("dialogue"), speakerName: $("speakerName"), povChip: $("povChip"), dialogueText: $("dialogueText"), choices: $("choices"), menuDrawer: $("menuDrawer"), endCodeBlock: $("endCodeBlock"), endReport: $("endReport"), btnReplay: $("btnReplay"), btnEndTitle: $("btnEndTitle"), dust: $("dust"),
  };
  const P = {
    status: "idle", lines: [], lineIdx: 0, scene: null, sceneId: null, visual: null, token: 0, typing: null, cueTimer: null, lastSpeaker: null,
    actorMemory: {
      Adeline: { name: "Adeline", outfit: "sleepwear", pose: "resting", expression: "sleeping", cue: "Satin black night-suit · sleep mask" },
      Zade: { name: "Zade", outfit: "casual", pose: "moving-boxes", expression: "focused", cue: "Denim jacket · graphic tee" },
    },
    actorPresent: { Adeline: false, Zade: false }, actorSlots: { Adeline: null, Zade: null },
  };
  const TYPE_MS = 17;
  const VOICE_KEY = "twisted.voice.v1";
  const V = { enabled: true, voices: { Adeline: "", Zade: "" }, utterance: null, generation: 0, available: false };
  function setStatus(status) { P.status = status; }
  function setMood(mood) { if (mood) el.body.dataset.mood = mood; }
  function show(screen) { [el.titleScreen, el.introScreen, el.gameScreen, el.endScreen].forEach(s => s.classList.remove("visible")); screen.classList.add("visible"); }
  function spawnDust() {
    if (el.dust.childElementCount) return;
    for (let i = 0; i < 14; i++) {
      const mote = document.createElement("span"), size = 1.5 + Math.random() * 2.5;
      mote.className = "mote"; mote.style.width = size + "px"; mote.style.height = size + "px"; mote.style.left = (Math.random() * 100) + "vw"; mote.style.setProperty("--mo", (0.12 + Math.random() * 0.3).toFixed(2)); mote.style.animationDuration = (16 + Math.random() * 22) + "s"; mote.style.animationDelay = (-Math.random() * 30) + "s"; el.dust.appendChild(mote);
    }
  }

  /* ---------------- visual direction / backgrounds ---------------- */
  function showVisualTransition(text) {
    /* Direction notes are stored for staging/accessibility; never render production directions as story dialogue. */
    el.visualTransition.textContent = "";
    el.visualTransition.dataset.cue = text || "";
    el.visualTransition.setAttribute("aria-label", text || "");
  }
  function renderProps(props, id) {
    el.sceneProps.innerHTML = "";
    const markers = [];
    if (id === "z_ready" || id === "d3") markers.push({ text: "〰", type: "steam" });
    if (id === "phone") markers.push({ text: "6:40", type: "phone" });
    if (["locked_out", "close_spark", "close_smolder", "close_cold"].includes(id)) markers.push({ text: "NOTE", type: "note" });
    markers.forEach(marker => { const node = document.createElement("span"); node.className = "scene-prop " + marker.type; node.textContent = marker.text; el.sceneProps.appendChild(node); });
  }
  function updateSceneVisual(id, sc, previousId) {
    const map = window.TWISTED_SCENE_VISUALS && window.TWISTED_SCENE_VISUALS.scenes;
    const visual = map && map[id] ? map[id] : { background: "hallway-morning", actors: {}, props: [], transition: "" };
    const oldVisual = previousId && map && map[previousId];
    P.visual = visual;
    window.TwistedVisuals.renderBackground(el.sceneBackground, visual.background, oldVisual && oldVisual.background);
    window.TwistedVisuals.renderForeground(el.sceneForeground, visual.background, oldVisual && oldVisual.background);
    renderProps(visual.props, id); showVisualTransition(visual.transition);
    const slots = { Adeline: el.slotLeft, Zade: el.slotRight }, images = { Adeline: el.imgLeft, Zade: el.imgRight }, cues = { Adeline: el.cueLeft, Zade: el.cueRight };
    Object.keys(slots).forEach(name => {
      const slot = slots[name], spec = visual.actors && visual.actors[name], memory = P.actorMemory[name];
      if (!spec || spec.visible === false) {
        if (P.actorPresent[name]) { P.actorPresent[name] = false; animateExit(name, slot); }
        else slot.hidden = true;
        return;
      }
      const wasPresent = P.actorPresent[name], oldOutfit = memory.outfit;
      const actor = Object.assign({}, memory, spec, { name: name }); P.actorMemory[name] = actor; P.actorPresent[name] = true; P.actorSlots[name] = slot;
      window.TwistedVisuals.presentActor(slot, actor, memory);
      installPortraitCutout(images[name]);
      cues[name].textContent = actor.cue || actor.outfit || "";
      slot.classList.remove("portrait-focus", "portrait-dim", "portrait-off", "anim-enter-left", "anim-enter-right", "anim-exit-left", "anim-exit-right", "anim-speak", "anim-react", "cue-visible", "pose-doorway", "pose-crossed", "pose-leaning", "pose-counter", "pose-retreat", "expression-irritated", "expression-smug", "expression-surprised", "expression-soft", "expression-dazed", "outfit-sleepwear", "outfit-work", "outfit-evening", "outfit-evening-casual", "outfit-casual", "outfit-romantic");
      slot.classList.add("portrait-dim", "outfit-" + (actor.outfit || "casual"));
      const pose = { doorway: "pose-doorway", crossed: "pose-crossed", "arms-crossed": "pose-crossed", leaning: "pose-leaning", crate: "pose-leaning", counter: "pose-counter", "stepped-back": "pose-retreat", retreat: "pose-retreat" }[actor.pose];
      const expression = { irritated: "expression-irritated", annoyed: "expression-irritated", smug: "expression-smug", surprised: "expression-surprised", soft: "expression-soft", dazed: "expression-dazed" }[actor.expression];
      if (pose) slot.classList.add(pose); if (expression) slot.classList.add(expression);
      slot.hidden = false;
      if (!wasPresent) slot.classList.add(name === "Adeline" ? "anim-enter-left" : "anim-enter-right");
      else if (oldOutfit !== actor.outfit) { slot.classList.add("cue-visible"); window.setTimeout(() => slot.classList.remove("cue-visible"), 1800); }
    });
    P.lastSpeaker = null;
  }
  function installPortraitCutout(img) {
    if (img.dataset.cutoutHandler) return;
    img.dataset.cutoutHandler = "true";
    img.addEventListener("load", function () {
      const source = img.dataset.characterSrc || "";
      if (!img.naturalWidth || img.dataset.cleanedSrc === source) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(img, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = pixels.data;
        const visited = new Uint8Array(canvas.width * canvas.height);
        const queue = new Int32Array(canvas.width * canvas.height);
        let head = 0, tail = 0;
        function backgroundPixel(pixel) {
          const offset = pixel * 4, r = data[offset], g = data[offset + 1], b = data[offset + 2];
          return Math.min(r, g, b) > 148 && Math.max(r, g, b) - Math.min(r, g, b) < 62;
        }
        function addBackground(pixel) {
          if (pixel < 0 || pixel >= visited.length || visited[pixel] || !backgroundPixel(pixel)) return;
          visited[pixel] = 1; queue[tail++] = pixel;
        }
        for (let x = 0; x < canvas.width; x++) {
          addBackground(x); addBackground((canvas.height - 1) * canvas.width + x);
        }
        for (let y = 1; y < canvas.height - 1; y++) {
          addBackground(y * canvas.width); addBackground(y * canvas.width + canvas.width - 1);
        }
        while (head < tail) {
          const pixel = queue[head++], x = pixel % canvas.width, offset = pixel * 4;
          if (x > 0) addBackground(pixel - 1);
          if (x + 1 < canvas.width) addBackground(pixel + 1);
          addBackground(pixel - canvas.width); addBackground(pixel + canvas.width);
          if (visited[pixel]) data[offset + 3] = 0;
        }
        context.putImageData(pixels, 0, 0);
        cleanedPortraits.set(source, canvas.toDataURL("image/png"));
        img.dataset.cleanedSrc = source;
        img.dataset.backgroundCleaned = "true";
        img.src = cleanedPortraits.get(source);
      } catch (error) {
        img.dataset.backgroundCleaned = "failed";
        console.warn("[twisted] portrait cutout unavailable", error);
      }
    });
    if (img.complete && img.naturalWidth) img.dispatchEvent(new Event("load"));
  }

  /* Cutting a portrait out means re-encoding it to a data URL, which is far too
     expensive to repeat every time a scene swaps a look. Hold the cleaned
     results and hand them straight back when a look comes round again. */
  const cleanedPortraits = new Map();
  function setPortraitSource(img, src) {
    if (img.dataset.characterSrc === src) return;
    img.dataset.characterSrc = src;
    const cached = cleanedPortraits.get(src);
    img.dataset.cleanedSrc = cached ? src : "";
    img.dataset.backgroundCleaned = cached ? "true" : "false";
    img.src = cached || src;
  }
  if (window.TwistedVisuals) {
    window.TwistedVisuals.setPortraitSource = setPortraitSource;
    window.TwistedVisuals.installCutout = installPortraitCutout;
  }

  function animateExit(name, slot) {
    slot.hidden = false; slot.classList.remove("anim-enter-left", "anim-enter-right", "anim-exit-left", "anim-exit-right");
    slot.classList.add(name === "Adeline" ? "anim-exit-left" : "anim-exit-right");
    window.setTimeout(() => { if (!P.actorPresent[name]) slot.hidden = true; }, 580);
  }
  function applyLineCues(index) {
    const visual = P.visual; if (!visual) return;
    (visual.exitAfter && visual.exitAfter[index] || []).forEach(name => {
      if (!P.actorPresent[name]) return; P.actorPresent[name] = false; animateExit(name, P.actorSlots[name] || (name === "Adeline" ? el.slotLeft : el.slotRight));
    });
    (visual.enterAfter && visual.enterAfter[index] || []).forEach(name => {
      const actor = visual.actors && visual.actors[name], slot = P.actorSlots[name] || (name === "Adeline" ? el.slotLeft : el.slotRight);
      const image = name === "Adeline" ? el.imgLeft : el.imgRight;
      const cue = name === "Adeline" ? el.cueLeft : el.cueRight;
      if (!actor) return;
      P.actorMemory[name] = Object.assign({}, P.actorMemory[name], actor, { name: name, visible: true });
      window.TwistedVisuals.presentActor(slot, P.actorMemory[name], {});
      installPortraitCutout(image);
      cue.textContent = P.actorMemory[name].cue || P.actorMemory[name].outfit || "";
      slot.hidden = false; P.actorPresent[name] = true;
      slot.classList.remove("anim-exit-left", "anim-exit-right"); slot.classList.add(name === "Adeline" ? "anim-enter-left" : "anim-enter-right");
    });
  }

  /* ---------------- persistent character models / speaker staging ---------------- */
  function updatePortraits(speaker) {
    ["Adeline", "Zade"].forEach(name => {
      const slot = P.actorSlots[name], cue = name === "Adeline" ? el.cueLeft : el.cueRight;
      if (!slot || slot.hidden || !P.actorPresent[name]) return;
      const speaking = speaker && (speaker === name || speaker.indexOf(name) === 0);
      slot.classList.toggle("portrait-focus", !!speaking); slot.classList.toggle("portrait-dim", !speaking);
      if (speaking && P.lastSpeaker !== name) {
        slot.classList.remove("anim-speak", "anim-react"); void slot.offsetWidth; slot.classList.add("anim-speak"); cue.classList.add("cue-visible");
        window.setTimeout(() => cue.classList.remove("cue-visible"), 1700);
      } else if (!speaking && P.lastSpeaker && P.lastSpeaker !== name) {
        slot.classList.remove("anim-react"); void slot.offsetWidth; slot.classList.add("anim-react");
      }
      if (speaking) P.lastSpeaker = name;
    });
  }

  /* ---------------- optional browser-native character voice acting ---------------- */
  function loadVoiceSettings() {
    try {
      const data = JSON.parse(localStorage.getItem(VOICE_KEY) || "{}");
      V.enabled = data.enabled !== false;
      V.voices = Object.assign(V.voices, data.voices || {});
    } catch (_) {}
    el.btnVoiceToggle.setAttribute("aria-pressed", String(V.enabled));
    el.btnVoiceToggle.textContent = V.enabled ? "VO ON" : "VO OFF";
    el.btnVoiceToggle.title = V.enabled ? "Turn character voiceover off" : "Turn character voiceover on";
    if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
      V.available = true;
      window.speechSynthesis.onvoiceschanged = populateVoices;
      populateVoices();
    } else {
      V.available = false;
      el.btnVoiceToggle.textContent = "VO N/A";
      el.btnVoiceToggle.disabled = true;
      el.btnVoiceReplay.disabled = true;
    }
  }
  function populateVoices() {
    if (!V.available) return;
    const voices = window.speechSynthesis.getVoices();
    [["Adeline", el.voiceAdeline], ["Zade", el.voiceZade]].forEach(([name, select]) => {
      const selected = V.voices[name] || "";
      select.innerHTML = `<option value="">System voice · ${name === "Adeline" ? "feminine" : "masculine"}</option>`;
      voices.forEach((voice, index) => {
        const option = document.createElement("option"); option.value = String(index); option.textContent = voice.name + (voice.lang ? " · " + voice.lang : ""); select.appendChild(option);
      });
      select.value = selected;
    });
  }
  function persistVoiceSettings() {
    try { localStorage.setItem(VOICE_KEY, JSON.stringify({ enabled: V.enabled, voices: V.voices })); } catch (_) {}
  }
  function stopVoice() {
    V.generation++;
    el.slotLeft.classList.remove("audio-speaking"); el.slotRight.classList.remove("audio-speaking");
    if (V.available) window.speechSynthesis.cancel();
    V.utterance = null;
  }
  function voiceName(line, speaker) {
    if (speaker === "Adeline" || speaker === "Zade") return speaker;
    if (speaker === "Priya") return "Priya";
    return line.charAt(0) === "~" || line.charAt(0) === "*" ? P.scene.pov : (speaker || P.scene.pov);
  }
  function voiceText(line, info, speaker) {
    let spoken = info.text;
    const named = lineSpeaker(line);
    if (named && spoken.includes(":")) {
      spoken = spoken.slice(spoken.indexOf(":") + 1).trimStart();
    } else if (speaker === "Adeline" && named === null && info.cls === "soft") {
      spoken = spoken.replace(/^Adeline:\s*/i, "");
    }
    spoken = spoken.replace(/\*[^*]*\*/g, " ").replace(/[*~]/g, "").replace(/\s+/g, " ").trim();
    return spoken;
  }
  function speakLine(line, info, speaker) {
    stopVoice();
    const hasNamedSpeaker = !!lineSpeaker(line);
    if (!V.enabled || !V.available || !line || info.cls === "think" || (!hasNamedSpeaker && info.cls !== "soft")) return;
    const generation = V.generation;
    const name = voiceName(line, speaker), spoken = voiceText(line, info, speaker);
    if (!spoken) return;
    try {
      const utterance = new SpeechSynthesisUtterance(spoken);
      const voices = window.speechSynthesis.getVoices();
      const chosen = V.voices[name];
      if (chosen && voices[Number(chosen)]) utterance.voice = voices[Number(chosen)];
      else {
        const lang = (navigator.language || "en-US").toLowerCase();
        const local = voices.filter(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
        const candidates = local.length ? local : voices;
        const pattern = name === "Zade" ? /(david|guy|daniel|male|alex|james|mark)/i : /(samantha|aria|jenny|female|zira|karen|susan)/i;
        utterance.voice = candidates.find(v => pattern.test(v.name)) || candidates.find(v => /natural|neural|enhanced/i.test(v.name)) || candidates[0] || null;
      }
      const rate = name === "Zade" ? 0.91 : 0.97;
      utterance.rate = info.cls === "soft" ? rate * 0.94 : rate;
      utterance.pitch = name === "Zade" ? 0.83 : 1.08;
      utterance.volume = 0.92;
      const slot = name === "Zade" ? el.slotRight : el.slotLeft;
      utterance.onstart = function () { if (V.generation === generation) slot.classList.add("audio-speaking"); };
      utterance.onend = function () {
        slot.classList.remove("audio-speaking");
        if (V.generation === generation) V.utterance = null;
      };
      utterance.onerror = function (event) {
        slot.classList.remove("audio-speaking");
        if (event.error !== "canceled" && event.error !== "interrupted") console.warn("[twisted] voiceover playback issue", event.error);
      };
      V.utterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) { console.warn("[twisted] voiceover unavailable for line", error); }
  }
  function replayCurrentVoice() {
    if (!P.scene || !P.lines[P.lineIdx]) return;
    const raw = P.lines[P.lineIdx], line = E.interp(raw), info = styleLine(line);
    const named = lineSpeaker(line);
    if (info.cls === "think" || (!named && info.cls !== "soft")) return;
    const speaker = named || (info.cls === "soft" ? voiceName(line, P.scene.pov) : P.scene.pov);
    if (!V.enabled) { V.enabled = true; persistVoiceSettings(); loadVoiceSettings(); }
    speakLine(line, info, speaker);
  }

  /* ---------------- act cards, text and input ---------------- */
  function showActCard(sc) {
    return new Promise(resolve => {
      el.actKicker.textContent = sc.act.kicker || "Chapter One"; el.actTitle.textContent = sc.act.title || ""; el.actSub.textContent = sc.act.sub || "";
      el.actCard.hidden = false; el.actCard.classList.add("show"); setMood(sc.act.mood);
      setTimeout(() => { el.actCard.classList.remove("show"); setTimeout(() => { el.actCard.hidden = true; resolve(); }, 620); }, 2100);
    });
  }
  function styleLine(raw) {
    if (raw.charAt(0) === "*") return { cls: "think", text: raw.slice(1).replace(/^\s*/, "").replaceAll("*", "") };
    if (raw.charAt(0) === "~") return { cls: "soft", text: raw.slice(1).replace(/^\s*/, "").replaceAll("*", "") };
    return { cls: "", text: raw.replaceAll("*", "") };
  }
  function lineSpeaker(raw) {
    const text = raw.charAt(0) === "~" || raw.charAt(0) === "*" ? raw.slice(1) : raw;
    const colon = text.indexOf(":"), space = text.indexOf(" ");
    return colon > 0 && (space === -1 || colon < space) ? text.slice(0, colon) : null;
  }
  function typewrite(node, text, instant) {
    if (instant) { node.textContent = text; return Promise.resolve(); }
    return new Promise(resolve => {
      let i = 0, cancelled = false;
      const handle = { done: false, finish: finish }; P.typing = handle;
      function finish() { if (cancelled) return; cancelled = true; node.textContent = text; handle.done = true; resolve(); }
      (function step() {
        if (cancelled || handle.done) return;
        if (i >= text.length) { finish(); return; }
        const ch = text.charAt(i++); node.textContent = text.slice(0, i); el.dialogueText.scrollTop = el.dialogueText.scrollHeight;
        setTimeout(step, ".!?".includes(ch) ? 190 : ",;—".includes(ch) ? 90 : TYPE_MS);
      })();
    });
  }
  function presentLine(idx, instant) {
    const token = P.token, line = E.interp(P.lines[idx]), info = styleLine(line);
    const speaker = info.cls === "think" ? P.scene.pov : (lineSpeaker(line) || P.scene.pov);
    el.speakerName.textContent = info.cls === "think" ? P.scene.pov + " — thinking" : speaker;
    el.speakerName.dataset.who = speaker || "";
    el.povChip.textContent = "POV · " + P.scene.pov; el.hudPov.textContent = P.scene.pov === "Adeline" ? "HER POV" : "HIS POV";
    updatePortraits(speaker);
    speakLine(line, info, speaker);
    const display = Object.assign({}, info);
    if (lineSpeaker(line) && display.text.includes(":")) display.text = display.text.slice(display.text.indexOf(":") + 1).trimStart();
    el.dialogueText.innerHTML = ""; const span = document.createElement("span"); if (display.cls) span.className = display.cls;
    const node = document.createTextNode(""); span.appendChild(node); el.dialogueText.appendChild(span); setStatus("typing");
    return typewrite(node, display.text, instant).then(() => {
      if (P.token !== token) return; applyLineCues(idx); setStatus("wait"); if (idx === P.lines.length - 1) afterLastLine();
    });
  }
  function afterLastLine() {
    const sc = P.scene;
    if (sc.choices && sc.choices.length) { renderChoices(sc); setStatus("choices"); }
    else setStatus("wait");
  }
  function renderChoices(sc) {
    const choices = E.visibleChoices ? E.visibleChoices() : (sc.choices || []);
    el.gameScreen.classList.add("has-choices"); el.choices.innerHTML = "";
    choices.forEach((choice, index) => {
      const button = document.createElement("button"); button.className = "choice-btn"; button.textContent = E.interp(choice.label);
      const parts = [choice.hint, choice.flavor].filter(Boolean);
      if (parts.length) { const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = parts.join(" · "); button.appendChild(tag); }
      button.addEventListener("click", event => { event.stopPropagation(); el.choices.hidden = true; el.gameScreen.classList.remove("has-choices"); el.choices.innerHTML = ""; E.choose(index); });
      el.choices.appendChild(button);
    });
    el.choices.hidden = false;
  }
  function showScene(payload) {
    P.token++; const token = P.token, previousId = P.sceneId, sc = payload.scene;
    P.sceneId = payload.id; P.scene = sc; P.lineIdx = 0; updateSceneVisual(payload.id, sc, previousId);
    el.choices.hidden = true; el.gameScreen.classList.remove("has-choices"); el.choices.innerHTML = ""; el.dialogue.classList.add("hidden"); setMood(sc.mood || (sc.act && sc.act.mood));
    const run = function () {
      if (token !== P.token) return; P.lines = (sc.lines || []).slice();
      if (!P.lines.length) { afterLastLine(); return; }
      el.dialogue.classList.remove("hidden"); presentLine(0, !!payload.restore && !!E.state().seen[payload.id]);
    };
    if (sc.act && !(payload.restore && E.state().actsSeen && E.state().actsSeen[sc.act.id])) {
      markActSeen(sc.act.id); setStatus("card"); showActCard(sc).then(() => { if (token === P.token) run(); });
    } else run();
  }
  function markActSeen(id) { const state = E.state(); state.actsSeen = state.actsSeen || {}; if (id) state.actsSeen[id] = true; E.save(); }
  function advance() {
    if (P.status === "typing" && P.typing && !P.typing.done) { P.typing.finish(); return; }
    if (P.status !== "wait") return;
    if (P.lineIdx < P.lines.length - 1) { P.lineIdx++; presentLine(P.lineIdx, false); }
    else E.next();
  }
  function showEnd() {
    stopVoice(); P.token++; setStatus("end"); el.choices.hidden = true; el.gameScreen.classList.remove("has-choices"); el.dialogue.classList.add("hidden");
    P.actorPresent.Adeline = false; P.actorPresent.Zade = false; el.slotLeft.hidden = true; el.slotRight.hidden = true;
    const state = E.state(), close = state.flags.chapter_close || "smolder";
    const codes = { spark: "Close 1 · Spark", smolder: "Close 2 · Smolder", cold: "Close 3 · Cold Truce" };
    $("endCodeBlock").textContent = codes[close] || codes.smolder;
    const notes = { zade: "A folded note waits under Zade’s door. Cream paper. Her handwriting: ‘The noodles needed salt. See you tomorrow, neighbor.’", adeline: "A folded note waits under Adeline’s door. Graph paper. His handwriting: ‘Best noodles in the city. Same time tomorrow — Z.’" };
    el.endReport.textContent = notes[state.flags.note_under_door_of === "zade" ? "zade" : "adeline"]; setMood("end"); show(el.endScreen);
  }
  function toTitle() { stopVoice(); P.token++; setStatus("idle"); setMood("title"); el.btnContinue.disabled = !E.hasSave(); show(el.titleScreen); }
  function startNew() {
    spawnDust(); stopVoice();
    if (window.TwistedIntro) {
      window.TwistedIntro.play().then(() => {
        E.freshStart(); show(el.gameScreen); setMood("morning");
      });
    } else {
      show(el.gameScreen); setMood("morning"); E.freshStart();
    }
  }
  function doContinue() {
    stopVoice();
    if (!E.continueSaved()) return;
    if (window.TwistedIntro) window.TwistedIntro.close();
    spawnDust(); show(el.gameScreen);
  }
  function openMenu(open) { el.menuDrawer.hidden = !open; }

  window.addEventListener("resize", () => {
    /* Same key on both sides: the skip test inside each renderer lets it through
       only when the size changed, so a resize re-measures the near layer. */
    if (P.visual && P.sceneId) {
      window.TwistedVisuals.renderBackground(el.sceneBackground, P.visual.background, P.visual.background);
      window.TwistedVisuals.renderForeground(el.sceneForeground, P.visual.background, P.visual.background);
    }
  });

  document.addEventListener("keydown", event => {
    if (!el.gameScreen.classList.contains("visible")) return;
    if (!el.menuDrawer.hidden) { if (event.key === "Escape") openMenu(false); return; }
    if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") { event.preventDefault(); advance(); }
    if (event.key === "Escape") openMenu(true);
  });
  document.addEventListener("click", event => {
    if (!el.gameScreen.classList.contains("visible")) return;
    if (event.target.closest("#choices, #menuDrawer, button, .hud-btn, .menu-panel")) return;
    advance();
  });
  E.on("scene", showScene); E.on("end", showEnd); E.on("mood", setMood);
  E.on("chapter", def => { $("hudChapter").textContent = "Chapter " + def.num + " · " + def.title; });
  el.btnVoiceToggle.addEventListener("click", () => { V.enabled = !V.enabled; if (!V.enabled) stopVoice(); persistVoiceSettings(); loadVoiceSettings(); });
  el.btnVoiceReplay.addEventListener("click", replayCurrentVoice);
  el.voiceAdeline.addEventListener("change", () => { V.voices.Adeline = el.voiceAdeline.value; persistVoiceSettings(); replayCurrentVoice(); });
  el.voiceZade.addEventListener("change", () => { V.voices.Zade = el.voiceZade.value; persistVoiceSettings(); replayCurrentVoice(); });
  el.btnNew.addEventListener("click", startNew); el.btnContinue.addEventListener("click", doContinue); el.btnMenu.addEventListener("click", () => openMenu(true)); el.btnResume.addEventListener("click", () => openMenu(false));
  el.btnSaveQuit.addEventListener("click", () => { E.save(); openMenu(false); toTitle(); });
  el.btnWipe.addEventListener("click", () => { E.wipe(); el.btnContinue.disabled = true; openMenu(false); toTitle(); });
  el.btnCheats.addEventListener("click", () => {
    const state = E.state(); el.flagDump.style.display = el.flagDump.style.display === "block" ? "none" : "block";
    el.flagDump.textContent = "flags: " + JSON.stringify(state.flags) + "\n" + "stats: " + JSON.stringify(state.stats) + "\n" + "scene: " + state.sceneId;
  });
  el.btnReplay.addEventListener("click", () => { show(el.gameScreen); setMood("morning"); E.freshStart(); }); el.btnEndTitle.addEventListener("click", toTitle);
  setMood("title"); spawnDust(); el.btnContinue.disabled = !E.hasSave(); loadVoiceSettings();
})();
