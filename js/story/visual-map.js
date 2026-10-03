/* ============================================================
   TWISTED — Chapter 1 visual direction.
   Persistent designs; scene-specific wardrobe, expression, blocking,
   original vector backdrop, props and transition cues.
   ============================================================ */
(function () {
  "use strict";
  const scenes = {};
  const add = (ids, background, actors, transition, props, extra) => ids.forEach(id => { scenes[id] = Object.assign({ background, actors, transition, props: props || [] }, extra || {}); });
  const adSleep = { Adeline: { outfit: "sleepwear", pose: "resting", expression: "sleeping", cue: "Satin black night-suit · sleep mask" } };
  const adWork = { Adeline: { outfit: "work", pose: "composed", expression: "confident", cue: "Black blazer over an ivory camisole · tailored trousers" } };
  const hallwayPair = {
    Adeline: { outfit: "sleepwear", pose: "doorway", expression: "irritated", cue: "Satin night-suit · white piping · arms crossed" },
    Zade: { outfit: "casual", pose: "boxes", expression: "smug", cue: "Denim jacket · graphic tee · boxes" },
  };
  const workPair = {
    Adeline: { outfit: "work", pose: "doorway", expression: "confident", cue: "Black blazer over an ivory camisole · tailored trousers" },
    Zade: { outfit: "casual", pose: "crate", expression: "smug", cue: "Denim jacket · graphic tee · crates" },
  };
  const dinnerPair = {
    Adeline: { outfit: "evening", pose: "relaxed", expression: "guarded", cue: "Cream sweater · jeans · not a date" },
    Zade: { outfit: "evening-casual", pose: "attentive", expression: "charming", cue: "Open-collar charcoal shirt · dark trousers" },
  };
  const zadeNight = { Zade: { outfit: "midnight", pose: "loose", expression: "wry", cue: "White tee · grey joggers · midnight, alone" } };
  const zade = { Zade: { outfit: "casual", pose: "standing", expression: "thoughtful", cue: "Denim jacket · sleeves shoved up" } };

  add(["act1", "wake", "wake_react", "wake_fume", "wake_wall"], "bedroom-morning", adSleep,
    "Late-morning quiet breaks with hallway thuds; Adeline wakes and heads for the door.", ["clock", "rumpled bed", "sleep mask"]);
  add(["c1", "c1_choice", "c1_slam", "c1_comeback", "c1_threat"], "hallway-morning", hallwayPair,
    "Adeline steps into the narrow hall from the left; Zade turns from moving boxes on the right.", ["moving boxes", "power drill", "apartment doors"]);
  ["c1", "c1_choice", "c1_slam", "c1_comeback", "c1_threat"].forEach(id => {
    scenes[id].actors.Adeline.expression = "irritated";
    scenes[id].actors.Zade.expression = "smug";
  });
  scenes.c1_slam.exitAfter = { 0: ["Adeline"] };
  scenes.c1_comeback.exitAfter = { 2: ["Adeline"] };
  scenes.c1_threat.exitAfter = { 3: ["Adeline"] };
  add(["c2", "c2_choice", "c2_yell", "c2_pillow", "c2_smile"], "bedroom-morning", adSleep,
    "Cut inside to Adeline’s bedroom; Zade remains voice-only beyond the closed door and shared wall.", ["closed door", "pillow", "shared wall", "power drill"]);
  add(["act2"], "bedroom-afternoon", { Adeline: { outfit: "sleepwear", pose: "mirror", expression: "thoughtful", cue: "Still in the night-suit · deciding" } },
    "Dissolve from the quiet afternoon hall into Adeline’s closet and mirror; she is still deciding what to wear.", ["closet", "full-length mirror", "work bag"]);
  add(["ready", "ready_choice"], "bedroom-afternoon", adWork,
    "Reveal Adeline’s finished work look in the mirror; she gathers her bag before heading into the hall.", ["closet", "full-length mirror", "work bag"]);
  add(["hall", "hall_choice", "hall_tease", "hall_consider", "hearts", "hearts_choice"], "hallway-afternoon", workPair,
    "Adeline returns from the left; Zade looks up from a crate, briefly mesmerized, then leans back into his charm.", ["partly unpacked boxes", "crate", "water glass"]);
  add(["goodbye"], "hallway-afternoon", workPair,
    "Adeline heads left for work; the camera holds on Zade’s smile after she leaves.", ["moving boxes"], { exitAfter: { 5: ["Adeline"] } });
  add(["phone"], "office-evening", { Adeline: { outfit: "work", pose: "desk", expression: "amused", cue: "The blazer again · 6:40 PM" } },
    "Cool office light; show Priya’s messages as text bubbles on Adeline’s phone, not as a physical model.", ["spreadsheet", "phone"], { textCharacters: ["Priya"] });
  add(["act3", "boxes", "prep_choice", "z_ready"], "zade-apartment-evening", zade,
    "Pan across Zade’s half-built apartment to the kitchen; carry the clock’s approach to nine into the next scene.", ["moving boxes", "unlabeled journal box", "spatula", "stove"]);
  add(["door_choice", "door_early", "door_sharp", "door_late"], "hallway-evening", {
    Zade: { outfit: "evening-casual", pose: "at-door", expression: "hopeful", cue: "Charcoal suit · no tie · dinner in hand" },
    Adeline: { outfit: "evening", pose: "behind-door", expression: "guarded", cue: "Cream sweater · jeans · home-casual", visible: false },
  }, "Frame Zade and Adeline’s closed door; use a clock insert for early, sharp or late arrival.", ["dinner container", "closed apartment door", "warm light under door"]);
  scenes.door_early.actors.Adeline.visible = false;
  scenes.door_early.enterAfter = { 0: ["Adeline"] };
  scenes.door_early.exitAfter = { 3: ["Adeline"] };
  scenes.door_sharp.enterAfter = { 0: ["Adeline"] };
  add(["locked_out"], "hallway-night", {
    Zade: { outfit: "evening-casual", pose: "at-door", expression: "apologetic", cue: "Dinner in hand · waiting outside" },
    Adeline: { outfit: "evening", pose: "doorway", expression: "annoyed", cue: "Cream sweater · furious, almost smiling", visible: false },
  }, "Follow the note beneath the door; after the second knock, the lock turns and Adeline appears.", ["folded note", "closed door", "dinner container"], { enterAfter: { 6: ["Adeline"] } });
  add(["d1"], "adeline-interior-night", dinnerPair,
    "Zade enters from the hall; Adeline leads him toward the table and gestures for shoes off.", ["entry door", "shoes", "warm apartment light"]);
  add(["d2", "d3", "d4", "d5"], "dining-night", dinnerPair,
    "Reveal the table for two in candlelight; keep both characters seated through dinner and the bookshelf exchange.", ["two plates", "two glasses", "good candles", "noodles", "dog-eared novels", "bookshelf", "chopsticks"]);
  add(["d6", "d7"], "fire-escape-night", dinnerPair,
    "Follow them from the dishes to the fire-escape doorway; distant city lights shift orange to indigo.", ["two wine glasses", "fire escape", "city lights", "balcony door"]);
  /* Dinner clothes carry through the kitchen conversation. The catalog looks
     appear only after Adeline chooses closeness or honesty, not in the joke branch. */
  add(["d8", "d9", "d10_choice"], "kitchen-night", dinnerPair,
    "Back inside in their dinner clothes, the conversation moves from playful truth to a close-quarters moment in the kitchen.", ["kitchen counter", "clean plate", "chopsticks", "stove"]);
  add(["k1"], "kitchen-night", {
    Adeline: { outfit: "romantic", pose: "close", expression: "soft", cue: "Burgundy satin robe · lace set · takes his collar" },
    Zade: { outfit: "romantic", pose: "close", expression: "tender", cue: "Open leather jacket · bare chest · waits for consent" },
  }, "After Adeline chooses to close the distance, shift to their intimate looks; pause after Zade asks and move only after her clear yes.", ["cooling pan", "kitchen counter"], { exitAfter: { 7: ["Zade"] } });
  add(["real1"], "kitchen-night", {
    Adeline: { outfit: "romantic", pose: "counter", expression: "listening", cue: "Burgundy satin robe · lace set · listening closely" },
    Zade: { outfit: "romantic", pose: "stepped-back", expression: "vulnerable", cue: "Open leather jacket · bare chest · one step back" },
  }, "For the honest answer, keep the intimate looks but have Zade take one deliberate step back.", ["kitchen counter", "refrigerator"]);
  add(["real2"], "adeline-interior-night", {
    Adeline: { outfit: "romantic", pose: "doorway", expression: "soft", cue: "Burgundy satin robe · lace set · kisses his cheek" },
    Zade: { outfit: "romantic", pose: "retreat", expression: "soft", cue: "Open leather jacket · bare chest · goodnight" },
  }, "Adeline leads him to the threshold and kisses his cheek; Zade exits into the hallway after goodnight.", ["entry door", "kitchen light"], { exitAfter: { 4: ["Zade"] } });
  add(["joke1", "joke2"], "kitchen-night", dinnerPair,
    "Adeline’s genuine laugh breaks the tension; she points Zade toward the door and he leaves for home.", ["counter", "plate", "cooling pan"], { exitAfter: { 2: ["Zade"] } });
  add(["close_joke_check"], "zade-apartment-midnight", zadeNight,
    "Zade returns to his cardboard-filled apartment, replaying Adeline’s laugh.", ["moving boxes", "bedroom doorway"]);
  add(["close_spark"], "zade-apartment-midnight", zadeNight,
    "Follow the cream note from beneath Zade’s door to his hand; hold on his laugh.", ["cream note", "moving boxes", "apartment door"]);
  add(["close_smolder"], "zade-apartment-midnight", zadeNight,
    "Close on the graph-paper note, then rack focus to Zade drafting a reply on a box flap.", ["graph-paper note", "pen", "moving-box flap"]);
  add(["close_cold"], "cold-midnight", zadeNight,
    "Start on Zade awake on the mattress; follow him to Adeline’s door as he leaves his note.", ["mattress", "handwritten note", "closed door"], { exitAfter: { 3: ["Zade"] } });

  window.TWISTED_SCENE_VISUALS = { scenes: scenes };
})();
