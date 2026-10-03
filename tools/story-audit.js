/* Headless story graph audit. Run with: node tools/story-audit.js */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const registry = {};
const sandbox = { window: { TwistedEngine: { registerChapter: (n, d) => { registry[n] = d; } } } };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, "../js/story/chapter1.js"), "utf8"), sandbox);
const chapter = registry[1];
if (!chapter) throw new Error("chapter 1 did not register");
const scenes = chapter.scenes;
const errors = [];
const requireScenes = ["act1", "wake_react", "c1", "c1_slam", "c1_comeback", "c1_threat", "c2", "act2", "hall", "hearts", "phone", "act3", "door_choice", "door_late", "locked_out", "d10_choice", "k1", "real1", "joke1", "close_spark", "close_smolder", "close_cold"];
for (const id of requireScenes) if (!scenes[id]) errors.push(`missing scene ${id}`);

for (const [id, scene] of Object.entries(scenes)) {
  if (scene.next === undefined && !scene.choices?.length) errors.push(`${id}: no next or choices`);
  for (const choice of scene.choices || []) {
    if (!choice.label || choice.goto === undefined) errors.push(`${id}: incomplete choice`);
    if (typeof choice.goto === "string" && !scenes[choice.goto]) errors.push(`${id}: invalid choice target ${choice.goto}`);
    for (const effect of choice.effects || []) {
      if (effect.add && !effect.stat) errors.push(`${id}: stat effect has no stat`);
    }
  }
  if (typeof scene.next === "string" && !scenes[scene.next]) errors.push(`${id}: invalid next target ${scene.next}`);
  for (const effect of scene.effects || []) if (effect.add && !effect.stat) errors.push(`${id}: stat effect has no stat`);
  for (const line of scene.lines || []) {
    if ((line.match(/\{if:/g) || []).length !== (line.match(/\{endif\}/g) || []).length) errors.push(`${id}: unbalanced condition`);
  }
}

const tracked = ["impression", "temper", "attraction_ad", "attraction_z", "trust", "punctuality", "kissed_dinner"];
const serialized = JSON.stringify(scenes);
for (const name of tracked) if (!serialized.includes(name)) errors.push(`tracked state not used in story: ${name}`);

function cloneState(s) { return { id: s.id, flags: { ...s.flags }, stats: { ...s.stats } }; }
function applyEffects(effects, state) {
  for (const effect of effects || []) {
    if (effect.set !== undefined) state.flags[effect.set] = effect.value === undefined ? true : effect.value;
    if (effect.add) state.stats[effect.stat] = (state.stats[effect.stat] || 0) + effect.add;
  }
}
function condition(text, state) {
  const statMatch = text.match(/^(\w+)\s*(>=|<=|>)\s*(-?\d+)$/);
  if (statMatch) {
    const value = state.stats[statMatch[1]] || 0;
    return statMatch[2] === ">=" ? value >= +statMatch[3] : statMatch[2] === "<=" ? value <= +statMatch[3] : value > +statMatch[3];
  }
  const eq = text.match(/^(\w+)\s*=\s*(.+)$/);
  if (eq) return state.flags[eq[1]] === eq[2];
  return text[0] === "!" ? !state.flags[text.slice(1)] : !!state.flags[text];
}
let completePaths = 0;
const closes = {};
const branchReach = new Set();
function route(state, visited) {
  const scene = scenes[state.id];
  if (!scene) { errors.push(`walk reached missing ${state.id}`); return; }
  const key = `${state.id}|${JSON.stringify(state.flags)}|${JSON.stringify(state.stats)}`;
  if (visited.has(key)) { errors.push(`loop at ${state.id}`); return; }
  visited.add(key);
  applyEffects(scene.effects, state);
  if (scene.next === null) {
    completePaths++;
    closes[state.flags.chapter_close] = (closes[state.flags.chapter_close] || 0) + 1;
    return;
  }
  const choices = (scene.choices || []).filter(c => !c.if || condition(c.if, state));
  if (choices.length) {
    for (const choice of choices) {
      const branch = cloneState(state);
      applyEffects(choice.effects, branch);
      if (scene === scenes.c1_choice && choice.goto === "c1_threat") branchReach.add("icy");
      if (scene === scenes.door_choice && choice.goto === "door_late") branchReach.add("locked-out");
      if (scene === scenes.d10_choice) branchReach.add(choice.goto === "k1" ? "kiss" : choice.goto === "real1" ? "real-talk" : "joke");
      branch.id = typeof choice.goto === "function" ? choice.goto(branch) : choice.goto;
      route(branch, new Set(visited));
    }
    return;
  }
  const target = typeof scene.next === "function" ? scene.next(state) : scene.next;
  if (!target) { errors.push(`${state.id}: route ended without a chapter close`); return; }
  state.id = target;
  route(state, visited);
}
route({ id: chapter.start, flags: {}, stats: { attraction_ad: 0, attraction_z: 0, trust: 0, temper: 0, kissed_dinner: 0 } }, new Set());
for (const close of ["spark", "smolder", "cold"]) if (!closes[close]) errors.push(`unreachable close: ${close}`);
for (const branch of ["icy", "locked-out", "kiss", "real-talk", "joke"]) if (!branchReach.has(branch)) errors.push(`unreachable branch: ${branch}`);
if ((scenes.d10_choice.choices || []).length !== 3) errors.push("climax must expose three choices");
if ((scenes.c1_choice.choices || []).length !== 3) errors.push("door standoff must expose three choices");
console.log(`scenes: ${Object.keys(scenes).length}`);
console.log(`complete paths: ${completePaths}`);
console.log(`closes: ${JSON.stringify(closes)}`);
console.log(`major branches: ${[...branchReach].join(", ")}`);
if (errors.length) { console.error(errors.map(e => `✗ ${e}`).join("\n")); process.exit(1); }
console.log("AUDIT PASSED ✓");
