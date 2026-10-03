/* ============================================================
   TWISTED — visual direction + original vector scene art.
   Reusable painterly backdrops for the first chapter; character art
   remains the supplied portraits, with wardrobe/pose/expression cues.
   ============================================================ */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  /* Bright, saturated room palettes: [wall top, wall bottom, light source,
     floor]. Night scenes keep a blue cast but stay legible, the way the
     reference rooms read as real places rather than murky gradients. */
  const palettes = {
    "bedroom-morning": ["#b6c2ea", "#ecdfc9", "#ffeaa6", "#cba87c"],
    "hallway-morning": ["#a9b6e0", "#ead9bd", "#ffe3a0", "#b2906c"],
    "bedroom-afternoon": ["#f2c88c", "#ffe9c2", "#fff2c6", "#cca06c"],
    "hallway-afternoon": ["#f0b87c", "#ffddac", "#fff0c4", "#bb8859"],
    "office-evening": ["#7e97b8", "#bccbdc", "#ffdda2", "#818d99"],
    "zade-apartment-evening": ["#9d8499", "#d8ac84", "#ffd29b", "#8d7469"],
    "kitchen-evening": ["#b48a72", "#e6af86", "#ffe0ae", "#907260"],
    "hallway-evening": ["#8679a8", "#cb9e88", "#ffcd92", "#7d6d77"],
    "hallway-night": ["#4b5679", "#8287b0", "#ffcb8d", "#4f5169"],
    "adeline-interior-night": ["#7f6b90", "#bd8d88", "#ffca97", "#72616a"],
    "dining-night": ["#7d6172", "#ba7d6c", "#ffc180", "#6e5864"],
    "fire-escape-night": ["#3b4b75", "#637cab", "#ffbb7a", "#4d5874"],
    "kitchen-night": ["#6e5c6b", "#a87d6c", "#ffc589", "#665963"],
    "zade-apartment-midnight": ["#4f5674", "#878ca4", "#ffc088", "#585d71"],
    "cold-midnight": ["#4b6175", "#8298ab", "#d5e7f4", "#516473"],
  };
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

  function svgRoot(key, portrait) {
    const colors = palettes[key] || palettes["hallway-morning"];
    const viewBox = portrait ? "0 0 900 1600" : "0 0 1600 900";
    return `<svg class="scene-art" viewBox="${viewBox}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(key.replaceAll("-", " "))} scene illustration" xmlns="${NS}">
      <defs>
        <linearGradient id="wall" x2="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient>
        <linearGradient id="floor" x2="0" y2="1"><stop stop-color="${colors[3]}"/><stop offset="1" stop-color="${colors[3]}"/></linearGradient>
        <linearGradient id="windowGlow" x2="0" y2="1"><stop stop-color="${colors[2]}" stop-opacity=".98"/><stop offset="1" stop-color="${colors[2]}" stop-opacity=".18"/></linearGradient>
        <linearGradient id="shade" x2="0" y2="1"><stop stop-color="#2b2029" stop-opacity="0"/><stop offset=".7" stop-color="#2b2029" stop-opacity=".03"/><stop offset="1" stop-color="#2b2029" stop-opacity=".20"/></linearGradient>
        <radialGradient id="lamp"><stop stop-color="${colors[2]}" stop-opacity=".55"/><stop offset="1" stop-color="${colors[2]}" stop-opacity="0"/></radialGradient>
        <pattern id="wood" width="170" height="38" patternUnits="userSpaceOnUse"><rect width="170" height="38" fill="${colors[3]}"/><path d="M0 36H170M42 0v36m87-36v36" stroke="#6b4f3c" stroke-opacity=".28" stroke-width="3"/></pattern>
      </defs>`;
  }
  const rect = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const line = (x1, y1, x2, y2, stroke = "#251e23", width = 5, opacity = .45) => `<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}"/>`;
  const windowArt = (x, y, w, h) => `<g>${rect(x, y, w, h, "#292a38", 3)}${rect(x + 12, y + 12, w - 24, h - 24, "url(#windowGlow)", 1)}${line(x + w / 2, y + 12, x + w / 2, y + h - 12, "#332c32", 12, .8)}${line(x + 10, y + h * .58, x + w - 10, y + h * .58, "#332c32", 10, .8)}${rect(x - 18, y - 18, w + 36, 20, "#302932", 2)}<path d="M${x - 28} ${y}Q${x - 12} ${y + h * .38} ${x - 24} ${y + h}L${x + 12} ${y + h}L${x + 12} ${y}ZM${x + w - 12} ${y}L${x + w + 20} ${y}Q${x + w + 7} ${y + h * .55} ${x + w + 22} ${y + h}L${x + w - 12} ${y + h}Z" fill="#4d3943" opacity=".86"/></g>`;
  const box = (x, y, w, h, label = "") => `<g>${rect(x + 7, y + 8, w, h, "#17171d", 3, 'opacity=".35"')}${rect(x, y, w, h, "#a47e5e", 3)}${line(x + w / 2, y, x + w / 2, y + h, "#513d34", 4, .55)}${line(x, y + h * .38, x + w, y + h * .38, "#6b4f3c", 3, .62)}${label ? `<text x="${x + w * .13}" y="${y + h * .68}" font-family="Georgia,serif" font-size="${Math.min(22, w / 8)}" fill="#3a302c" opacity=".65">${esc(label)}</text>` : ""}</g>`;

  function bedroom(key) {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${line(0, 150, 1600, 150, "#514b50", 3, .18)}${windowArt(120, 92, 310, 310)}<ellipse cx="300" cy="320" rx="320" ry="350" fill="url(#lamp)"/><g>${rect(580, 505, 760, 250, "#463b3c", 16)}${rect(550, 474, 815, 105, "#c6b6ac", 24)}${rect(620, 486, 245, 94, "#e1d4c8", 30)}${rect(884, 484, 245, 94, "#b8a8a1", 30)}${rect(545, 716, 835, 91, "#392c35", 12)}${rect(585, 790, 55, 95, "#30252b", 4)}${rect(1280, 788, 55, 96, "#30252b", 4)}</g>${rect(0, 825, 1600, 75, "url(#wood)")}${rect(126, 568, 260, 220, "#493d3a", 7)}${rect(146, 592, 220, 150, "#362f32", 3)}${rect(177, 617, 115, 58, "#d7bd92", 4)}<text x="187" y="657" fill="#514238" font-size="32" font-family="Georgia">10:04</text><path d="M242 567L280 477L319 567Z" fill="#bc9b72"/><ellipse cx="282" cy="583" rx="210" ry="270" fill="url(#lamp)"/>`;
  }
  function hallway(key) {
    const night = key.includes("night") || key.includes("midnight");
    const dusk = key.includes("evening") || night;
    const boxes = night ? box(930, 605, 170, 155, "FRAGILE") : box(830, 568, 235, 196, "BOOKS") + box(1055, 635, 170, 140, "KITCHEN");
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${rect(0, 0, 1600, 120, "#25252d", 0, 'opacity=".3"')}${line(0, 120, 1600, 120, "#efe0c5", 3, .15)}${rect(0, 694, 1600, 206, "url(#floor)")}${Array.from({ length: 11 }, (_, i) => line(i * 170 - 180, 900, 730 + (i - 5) * 20, 694, "#17171c", 3, .42)).join("")}${line(0, 694, 1600, 694, "#1a181d", 5, .5)}<g>${rect(120, 190, 350, 504, "#332c32", 5)}${rect(142, 212, 306, 482, "#85644f", 2)}${rect(170, 234, 250, 460, "#9b7659", 2, 'opacity=".45"')}${rect(1210, 180, 305, 514, "#302930", 5)}${rect(1232, 204, 262, 490, "#684e43", 2)}<circle cx="405" cy="452" r="9" fill="#d7b983"/><circle cx="1260" cy="452" r="9" fill="#c89d62"/>${rect(735, 132, 126, 24, "#28272d", 12)}<ellipse cx="798" cy="165" rx="280" ry="210" fill="url(#lamp)"/></g>${boxes}<g opacity="${dusk ? ".5" : ".76"}">${rect(488, 292, 197, 150, "#24242d", 5)}${rect(504, 308, 165, 118, "#b89b78", 2)}<path d="M522 404L566 344L603 391L632 352L661 407Z" fill="#515057"/></g>${rect(0, 875, 1600, 25, "#121218")}`;
  }
  function closet() {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${windowArt(1130, 95, 260, 300)}${rect(140, 120, 570, 640, "#392e33", 8)}${rect(166, 147, 518, 585, "#aa8b70", 3)}${rect(193, 170, 464, 550, "#44353b", 3)}${line(212, 280, 638, 280, "#cfb389", 8, .75)}${[250, 335, 420, 505, 590].map((x, i) => `<path d="M${x} 280v35l-24 20v150q40 28 80 0V335l-24-20v-35" fill="${["#25242b", "#66544b", "#312832", "#8b6b5b", "#29272d"][i]}" stroke="#c2a681" stroke-width="3"/>`).join("")}${rect(850, 108, 14, 615, "#e1c69e", 5)}${rect(876, 135, 440, 580, "#332d34", 12)}${rect(893, 152, 406, 546, "#c4a586", 4)}${rect(908, 168, 376, 514, "#665b5d", 2)}<ellipse cx="1100" cy="420" rx="122" ry="168" fill="#dab59a" opacity=".28"/><path d="M962 691Q985 563 1101 550Q1219 568 1245 691Z" fill="#26242b"/><path d="M1018 566L1103 642L1187 566" fill="none" stroke="#b99478" stroke-width="15"/>${rect(0, 810, 1600, 90, "url(#wood)")}`;
  }
  function office() {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${windowArt(1020, 100, 430, 370)}${rect(0, 690, 1600, 210, "url(#floor)")}${rect(160, 580, 1000, 34, "#392d30", 8)}${rect(230, 614, 40, 220, "#2b262b", 5)}${rect(1035, 614, 40, 220, "#2b262b", 5)}${rect(540, 325, 440, 250, "#282831", 16)}${rect(560, 344, 400, 210, "#54616a", 6)}<path d="M577 510L650 430L714 478L796 389L944 510Z" fill="#d3a878" opacity=".55"/><path d="M575 525H938M575 501H825M575 477H695" stroke="#d8c4a6" stroke-width="6" opacity=".32"/>${rect(587, 555, 340, 18, "#26242a", 3)}${rect(730, 572, 60, 40, "#29262c", 4)}${rect(1290, 533, 135, 74, "#302a30", 10)}${rect(1304, 544, 108, 47, "#c7936d", 6)}<circle cx="1357" cy="567" r="12" fill="#dfbd92"/>${rect(250, 465, 120, 115, "#25252b", 8)}${rect(266, 481, 89, 78, "#84796f", 3)}<path d="M281 504H340M281 520H327M281 536H338" stroke="#d1c4ae" stroke-width="4" opacity=".6"}`;
  }
  function apartment(key) {
    const night = key.includes("midnight");
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${windowArt(1030, 100, 390, 330)}${rect(0, 694, 1600, 206, "url(#floor)")}${rect(140, 520, 600, 178, "#54413b", 8)}${rect(170, 474, 565, 85, "#b7a69c", 12)}${[0, 1, 2].map(i => box(790 + i * 175, 565 + (i % 2) * 67, 170, 154, ["BOOKS", "KITCHEN", "MISC"][i])).join("")}${rect(280, 710, 42, 150, "#30252b", 4)}${rect(657, 710, 42, 150, "#30252b", 4)}${rect(1180, 497, 260, 185, "#44363a", 5)}${rect(1205, 520, 210, 139, "#302930", 3)}<path d="M1298 520v-82h45v82" fill="none" stroke="#302930" stroke-width="10"/><ellipse cx="1300" cy="441" rx="170" ry="180" fill="url(#lamp)"/>${night ? `<path d="M0 0H1600V900H0Z" fill="#131827" opacity=".15"/>${rect(1017, 95, 416, 340, "#101723", 2, 'opacity=".28"')}` : ""}`;
  }
  function kitchen(key) {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${rect(0, 0, 1600, 540, "#56484a", 0, 'opacity=".25"')}${rect(80, 140, 1440, 326, "#392f34", 8)}${[0, 1, 2, 3].map(i => `${rect(105 + i * 350, 160, 320, 280, "#68524b", 5)}${rect(120 + i * 350, 175, 290, 246, "#4c3d3d", 3)}${line(260 + i * 350, 180, 260 + i * 350, 416, "#a38266", 4, .42)}${rect(250 + i * 350, 288, 20, 45, "#c7aa84", 4)}`).join("")}${rect(0, 495, 1600, 48, "#d0a47b", 8)}${rect(0, 543, 1600, 195, "#403539", 0)}${rect(600, 740, 430, 42, "#302a30", 9)}${rect(640, 781, 25, 119, "#28242a", 4)}${rect(964, 781, 25, 119, "#28242a", 4)}${rect(200, 466, 300, 114, "#25252c", 10)}<ellipse cx="355" cy="460" rx="185" ry="122" fill="url(#lamp)"/><ellipse cx="355" cy="447" rx="105" ry="25" fill="#343038" stroke="#c9a77d" stroke-width="7"/><path d="M281 430Q355 340 428 430" fill="none" stroke="#d0b691" stroke-width="13" opacity=".7"/><path d="M1130 490v-90h20v90m70 0v-90h20v90" stroke="#26242b" stroke-width="15"/><ellipse cx="1190" cy="396" rx="170" ry="108" fill="url(#lamp)"/>`;
  }
  function dining() {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${rect(1070, 90, 350, 432, "#342d35", 7)}${[0, 1, 2, 3].map(i => `<rect x="1095" y="${120 + i * 95}" width="298" height="78" rx="3" fill="#60494a"/><path d="M1112 ${177 + i * 95}H1375" stroke="#c5a27b" stroke-width="5" opacity=".6"/>`).join("")}${[0, 1, 2].map(i => `<path d="M${1120 + i * 90} ${158 + (i % 2) * 95}q45-45 80 0v46h-80z" fill="#342a30" stroke="#a98a6c" stroke-width="3"/>`).join("")}${rect(0, 684, 1600, 216, "url(#floor)")}${rect(280, 526, 1000, 53, "#684c42", 16)}${rect(320, 578, 920, 52, "#493438", 6)}${rect(378, 626, 45, 196, "#30272d", 5)}${rect(1142, 626, 45, 196, "#30272d", 5)}${[480, 785, 1080].map(x => `<path d="M${x} 516v-89l-24-44h48l-24 44" fill="#e5c69b"/><ellipse cx="${x}" cy="414" rx="102" ry="118" fill="url(#lamp)"/>`).join("")}${rect(0, 888, 1600, 12, "#15141a")}`;
  }
  function fireEscape() {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 271 + 91) % 1550}" cy="${(i * 137 + 43) % 425}" r="${i % 4 === 0 ? 3 : 1.6}" fill="#f6d8a8" opacity="${.25 + (i % 5) * .12}"/>`).join("")}${rect(170, 80, 660, 520, "#242732", 6)}${rect(194, 103, 612, 474, "#38445a", 3)}${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${210 + i * 103} 575V${290 + (i % 3) * 60}" stroke="#d5a277" stroke-width="20" opacity=".45"/><path d="M${208 + i * 103} 578V${295 + (i % 3) * 60}" stroke="#ffc995" stroke-width="7" opacity=".58"/>`).join("")}${rect(142, 74, 716, 34, "#272630", 4)}${rect(844, 0, 756, 900, "#28272d")}${rect(855, 45, 745, 550, "#1b202c")}${rect(860, 540, 740, 358, "#3a3032")}${[0, 1, 2, 3, 4].map(i => `<path d="M${900 + i * 145} 650V${365 + (i % 2) * 45}" stroke="#bd8b67" stroke-width="18" opacity=".42"/>`).join("")}${line(850, 555, 1600, 555, "#302c32", 20, .95)}${line(850, 666, 1600, 666, "#302c32", 14, .92)}${Array.from({ length: 9 }, (_, i) => line(900 + i * 82, 554, 900 + i * 82, 666, "#302c32", 9, .88)).join("")}${rect(0, 840, 1600, 60, "url(#wood)")}${rect(0, 0, 98, 900, "#201e26")}`;
  }
  function entry() {
    return `${rect(0, 0, 1600, 900, "url(#wall)")}${rect(0, 0, 1600, 900, "#170f18", 0, 'opacity=".15"')}${rect(120, 90, 350, 704, "#29252c", 8)}${rect(145, 112, 300, 680, "#775646", 4)}${rect(375, 446, 20, 20, "#d7b17b", 8)}${rect(510, 655, 890, 48, "#59413e", 14)}${[0, 1].map(i => `<path d="M${610 + i * 400} 648v-95l-28-51h56l-28 51" fill="#e5c69b"/><ellipse cx="${610 + i * 400}" cy="525" rx="142" ry="153" fill="url(#lamp)"/>`).join("")}${rect(0, 825, 1600, 75, "url(#wood)")}`;
  }
  function portraitScene(key) {
    const night = key.includes("night") || key.includes("midnight");
    const dark = night ? "#272b3a" : "#777c8a", glow = night ? "#c28c68" : "#f0d3a6";
    const wall = rect(0, 0, 900, 1600, dark);
    const lampGlow = '<ellipse cx="445" cy="690" rx="440" ry="650" fill="url(#lamp)"/>';
    if (key.startsWith("bedroom")) return `${wall}${windowArt(62, 170, 300, 360)}${lampGlow}${rect(0, 1050, 900, 550, "#342b33")}${rect(42, 950, 820, 155, "#c2b1a6", 32)}${rect(104, 970, 300, 144, "#e0d0c1", 36)}${rect(435, 970, 300, 144, "#b9a8a0", 36)}${rect(38, 1070, 820, 320, "#46373b", 18)}${rect(0, 1505, 900, 95, "url(#wood)")}${rect(68, 690, 228, 230, "#40373a", 8)}${rect(92, 714, 180, 155, "#d6bd94", 4)}<text x="111" y="808" fill="#514238" font-size="38" font-family="Georgia">10:04</text>`;
    if (key.startsWith("hallway")) return `${wall}${rect(0, 0, 900, 1100, "#3a343b", 0, 'opacity=".22"')}${rect(54, 190, 302, 604, "#302a31", 8)}${rect(74, 212, 260, 582, "#896650", 3)}${rect(546, 190, 302, 604, "#302931", 8)}${rect(566, 212, 260, 582, "#705248", 3)}<circle cx="310" cy="500" r="10" fill="#d7b983"/><circle cx="800" cy="500" r="10" fill="#c89d62"/>${rect(0, 1070, 900, 530, "url(#floor)")}${box(390, 850, 252, 220, "BOOKS")}${box(570, 1000, 220, 168, "KITCHEN")}${[0,1,2,3,4].map(i=>line(40+i*190,1600,440+(i-2)*24,1070,"#17171c",4,.48)).join("")}`;
    if (key === "bedroom-afternoon") return `${wall}${rect(66, 180, 380, 885, "#382d34", 8)}${rect(92, 205, 330, 820, "#a7876e", 3)}${rect(110, 222, 295, 780, "#46353d", 3)}${[0,1,2,3].map(i=>`<path d="M${145+i*65} 300v55l-22 30v280q35 24 70 0V385l-22-30v-55" fill="${["#27242c","#6a524a","#342832","#836656"][i]}" stroke="#c2a681" stroke-width="3"/>`).join("")}${rect(496, 170, 340, 810, "#302a32", 13)}${rect(515, 190, 302, 770, "#c3a285", 4)}${rect(530, 208, 272, 735, "#65595a", 3)}<ellipse cx="665" cy="478" rx="95" ry="142" fill="#d9b69c" opacity=".27"/><path d="M555 934Q574 710 665 688Q756 710 780 934Z" fill="#27242b"/>${rect(0, 1450, 900, 150, "url(#wood)")}`;
    if (key === "office-evening") return `${wall}${windowArt(78, 150, 335, 350)}${rect(0, 1130, 900, 470, "url(#floor)")}${rect(70, 850, 760, 44, "#3c3034", 8)}${rect(160, 440, 580, 360, "#272832", 18)}${rect(180, 460, 540, 320, "#53616a", 7)}<path d="M202 734L320 602L422 670L550 520L696 735Z" fill="#d3a878" opacity=".52"/><path d="M95 892v250m680-250v250" stroke="#29252d" stroke-width="45"/>${rect(610, 790, 148, 88, "#302a30", 10)}${rect(625, 801, 117, 60, "#c7936d", 7)}<circle cx="684" cy="830" r="14" fill="#dfbd92"/>`;
    if (key.startsWith("zade-apartment")) return `${wall}${windowArt(520, 145, 310, 300)}${rect(0, 1160, 900, 440, "url(#floor)")}${rect(80, 820, 430, 300, "#51403c", 12)}${rect(100, 770, 390, 105, "#b7a69c", 16)}${box(492, 820, 186, 212, "BOOKS")}${box(660, 990, 184, 188, "KITCHEN")}${rect(590, 1150, 240, 150, "#44363a", 6)}${night ? rect(510, 140, 340, 330, "#131827", 0, 'opacity=".22"') : ""}`;
    if (key === "kitchen-evening" || key === "kitchen-night") return `${wall}${[0,1,2].map(i=>`${rect(55+i*270,180,245,440,"#3a3035",7)}${rect(72+i*270,198,211,400,"#68524b",4)}${line(176+i*270,202,176+i*270,588,"#a38266",5,.42)}`).join("")}${rect(0, 700, 900, 62, "#d0a47b", 10)}${rect(0, 762, 900, 318, "#403539")}${rect(135, 690, 280, 160, "#25252c", 12)}<ellipse cx="275" cy="675" rx="205" ry="150" fill="url(#lamp)"/><ellipse cx="275" cy="680" rx="98" ry="28" fill="#343038" stroke="#c9a77d" stroke-width="7"/><path d="M205 664Q275 550 345 664" fill="none" stroke="#d0b691" stroke-width="14"/>${rect(360, 1090, 450, 40, "#302a30", 8)}${rect(395, 1130, 28, 260, "#28242a", 4)}${rect(750, 1130, 28, 260, "#28242a", 4)}`;
    if (key === "dining-night") return `${wall}${[0,1,2,3].map(i=>`${rect(640,160+i*140,210,112,"#60494a",5)}${line(662,252+i*140,824,252+i*140,"#c5a27b",5,.6)}`).join("")}${rect(0, 1110, 900, 490, "url(#floor)")}${rect(72, 795, 758, 57, "#684c42", 16)}${rect(105, 850, 694, 62, "#493438", 8)}${[230,450,670].map(x=>`<path d="M${x} 780v-114l-28-48h56l-28 48" fill="#e5c69b"/><ellipse cx="${x}" cy="620" rx="118" ry="142" fill="url(#lamp)"/>`).join("")}${rect(118, 912, 42, 300, "#30272d", 5)}${rect(744, 912, 42, 300, "#30272d", 5)}`;
    if (key === "fire-escape-night") return `${wall}${Array.from({length:24},(_,i)=>`<circle cx="${(i*173+75)%880}" cy="${(i*139+45)%700}" r="${i%4===0?4:2}" fill="#f6d8a8" opacity="${.3+(i%4)*.13}"/>`).join("")}${rect(54,140,536,580,"#242732",8)}${rect(76,164,492,530,"#38445a",3)}${[0,1,2,3].map(i=>`<path d="M${118+i*108} 680V${350+(i%2)*55}" stroke="#ffc995" stroke-width="12" opacity=".62"/>`).join("")}${rect(610,0,290,1120,"#28272d")}${line(610,790,900,790,"#302c32",18,.95)}${line(610,950,900,950,"#302c32",14,.92)}${[0,1,2].map(i=>line(650+i*86,790,650+i*86,950,"#302c32",10,.9)).join("")}${rect(0, 1130, 900, 470, "url(#wood)")}`;
    if (key === "adeline-interior-night") return `${wall}${rect(72,130,310,890,"#29252c",8)}${rect(92,153,270,865,"#775646",4)}${rect(300,510,21,22,"#d7b17b",8)}${rect(80,980,745,55,"#59413e",14)}${[240,660].map(x=>`<path d="M${x} 970v-130l-28-54h56l-28 54" fill="#e5c69b"/><ellipse cx="${x}" cy="770" rx="142" ry="165" fill="url(#lamp)"/>`).join("")}${rect(0,1450,900,150,"url(#wood)")}`;
    if (key === "cold-midnight") return `${wall}${rect(110,1080,680,270,"#38323b",16)}${rect(80,1030,720,90,"#8f8a8e",20)}${rect(0,1400,900,200,"url(#wood)")}${rect(52,178,295,610,"#302a31",8)}${rect(72,200,255,588,"#58483f",4)}${rect(540,178,295,610,"#302a31",8)}${rect(560,200,255,588,"#58483f",4)}`;
    return `${wall}${windowArt(60,170,300,360)}${lampGlow}${rect(0,1200,900,400,"url(#floor)")}`;
  }

  function draw(key, portrait) {
    let scene;
    if (portrait) scene = portraitScene(key);
    else if (key === "bedroom-afternoon") scene = closet();
    else if (key === "cold-midnight") scene = apartment(key);
    else if (key.startsWith("bedroom")) scene = bedroom(key);
    else if (key.startsWith("hallway")) scene = hallway(key);
    else if (key === "office-evening") scene = office();
    else if (key.startsWith("zade-apartment")) scene = apartment(key);
    else if (key === "kitchen-evening" || key === "kitchen-night") scene = kitchen(key);
    else if (key === "dining-night") scene = dining();
    else if (key === "fire-escape-night") scene = fireEscape();
    else if (key === "adeline-interior-night") scene = entry();
    else scene = hallway("hallway-morning");
    const base = svgRoot(key, portrait);
    return `${base}${scene}<rect x="0" y="0" width="${portrait ? 900 : 1600}" height="${portrait ? 1600 : 900}" fill="url(#shade)"/></svg>`;
  }
  function renderBackground(container, key, previousKey) {
    if (!container || !key) return;
    const portrait = container.clientHeight > container.clientWidth;
    const variant = portrait ? "portrait" : "landscape";
    if (key === previousKey && container.dataset.variant === variant) return;
    container.dataset.background = key;
    container.dataset.variant = variant;
    container.setAttribute("aria-label", key.replaceAll("-", " "));
    container.innerHTML = draw(key, portrait);
    container.firstElementChild.classList.add("scene-art-enter");
  }

  /* ---------------- foreground depth ----------------
     A full-bleed cut-out standing on an empty floor reads as a sticker. The
     room has to carry on in front of the figures: a shag rug, a bed footboard,
     a desk lip, a counter edge, a fire-escape rail. Each family of backdrops
     gets the near furniture that room actually has.

     This layer is built in CSS pixels rather than in a fixed viewBox — the
     viewBox is the container's own size and the aspect ratio is not preserved.
     A `slice` crop would eat a rug whose near edge sits at the bottom of a
     1600x900 design space on a phone in portrait; measuring instead means the
     band lands at the same fraction of the frame at every shape. */
  const fg = {
    rug: ["#16736d", "#2fb2a4", "#74e5d4"],
    wood: ["#6b3f2b", "#a26245", "#cf8f66"],
    board: ["#8a5636", "#b57a51", "#d6a37c"],
    carton: ["#a5703c", "#cb9a5a", "#e7bf85"],
    stone: ["#5a4c47", "#7f6c63", "#a59489"],
    steel: ["#3f4c63", "#66799a", "#9cb0c8"],
    cloth: ["#843f63", "#b05b86", "#d98cae"],
    leaf: ["#256e3a", "#40a057", "#77cd86"],
    ember: ["#5f3444", "#a2565c", "#dd8f74"],
  };

  /* A rug seen from a metre away. Overlapping pile clumps give the fur a
     broken silhouette against the floor, vertical strands give it depth. */
  function shag(w, h, top, pal) {
    const clump = h * 0.055, n = Math.max(10, Math.round(w / clump)), step = w / n;
    const hair = Math.max(1.4, w * 0.0019);
    let art = rect(0, top + clump * 0.35, w, h - top, pal[0]);
    for (let i = 0; i < n; i++)
      art += `<ellipse cx="${(i + 0.5) * step}" cy="${top + Math.sin(i * 2.3) * clump * 0.16}" rx="${step * 0.7}" ry="${clump}" fill="${i % 2 ? pal[2] : pal[1]}"/>`;
    for (let i = 0; i < n * 2; i++)
      art += line((i + 0.5) * (w / (n * 2)), top + clump * 0.85, (i + 0.5) * (w / (n * 2)), h, pal[0], hair, 0.4);
    return art;
  }

  function footboard(w, h) {
    const rail = h * 0.8, post = Math.max(16, w * 0.026);
    let art = rect(0, rail, w, h - rail, fg.board[1]);
    art += rect(0, rail, w, h * 0.011, fg.board[2]);
    art += rect(0, rail + h * 0.055, w, h * 0.012, fg.board[0]);
    for (let i = 0; i < 11; i++)
      art += rect((i + 0.5) * (w / 11) - w * 0.013, rail + h * 0.011, w * 0.026, h * 0.044, fg.board[0], 3, 'opacity=".5"');
    /* the posts run off the bottom of the frame, which is what sells the depth */
    [0.045, 0.955].forEach((t) => {
      const cx = w * t;
      art += rect(cx - post / 2, rail - h * 0.048, post, h - rail + h * 0.048, fg.board[1]);
      art += rect(cx - post / 2, rail - h * 0.048, post * 0.3, h - rail + h * 0.048, fg.board[2], 0, 'opacity=".45"');
      art += `<ellipse cx="${cx}" cy="${rail - h * 0.048}" rx="${post * 0.84}" ry="${h * 0.022}" fill="${fg.board[2]}"/>`;
    });
    /* a throw left folded over the rail */
    const tx = w * 0.6, tw = w * 0.16;
    art += rect(tx, rail - h * 0.05, tw, h * 0.11, fg.cloth[1], 7);
    art += rect(tx, rail - h * 0.05, tw, h * 0.014, fg.cloth[2], 5);
    art += rect(tx + tw * 0.12, rail - h * 0.028, tw * 0.76, h * 0.011, fg.cloth[0], 4, 'opacity=".4"');
    return art;
  }

  function cartons(w, h) {
    const bw = w * 0.2, top = h * 0.72;
    const put = (x, y, cw, ch, fill, label) => {
      let g = rect(x + 8, y + 9, cw, ch, "#1a1016", 4, 'opacity=".28"');
      g += rect(x, y, cw, ch, fill, 4);
      g += line(x + cw / 2, y + 5, x + cw / 2, y + ch - 5, fg.carton[0], Math.max(2, w * 0.0028), 0.45);
      g += line(x + 5, y + ch * 0.4, x + cw - 5, y + ch * 0.4, fg.carton[0], Math.max(2, w * 0.0022), 0.4);
      if (label) g += `<text x="${x + cw * 0.13}" y="${y + ch * 0.74}" font-family="Georgia,serif" font-size="${Math.min(cw * 0.17, h * 0.032)}" fill="${fg.carton[0]}" opacity=".6">${esc(label)}</text>`;
      return g;
    };
    return put(-bw * 0.22, top + h * 0.1, bw, h * 0.2, fg.carton[1], "BOOKS")
      + put(bw * 0.5, top, bw * 0.88, h * 0.17, fg.carton[2], "KITCHEN")
      + put(bw * 0.08, top - h * 0.1, bw * 0.72, h * 0.14, fg.carton[0], "MISC");
  }

  function deskLip(w, h) {
    const top = h * 0.775;
    let art = rect(0, top, w, h - top, fg.wood[1]);
    art += rect(0, top, w, h * 0.013, fg.wood[2]);
    art += rect(0, top + h * 0.05, w, h * 0.011, fg.wood[0], 0, 'opacity=".45"');
    art += `<g transform="rotate(-4 ${w * 0.2} ${top})">${rect(w * 0.13, top - h * 0.028, w * 0.14, h * 0.032, "#f3e7d2", 3)}${rect(w * 0.15, top - h * 0.02, w * 0.09, h * 0.005, "#c9b89e", 2)}</g>`;
    const mx = w * 0.76, mr = h * 0.028;
    art += rect(mx - mr, top - h * 0.052, mr * 2, h * 0.055, fg.ember[1], 4);
    art += `<ellipse cx="${mx}" cy="${top - h * 0.052}" rx="${mr}" ry="${mr * 0.34}" fill="${fg.ember[0]}"/>`;
    art += `<path d="M${mx + mr * 0.92} ${top - h * 0.038}h${mr * 0.55}v${h * 0.024}h${-mr * 0.55}z" fill="${fg.ember[2]}"/>`;
    return art;
  }

  function counterLip(w, h) {
    const top = h * 0.765;
    let art = rect(0, top, w, h - top, fg.stone[1]);
    art += rect(0, top, w, h * 0.012, fg.stone[2]);
    for (let i = 0; i < 4; i++)
      art += rect((i + 0.08) * (w / 4), top + h * 0.05, (w / 4) * 0.84, h * 0.085, fg.stone[0], 5, 'opacity=".55"');
    /* a kettle and a stack of bowls sitting on the near edge */
    const kx = w * 0.26, kw = w * 0.085, kh = h * 0.072;
    art += rect(kx, top - kh, kw, kh, fg.steel[2], Math.min(10, kw * 0.2));
    art += `<path d="M${kx} ${top - kh * 0.7}l${-kw * 0.32} ${kh * 0.26}l${kw * 0.12} ${kh * 0.12}l${kw * 0.22} ${-kh * 0.3}z" fill="${fg.steel[1]}"/>`;
    art += `<path d="M${kx + kw} ${top - kh * 0.76}q${kw * 0.34} ${kh * 0.08} ${kw * 0.22} ${kh * 0.34}" fill="none" stroke="${fg.steel[1]}" stroke-width="${Math.max(3, w * 0.006)}"/>`;
    const bx = w * 0.7, bwid = w * 0.1;
    art += `<path d="M${bx} ${top - h * 0.03}q${bwid / 2} ${h * 0.042} ${bwid} 0z" fill="${fg.ember[2]}"/>`;
    art += `<path d="M${bx - bwid * 0.16} ${top - h * 0.056}q${bwid * 0.58} ${h * 0.034} ${bwid * 1.32} 0z" fill="${fg.ember[1]}"/>`;
    art += `<ellipse cx="${bx + bwid / 2}" cy="${top - h * 0.03}" rx="${bwid / 2}" ry="${h * 0.006}" fill="${fg.ember[0]}"/>`;
    return art;
  }

  function tableEdge(w, h) {
    const top = h * 0.775;
    let art = rect(0, top, w, h * 0.028, fg.wood[2]);
    art += rect(0, top + h * 0.028, w, h * 0.02, fg.wood[1]);
    art += rect(0, top + h * 0.048, w, h - top, fg.wood[0]);
    const cx = w * 0.22;
    art += rect(cx - w * 0.005, top - h * 0.05, w * 0.01, h * 0.05, "#f6ecd8", 2);
    art += `<ellipse cx="${cx}" cy="${top - h * 0.062}" rx="${w * 0.0065}" ry="${h * 0.017}" fill="#ffbe5e"/>`;
    art += `<ellipse cx="${cx}" cy="${top - h * 0.062}" rx="${w * 0.0032}" ry="${h * 0.009}" fill="#fff6cd"/>`;
    [0.64, 0.74].forEach((t, i) => {
      const x = w * t, gw = w * 0.038, gh = h * 0.055;
      art += `<path d="M${x - gw / 2} ${top - gh}h${gw}l${-gw * 0.12} ${gh}h${-gw * 0.76}z" fill="${i ? fg.leaf[2] : fg.ember[2]}" opacity=".82"/>`;
    });
    return art;
  }

  function fireRail(w, h) {
    const bar = h * 0.72, bw = Math.max(4, w * 0.009);
    let art = "";
    for (let i = 0; i <= 10; i++)
      art += rect((i / 10) * w - bw / 2, bar, bw, h - bar, fg.steel[1]);
    art += rect(0, bar + h * 0.09, w, h * 0.011, fg.steel[1]);
    art += rect(0, bar - h * 0.02, w, h * 0.024, fg.steel[2], 3);
    art += rect(0, bar - h * 0.02, w, h * 0.007, fg.steel[0], 0, 'opacity=".45"');
    /* the platform we are both standing on */
    art += rect(0, h * 0.88, w, h * 0.12, fg.steel[0]);
    art += rect(0, h * 0.88, w, h * 0.009, fg.steel[2]);
    return art;
  }

  function sofaBack(w, h) {
    const top = h * 0.745, right = w * 0.68;
    let art = rect(0, top + h * 0.055, right, h - top, fg.cloth[1], 12);
    for (let i = 0; i < 3; i++)
      art += rect((i + 0.06) * (right / 3), top - h * 0.018, (right / 3) * 0.88, h * 0.095, i % 2 ? fg.cloth[2] : fg.cloth[1], 14);
    art += rect(0, top + h * 0.055, right, h * 0.013, fg.cloth[0], 0, 'opacity=".4"');
    /* the near arm, so the sofa reads as a chair and not as a painted band */
    art += rect(right - w * 0.05, top - h * 0.03, w * 0.05, h - top + h * 0.03, fg.cloth[2], 10);
    art += rect(right - w * 0.05, top - h * 0.03, w * 0.012, h - top + h * 0.03, fg.cloth[0], 0, 'opacity=".35"');
    return art;
  }

  function dresser(w, h) {
    const top = h * 0.79, x = w * 0.52, dw = w * 0.44;
    let art = rect(x, top, dw, h - top, fg.wood[1], 6);
    art += rect(x - w * 0.012, top - h * 0.022, dw + w * 0.024, h * 0.03, fg.wood[2], 5);
    for (let i = 0; i < 2; i++)
      art += rect(x + dw * 0.08, top + h * 0.05 + i * h * 0.07, dw * 0.84, h * 0.055, fg.wood[0], 4, 'opacity=".55"');
    [fg.cloth[1], fg.ember[1], "#e9dcc6"].forEach((c, i) =>
      art += rect(x + dw * (0.22 + i * 0.04), top - h * (0.06 + i * 0.03), dw * 0.58, h * 0.032, c, 4));
    return art;
  }

  function potPlant(w, h) {
    const cx = w * 0.86, top = h * 0.74, pot = w * 0.12;
    let art = "";
    for (let i = 0; i < 7; i++) {
      const angle = -Math.PI / 2 + (i - 3) * 0.32, len = h * (0.15 + (i % 2) * 0.06);
      const ex = cx + Math.cos(angle) * len, ey = top + Math.sin(angle) * len;
      art += `<path d="M${cx} ${top}q${(ex - cx) * 0.4} ${(ey - top) * 0.9} ${ex - cx} ${ey - top}" fill="none" stroke="${i % 2 ? fg.leaf[1] : fg.leaf[2]}" stroke-width="${Math.max(3, w * 0.0065)}" stroke-linecap="round"/>`;
    }
    art += `<path d="M${cx - pot * 0.6} ${top}q${pot * 0.12} ${-h * 0.034} ${pot * 0.6} ${-h * 0.034}q${pot * 0.48} 0 ${pot * 0.6} ${h * 0.034}z" fill="${fg.leaf[0]}"/>`;
    art += `<path d="M${cx - pot / 2} ${top}h${pot}l${-pot * 0.11} ${h * 0.15}h${-pot * 0.78}z" fill="${fg.ember[1]}"/>`;
    art += rect(cx - pot * 0.58, top - h * 0.013, pot * 1.16, h * 0.026, fg.ember[2], 4);
    return art;
  }

  /* Mirrors the dispatch order in draw(): the near layer has to belong to the
     room that is actually on screen, not to the key's prefix alone. */
  function foregroundKind(key) {
    if (key.startsWith("bedroom")) return key === "bedroom-afternoon" ? "closet" : "bedroom";
    if (key.startsWith("hallway")) return "hallway";
    if (key.startsWith("office")) return "office";
    if (key.startsWith("zade-apartment") || key === "cold-midnight") return "apartment";
    if (key.startsWith("kitchen")) return "kitchen";
    if (key.startsWith("dining")) return "dining";
    if (key.startsWith("fire-escape")) return "fireEscape";
    if (key.startsWith("adeline-interior")) return "entry";
    return "hallway";
  }

  /* The dialogue box owns the bottom ~15% of the frame, so every silhouette is
     lifted to land in the 72-85% window where it is actually on screen. */
  const FOREGROUNDS = {
    bedroom: (w, h) => shag(w, h, h * 0.735, fg.rug) + footboard(w, h),
    hallway: (w, h) => cartons(w, h) + shag(w, h, h * 0.84, fg.rug),
    closet: (w, h) => shag(w, h, h * 0.725, fg.rug) + dresser(w, h),
    office: (w, h) => deskLip(w, h),
    apartment: (w, h) => shag(w, h, h * 0.86, fg.rug) + sofaBack(w, h),
    kitchen: (w, h) => counterLip(w, h),
    dining: (w, h) => shag(w, h, h * 0.88, fg.rug) + tableEdge(w, h),
    fireEscape: (w, h) => fireRail(w, h),
    entry: (w, h) => shag(w, h, h * 0.8, fg.rug) + potPlant(w, h),
  };

  function renderForeground(container, key, previousKey) {
    if (!container || !key) return;
    const w = Math.round(container.clientWidth || window.innerWidth);
    const h = Math.round(container.clientHeight || window.innerHeight);
    if (key === previousKey && container.dataset.foreground === key &&
        container.dataset.width === String(w) && container.dataset.height === String(h)) return;
    container.dataset.foreground = key;
    container.dataset.width = String(w);
    container.dataset.height = String(h);
    container.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="none" xmlns="${NS}" role="presentation" focusable="false">${FOREGROUNDS[foregroundKind(key)](w, h)}</svg>`;
    container.firstElementChild.classList.add("scene-foreground-enter");
  }
/* ---------------- wardrobe ----------------
     Both portraits already carry real cloth — folds, pleats, seams and studio
     shading — and both garments in them are near-black, so recolouring keeps
     them photographic. Recolouring alone, though, can only ever produce the
     one outfit the model happened to be wearing, which is why every scene used
     to arrive in the same dress in a different colour.

     So each look is now built as a set of parts over the photograph: a
     silhouette (bodice, sleeve, lower, wedge, band) written as a signed
     distance, filled from a donor patch of the same frame. The donor supplies
     the light — real folds, real shadow, the same studio key as the face — and
     the     silhouette supplies the shape. Pajamas, workwear, casual clothes and
     intimate catalog looks can now share the same models without sharing one
     garment silhouette.

     Landmarks come from scanning every row of each photo for subject pixels
     rather than from eyeballing it. Adeline: hair 20-176, shoulders from 244,
     torso 440-572 with the arms in separate columns at 394-442 and 549-599,
     hands clasped across 505-557 at 380-420, waist 400, hip 383-614, skirt
     hem 548, bare legs 552-836, shoes from 840. Zade: head 56-176, shoulders
     222, arms in columns 369-430 and 610-664, hands 400-447 and 612-662 at
     486-565, jacket hem 566, trousers down to the boots at 904.

     Every part is clipped to the photographed figure, so a look can narrow the
     cloth it covers but can never grow it out over the room. */
  const DONORS = {
    Adeline: {
      bodice: { x0: 404, y0: 252, x1: 618, y1: 384 },
      skirt:  { x0: 380, y0: 392, x1: 630, y1: 546 },
      skin:   { x0: 462, y0: 94,  x1: 558, y1: 132 }
    },
    Zade: {
      bodice: { x0: 372, y0: 226, x1: 654, y1: 470 },
      coat:   { x0: 376, y0: 470, x1: 650, y1: 564 },
      pants:  { x0: 402, y0: 568, x1: 620, y1: 896 },
      skin:   { x0: 484, y0: 98,  x1: 550, y1: 132 }
    }
  };

  /* Scene-specific looks: catalog outfits on the story beats that call for
     them; donor fabric light preserves the source photo's fold shading. */
  const GARMENTS = {
    /* 1. Satin black night suit — Act I. The script has her leaning on the
       doorframe in it, so it has to read as sleepwear and not as lingerie:
       long sleeves, a piped placket and cuffs, straight satin trousers. Satin
       is the one fabric that wants its fold contrast pushed hard, because the
       sheen *is* the highlight running along each crease. */
    "Adeline:sleepwear": {
      band: [238, 812], grow: 28,
      parts: [
        { kind: "bodice", cx: 502, y0: 242, hem: 448, neck: "scoop", drop: 26, neckHalf: 76,
          hw: [[242, 92], [266, 106], [298, 88], [342, 74], [394, 66], [448, 68]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.34,
          color: { hue: 232, sat: .12, lo: .06, hi: .38 } },
        { kind: "sleeve", ax: 418, y0: 240, cuff: 452, hw: [[240, 26], [300, 26], [360, 24], [452, 23]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.34,
          color: { hue: 232, sat: .12, lo: .06, hi: .36 } },
        { kind: "sleeve", ax: 573, y0: 240, cuff: 452, hw: [[240, 26], [300, 26], [360, 23], [452, 23]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.34,
          color: { hue: 232, sat: .12, lo: .06, hi: .36 } },
        /* white piping: placket, cuffs and trouser turn-up */
        { kind: "band", x0: 494, x1: 512, y0: 244, y1: 448,
          donor: "bodice", z: 3, color: { hue: 40, sat: .06, lo: .76, hi: .99 } },
        { kind: "band", x0: 392, x1: 444, y0: 438, y1: 452,
          donor: "bodice", z: 3, color: { hue: 40, sat: .06, lo: .76, hi: .99 } },
        { kind: "band", x0: 550, x1: 602, y0: 438, y1: 452,
          donor: "bodice", z: 3, color: { hue: 40, sat: .06, lo: .76, hi: .99 } },
        { kind: "lower", cx: 502, y0: 436, hem: 812, gap: [[436, 0], [566, 0], [700, 26], [812, 30]],
          hw: [[436, 96], [470, 102], [530, 105], [640, 100], [730, 95], [812, 90]],
          donor: "skirt", z: 2, ao: .24, fold: 1.3,
          color: { hue: 232, sat: .12, lo: .06, hi: .34 } },
        { kind: "band", x0: 406, x1: 596, y0: 798, y1: 812,
          donor: "skirt", z: 3, color: { hue: 40, sat: .06, lo: .74, hi: .98 } }
      ],
      under: { donor: "bodice", color: { hue: 232, sat: .12, lo: .06, hi: .34 } }
    },

    /* 5. Black blazer + trousers — Act II, "armor is chosen carefully". A
       near-black blazer worn open over an ivory camisole, so the lapels are cut
       away and the light top shows through the whole front. */
    "Adeline:work": {
      band: [236, 812], grow: 28,
      parts: [
        { kind: "bodice", cx: 502, y0: 240, hem: 442, neck: "scoop", drop: 34, neckHalf: 74,
          hw: [[240, 88], [266, 102], [296, 84], [340, 70], [392, 64], [442, 68]],
          keepSkin: [356, 436], donor: "bodice", z: 1,
          color: { hue: 44, sat: .14, lo: .68, hi: .97 } },
        { kind: "bodice", cx: 502, y0: 236, hem: 452, neck: "scoop", drop: 40, neckHalf: 88,
          hw: [[236, 96], [268, 108], [298, 88], [342, 74], [394, 68], [452, 74]],
          cut: [{ cx: 502, y0: 234, y1: 412, w0: 6, w1: 60 }],
          keepSkin: [356, 436], donor: "bodice", z: 2,
          color: { hue: 220, sat: .11, lo: .05, hi: .27 } },
        { kind: "sleeve", ax: 418, y0: 236, cuff: 458, hw: [[236, 27], [300, 27], [360, 25], [458, 24]],
          keepSkin: [356, 436], donor: "bodice", z: 2,
          color: { hue: 220, sat: .11, lo: .05, hi: .26 } },
        { kind: "sleeve", ax: 573, y0: 236, cuff: 458, hw: [[236, 27], [300, 27], [360, 24], [458, 24]],
          keepSkin: [356, 436], donor: "bodice", z: 2,
          color: { hue: 220, sat: .11, lo: .05, hi: .26 } },
        { kind: "lower", cx: 502, y0: 438, hem: 812, gap: [[438, 0], [580, 0], [710, 24], [812, 28]],
          hw: [[438, 92], [480, 100], [540, 102], [660, 98], [812, 92]],
          donor: "skirt", z: 2, ao: .24, color: { hue: 220, sat: .16, lo: .06, hi: .34 } },
        { kind: "band", x0: 412, x1: 592, y0: 438, y1: 458,
          donor: "skirt", z: 3, color: { hue: 220, sat: .12, lo: .04, hi: .22 } }
      ],
      under: { donor: "bodice", color: { hue: 220, sat: .12, lo: .06, hi: .30 } }
    },

    /* 4. Cream sweater + jeans — Act III. She has just told him this is not a
       date, so she is in the knit she wears around the flat: oversized, long,
       ending in a ribbed hem, over straight mid-blue denim. Deliberately the
       softest thing she owns on screen. */
    "Adeline:evening": {
      band: [236, 828], grow: 28,
      parts: [
        { kind: "bodice", cx: 502, y0: 238, hem: 470, neck: "scoop", drop: 24, neckHalf: 82,
          hw: [[238, 96], [268, 110], [300, 96], [348, 84], [400, 80], [470, 86]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.22,
          color: { hue: 42, sat: .10, lo: .70, hi: .99 } },
        { kind: "sleeve", ax: 418, y0: 236, cuff: 474, hw: [[236, 28], [300, 28], [380, 26], [474, 26]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.22,
          color: { hue: 42, sat: .10, lo: .68, hi: .97 } },
        { kind: "sleeve", ax: 573, y0: 236, cuff: 474, hw: [[236, 28], [300, 28], [380, 26], [474, 26]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.22,
          color: { hue: 42, sat: .10, lo: .68, hi: .97 } },
        { kind: "band", x0: 414, x1: 590, y0: 450, y1: 472,
          donor: "bodice", z: 3, color: { hue: 40, sat: .16, lo: .58, hi: .92 } },
        { kind: "lower", cx: 502, y0: 458, hem: 828, gap: [[458, 0], [580, 0], [710, 22], [828, 26]],
          hw: [[458, 98], [520, 102], [620, 100], [740, 96], [828, 92]],
          donor: "skirt", z: 2, ao: .22, color: { hue: 214, sat: .40, lo: .12, hi: .58 } },
        { kind: "band", x0: 414, x1: 590, y0: 458, y1: 480,
          donor: "skirt", z: 3, color: { hue: 214, sat: .44, lo: .16, hi: .64 } }
      ],
      under: { donor: "skirt", color: { hue: 214, sat: .40, lo: .13, hi: .56 } }
    },

    /* Romantic kiss beat: catalog look 3 — burgundy satin robe over a lace set.
       The robe stays open at the centre so the matching lace top and briefs
       read underneath; satin folds use the source portrait's own shadow map. */
    "Adeline:romantic": {
      band: [238, 828], grow: 28,
      parts: [
        { kind: "bodice", cx: 502, y0: 242, hem: 404, neck: "v", drop: 66, neckHalf: 92,
          hw: [[242, 84], [266, 96], [300, 82], [346, 72], [404, 68]],
          keepSkin: [356, 436], donor: "bodice", z: 2, fold: 1.26,
          color: { hue: 346, sat: .48, lo: .07, hi: .44 } },
        { kind: "cup", cx: 465, cy: 330, rx: 34, ry: 24,
          donor: "bodice", z: 3, color: { hue: 348, sat: .48, lo: .05, hi: .27 } },
        { kind: "cup", cx: 539, cy: 330, rx: 34, ry: 24,
          donor: "bodice", z: 3, color: { hue: 348, sat: .48, lo: .05, hi: .27 } },
        { kind: "lower", cx: 502, y0: 394, hem: 552,
          gap: [[394, 0], [458, 0], [520, 20], [552, 28]],
          hw: [[394, 82], [430, 94], [480, 104], [524, 106], [552, 104]],
          keepSkin: [394, 436], donor: "skirt", z: 2, ao: .15,
          color: { hue: 346, sat: .42, lo: .06, hi: .34 } },
        /* The robe is a broad silhouette with a widening open-front cutout.
           This keeps the catalog's lace set visible rather than painting a
           burgundy block over it. */
        { kind: "bodice", cx: 502, y0: 238, hem: 548, neck: "scoop", drop: 4, neckHalf: 130,
          hw: [[238, 126], [270, 138], [340, 130], [420, 132], [490, 138], [548, 140]],
          cut: [{ cx: 502, y0: 240, y1: 520, w0: 38, w1: 76 }],
          keepSkin: [356, 436], donor: "bodice", z: 4, fold: 1.30,
          color: { hue: 348, sat: .56, lo: .07, hi: .57 } },
        { kind: "sleeve", ax: 418, y0: 238, cuff: 548,
          hw: [[238, 31], [300, 34], [390, 34], [470, 32], [548, 30]],
          keepSkin: [356, 436], donor: "bodice", z: 4, fold: 1.26,
          color: { hue: 348, sat: .54, lo: .07, hi: .54 } },
        { kind: "sleeve", ax: 573, y0: 238, cuff: 548,
          hw: [[238, 30], [300, 34], [390, 33], [470, 31], [548, 30]],
          keepSkin: [356, 436], donor: "bodice", z: 4, fold: 1.26,
          color: { hue: 348, sat: .54, lo: .07, hi: .54 } },
        { kind: "band", x0: 480, x1: 524, y0: 420, y1: 432,
          donor: "bodice", z: 5, color: { hue: 346, sat: .50, lo: .12, hi: .52 } },
        { kind: "band", x0: 430, x1: 574, y0: 397, y1: 402,
          donor: "bodice", z: 5, color: { hue: 348, sat: .45, lo: .04, hi: .20 } }
      ],
      under: { donor: "bodice", color: { hue: 348, sat: .54, lo: .07, hi: .52 } }
    },

    /* Romantic kiss beat: catalog look 1 — black leather jacket open over a
       bare chest, with dark jeans. The jacket panels leave a long centre cutout
       filled from the model's own skin donor, not flat illustration. */
    "Zade:romantic": {
      band: [218, 898], grow: 30,
      parts: [
        { kind: "wedge", cx: 532, y0: 238, y1: 552, w0: 12, w1: 76,
          donor: "skin", z: 1, skin: true, muscle: true },
        { kind: "bodice", cx: 532, y0: 218, hem: 566, neck: "scoop", drop: 38, neckHalf: 90,
          hw: [[218, 98], [248, 118], [300, 114], [360, 110], [430, 106], [500, 104], [566, 102]],
          cut: [{ cx: 532, y0: 218, y1: 552, w0: 10, w1: 76 }],
          keepSkin: [470, 580], donor: "bodice", z: 2, fold: 1.30,
          color: { hue: 220, sat: .10, lo: .025, hi: .28 } },
        { kind: "sleeve", ax: 400, y0: 218, cuff: 500,
          hw: [[218, 33], [320, 34], [420, 32], [500, 30]],
          keepSkin: [470, 580], donor: "bodice", z: 2, fold: 1.28,
          color: { hue: 220, sat: .10, lo: .025, hi: .28 } },
        { kind: "sleeve", ax: 636, y0: 218, cuff: 500,
          hw: [[218, 29], [320, 31], [420, 31], [500, 28]],
          keepSkin: [470, 580], donor: "bodice", z: 2, fold: 1.28,
          color: { hue: 220, sat: .10, lo: .025, hi: .28 } },
        { kind: "band", x0: 430, x1: 480, y0: 222, y1: 474, preserveSkin: true,
          donor: "bodice", z: 3, fold: 1.30,
          color: { hue: 220, sat: .10, lo: .035, hi: .34 } },
        { kind: "band", x0: 584, x1: 634, y0: 222, y1: 474, preserveSkin: true,
          donor: "bodice", z: 3, fold: 1.30,
          color: { hue: 220, sat: .10, lo: .035, hi: .34 } },
        { kind: "lower", cx: 527, y0: 552, hem: 898, keepSkin: [470, 580],
          hw: [[552, 94], [640, 98], [760, 106], [898, 112]],
          donor: "pants", z: 2, ao: .26, color: { hue: 220, sat: .10, lo: .04, hi: .28 } }
      ],
      under: { donor: "pants", color: { hue: 220, sat: .10, lo: .04, hi: .28 } }
    },

    /* 7. Denim jacket + graphic tee — moving day. Light-wash denim worn open
       over a near-black tee, sleeves shoved to the elbow, over dark jeans: the
       one layered look in the cast, and the only one where the top of the body
       is two garments instead of one. */
    "Zade:casual": {
      band: [218, 898], grow: 30,
      parts: [
        { kind: "bodice", cx: 532, y0: 220, hem: 486, neck: "scoop", drop: 20, neckHalf: 76,
          hw: [[220, 96], [248, 112], [300, 106], [360, 102], [430, 100], [486, 98]],
          keepSkin: [470, 580], donor: "bodice", z: 1,
          color: { hue: 226, sat: .07, lo: .05, hi: .24 } },
        { kind: "bodice", cx: 532, y0: 218, hem: 566, neck: "scoop", drop: 30, neckHalf: 82,
          hw: [[218, 100], [248, 118], [300, 112], [360, 108], [430, 104], [566, 102]],
          cut: [{ cx: 532, y0: 214, y1: 430, w0: 6, w1: 58 }],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 212, sat: .40, lo: .16, hi: .62 } },
        { kind: "sleeve", ax: 400, y0: 218, cuff: 486, hw: [[218, 32], [320, 33], [420, 31], [486, 29]],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 212, sat: .40, lo: .16, hi: .60 } },
        { kind: "sleeve", ax: 636, y0: 218, cuff: 486, hw: [[218, 28], [320, 30], [420, 30], [486, 28]],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 212, sat: .40, lo: .16, hi: .60 } },
        { kind: "band", x0: 368, x1: 434, y0: 462, y1: 488,
          donor: "bodice", z: 3, color: { hue: 212, sat: .42, lo: .12, hi: .54 } },
        { kind: "band", x0: 606, x1: 666, y0: 462, y1: 488,
          donor: "bodice", z: 3, color: { hue: 212, sat: .42, lo: .12, hi: .54 } },
        { kind: "lower", cx: 527, y0: 492, hem: 898, keepSkin: [470, 580],
          hw: [[492, 98], [560, 100], [680, 106], [800, 110], [898, 112]],
          donor: "pants", z: 2, ao: .22, color: { hue: 218, sat: .26, lo: .06, hi: .38 } },
        { kind: "band", x0: 428, x1: 626, y0: 492, y1: 516,
          donor: "pants", z: 3, color: { hue: 218, sat: .28, lo: .05, hi: .32 } }
      ],
      under: { donor: "pants", color: { hue: 218, sat: .26, lo: .06, hi: .36 } }
    },

    /* 4. Charcoal suit, no tie — the door, and dinner. She takes his collar
       and then fists in his shirt, so the shirt has to be a real shirt under a
       real jacket: white, open at the throat, framed by charcoal lapels. */
    "Zade:evening-casual": {
      band: [218, 898], grow: 30,
      parts: [
        { kind: "wedge", cx: 532, y0: 222, y1: 348, w0: 8, w1: 50,
          donor: "skin", z: 1, skin: true },
        { kind: "bodice", cx: 532, y0: 220, hem: 500, neck: "scoop", drop: 26, neckHalf: 78,
          hw: [[220, 96], [248, 114], [300, 108], [360, 104], [430, 102], [500, 100]],
          cut: [{ cx: 532, y0: 222, y1: 354, w0: 6, w1: 42 }],
          keepSkin: [470, 580], donor: "bodice", z: 1,
          color: { hue: 40, sat: .07, lo: .66, hi: .98 } },
        { kind: "bodice", cx: 532, y0: 218, hem: 566, neck: "scoop", drop: 34, neckHalf: 86,
          hw: [[218, 100], [248, 120], [300, 114], [360, 110], [430, 106], [566, 104]],
          cut: [{ cx: 532, y0: 216, y1: 392, w0: 7, w1: 64 }],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 218, sat: .12, lo: .09, hi: .40 } },
        { kind: "sleeve", ax: 400, y0: 218, cuff: 500, hw: [[218, 32], [320, 33], [420, 31], [500, 28]],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 218, sat: .12, lo: .09, hi: .38 } },
        { kind: "sleeve", ax: 636, y0: 218, cuff: 500, hw: [[218, 28], [320, 30], [420, 30], [500, 27]],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 218, sat: .12, lo: .09, hi: .38 } },
        { kind: "band", x0: 368, x1: 434, y0: 476, y1: 502,
          donor: "bodice", z: 3, color: { hue: 218, sat: .12, lo: .13, hi: .46 } },
        { kind: "band", x0: 606, x1: 666, y0: 476, y1: 502,
          donor: "bodice", z: 3, color: { hue: 218, sat: .12, lo: .13, hi: .46 } },
        { kind: "lower", cx: 527, y0: 552, hem: 898, keepSkin: [470, 580],
          hw: [[552, 94], [640, 98], [760, 106], [898, 112]],
          donor: "pants", z: 2, ao: .26, color: { hue: 220, sat: .10, lo: .05, hi: .30 } },
        { kind: "band", x0: 432, x1: 622, y0: 552, y1: 574,
          donor: "pants", z: 3, color: { hue: 220, sat: .10, lo: .04, hi: .24 } }
      ],
      under: { donor: "pants", color: { hue: 220, sat: .10, lo: .05, hi: .28 } }
    },

    /* 2. White tee + grey joggers — the coda. He is alone on a mattress in a
       cardboard nation at midnight, so the moving-day denim comes off. Loose,
       pale, gathered at the ankle: the visual opposite of the suit he wore two
       hours earlier. */
    "Zade:midnight": {
      band: [218, 900], grow: 30,
      parts: [
        { kind: "bodice", cx: 532, y0: 220, hem: 470, neck: "scoop", drop: 20, neckHalf: 76,
          hw: [[220, 96], [248, 112], [300, 108], [360, 104], [430, 102], [470, 100]],
          keepSkin: [470, 580], donor: "bodice", z: 2,
          color: { hue: 40, sat: .03, lo: .62, hi: .96 } },
        { kind: "sleeve", ax: 400, y0: 218, cuff: 344, hw: [[218, 32], [300, 32], [344, 30]],
          donor: "bodice", z: 2, color: { hue: 40, sat: .03, lo: .60, hi: .94 } },
        { kind: "sleeve", ax: 636, y0: 218, cuff: 344, hw: [[218, 28], [300, 30], [344, 28]],
          donor: "bodice", z: 2, color: { hue: 40, sat: .03, lo: .60, hi: .94 } },
        { kind: "sleeve", ax: 400, y0: 336, cuff: 478, hw: [[336, 28], [420, 26], [478, 24]],
          donor: "skin", z: 3, skin: true },
        { kind: "sleeve", ax: 636, y0: 336, cuff: 478, hw: [[336, 26], [420, 25], [478, 23]],
          donor: "skin", z: 3, skin: true },
        { kind: "lower", cx: 527, y0: 452, hem: 900, keepSkin: [470, 580],
          hw: [[452, 100], [560, 104], [680, 108], [800, 110], [900, 112]],
          donor: "pants", z: 2, ao: .22, color: { hue: 214, sat: .05, lo: .34, hi: .78 } },
        { kind: "band", x0: 424, x1: 630, y0: 452, y1: 482,
          donor: "pants", z: 3, color: { hue: 214, sat: .06, lo: .28, hi: .70 } },
        { kind: "band", x0: 420, x1: 636, y0: 866, y1: 900,
          donor: "pants", z: 3, color: { hue: 214, sat: .06, lo: .28, hi: .70 } }
      ],
      under: { donor: "pants", color: { hue: 214, sat: .05, lo: .34, hi: .76 } }
    }
  };

  const portraitCache = new Map();
  const wardrobeCache = new Map();

  const smoothstep = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);

  const luma = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  /* Skin is warm; the hair and garments in these two shots are not. The
     separation is clean enough to rely on — scanning the garment bands finds
     ~2% warm pixels, while hands and forearms run 60%+. Anything warm is left
     alone, which is what stops hands and shins from turning blue. */
  function isSkin(r, g, b) {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (d < 12) return false;
    let h;
    if (mx === r) h = 60 * (((g - b) / d) % 6);
    else if (mx === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
    if (h < 0) h += 360;
    if (!((h >= 8 && h <= 52) || h >= 350)) return false;
    return d / mx > 0.16 || (r - b) > 20;
  }

  /* Same test the runtime cut-out uses, so a garment is never painted into the
     studio backdrop that the cut-out has already removed. */
  function isBackdrop(r, g, b) {
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    return mn > 148 && mx - mn < 62;
  }

  /* Place a colour at a given lightness — the caller supplies the lightness so
     the source pixel's own shading survives the hue change. */
  function dye(l, hue, sat, nl) {
    const C = (1 - Math.abs(2 * nl - 1)) * sat;
    const X = C * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = nl - C / 2;
    let R, G, B;
    if (hue < 60)       { R = C; G = X; B = 0; } else if (hue < 120) { R = X; G = C; B = 0; }
    else if (hue < 180) { R = 0; G = C; B = X; } else if (hue < 240) { R = 0; G = X; B = C; }
    else if (hue < 300) { R = X; G = 0; B = C; } else                { R = C; G = 0; B = X; }
    return [(R + m) * 255, (G + m) * 255, (B + m) * 255];
  }

  function loadPortrait(character) {
    if (portraitCache.has(character)) return portraitCache.get(character);
    const pending = new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth || 1024; c.height = img.naturalHeight || 1024;
        const x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(img, 0, 0);
        const data = x.getImageData(0, 0, c.width, c.height).data;
        /* the warm-pixel and backdrop tests are the hot loop's inner predicate,
           so they are answered once per photo and then only looked up */
        const skin = new Uint8Array(c.width * c.height);
        const solid = new Uint8Array(c.width * c.height);
        const left = new Int32Array(c.height).fill(1e6);
        const right = new Int32Array(c.height).fill(-1);
        for (let y = 0; y < c.height; y++) {
          for (let x = 0; x < c.width; x++) {
            const i = (y * c.width + x) * 4, p = y * c.width + x;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            if (isBackdrop(r, g, b)) continue;
            solid[p] = 1;
            if (isSkin(r, g, b)) skin[p] = 1;
            if (left[y] > x) left[y] = x;
            right[y] = x;
          }
        }
        resolve({ w: c.width, h: c.height, data: data, skin: skin, solid: solid, left: left, right: right });
      };
      img.onerror = () => resolve(null);
      img.src = "assets/" + String(character).toLowerCase() + ".jpg";
    });
    portraitCache.set(character, pending);
    return pending;
  }

  /* ---- silhouettes -------------------------------------------------------
     Every shape answers "how far outside this point am I", negative inside,
     which gives antialiased edges, rim shading and cheap subtraction for free.
     Each one also reports its own half-width per row so the fill can be lit
     across the body rather than sampled flat. */

  function hwAt(pts, y) {
    if (y <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (y <= pts[i][0]) {
        const span = (pts[i][0] - pts[i - 1][0]) || 1;
        const t = (y - pts[i - 1][0]) / span;
        return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t;
      }
    }
    return pts[pts.length - 1][1];
  }

  /* Neckline depth by distance from the centre line: a V, a scoop, a dropped
     shoulder, or the shallow curve of a crew neck. */
  function neckEdge(kind, drop, half, x, cx) {
    const d = Math.min(1, Math.abs(x - cx) / half);
    if (kind === "v") return drop * d;
    if (kind === "scoop") return drop * (1 - Math.sqrt(Math.max(0, 1 - d * d)));
    if (kind === "off") return drop * (x < cx ? 0 : 1.7 * d);
    return drop * d * 0.4;
  }

  function wedgeSd(o, x, y) {
    const t = clamp01((y - o.y0) / ((o.y1 - o.y0) || 1));
    return Math.max(Math.abs(x - o.cx) - (o.w0 + (o.w1 - o.w0) * t), o.y0 - y, y - o.y1);
  }

  function makePart(o) {
    const part = {
      z: o.z || 0,
      donor: o.donor,
      color: o.color || null,
      skin: !!o.skin,
      keepSkin: o.keepSkin || null,
      preserveSkin: !!o.preserveSkin,
      muscle: !!o.muscle,
      ao: o.ao || 0,
      fold: o.fold || 1.14,
      flat: !!o.flat,
      y0: o.y0 !== undefined ? o.y0 : (o.cy !== undefined ? o.cy - o.ry : 0),
      y1: o.y1 !== undefined ? o.y1 : (o.hem !== undefined ? o.hem : (o.cuff !== undefined ? o.cuff : (o.cy !== undefined ? o.cy + o.ry : 0))),
      mid: o.cx !== undefined ? o.cx : (o.ax !== undefined ? o.ax : (o.x0 + o.x1) / 2)
    };
    if (o.kind === "bodice") {
      const cx = o.cx, cuts = o.cut || [];
      part.halfAt = y => hwAt(o.hw, y);
      part.sd = (x, y) => {
        let d = Math.max(Math.abs(x - cx) - hwAt(o.hw, y),
                         (o.y0 + neckEdge(o.neck || "scoop", o.drop || 0, o.neckHalf || 40, x, cx)) - y,
                         y - o.hem);
        for (let i = 0; i < cuts.length; i++) d = Math.max(d, -wedgeSd(cuts[i], x, y));
        return d;
      };
    } else if (o.kind === "lower") {
      const cx = o.cx;
      part.halfAt = y => hwAt(o.hw, y);
      part.sd = (x, y) => {
        const dx = Math.abs(x - cx);
        let d = Math.max(dx - hwAt(o.hw, y), o.y0 - y, y - o.hem);
        /* the gap between the legs is a hole in the garment, so its own
           distance is positive outside the hole and gets subtracted */
        if (o.gap) { const g = hwAt(o.gap, y); if (g > 0) d = Math.max(d, g - dx); }
        return d;
      };
    } else if (o.kind === "sleeve") {
      const ax = o.ax;
      part.halfAt = y => hwAt(o.hw, y);
      part.sd = (x, y) => Math.max(Math.abs(x - ax) - hwAt(o.hw, y), o.y0 - y, y - o.cuff);
    } else if (o.kind === "wedge") {
      part.halfAt = () => Math.max(o.w0, o.w1);
      part.sd = (x, y) => wedgeSd(o, x, y);
    } else if (o.kind === "cup") {
      const cx = o.cx, cy = o.cy, rx = o.rx, ry = o.ry;
      part.halfAt = y => rx * Math.sqrt(Math.max(0, 1 - Math.pow((y - cy) / ry, 2)));
      part.sd = (x, y) => (Math.sqrt(Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2)) - 1) * Math.min(rx, ry);
    } else {
      const half = (o.x1 - o.x0) / 2;
      part.halfAt = () => half;
      part.sd = (x, y) => Math.max(o.x0 - x, x - o.x1, o.y0 - y, y - o.y1);
    }
    const pad = (o.hw ? Math.max.apply(null, o.hw.map(p => p[1])) : part.halfAt((part.y0 + part.y1) / 2)) + 6;
    part.box = o.kind === "band"
      ? [o.x0 - pad, o.y0 - 6, o.x1 + pad, o.y1 + 6]
      : [part.mid - pad, part.y0 - 6, part.mid + pad, part.y1 + 6];
    return part;
  }

  /* Build one look. Returns a canvas holding only the pixels the look changes;
     everything else stays transparent so the portrait underneath — face, hair,
     hands, shoes — shows through untouched. */
  function dressPortrait(character, outfit) {
    const key = character + ":" + outfit;
    if (wardrobeCache.has(key)) return wardrobeCache.get(key);
    const look = GARMENTS[key];
    const donors = DONORS[character];
    const pending = (!look || !donors ? Promise.resolve(null) : loadPortrait(character).then(src => {
      if (!src) return null;
      const out = document.createElement("canvas");
      out.width = src.w; out.height = src.h;
      const ctx = out.getContext("2d");
      const img = ctx.createImageData(src.w, src.h);
      const d = img.data;
      const S = src.data, W = src.w;
      const left = src.left, right = src.right, skinMask = src.skin, solidMask = src.solid;

      const parts = look.parts.map(makePart).sort((a, b) => a.z - b.z);
      /* the fill colour is always drawn last so no garment can leave a sliver
         of the model's original outfit showing through */
      const fill = look.under ? Object.assign(makePart({
        kind: "band", x0: 0, x1: W - 1, y0: look.band[0] + 56, y1: look.band[1],
        donor: look.under.donor, color: look.under.color, z: 99, flat: true
      }), { skipSkin: true, fill: true }) : null;
      if (fill) parts.push(fill);

      /* Per-donor light statistics. The source cloth is very dark, so a plain
         0..1 lightness map would squeeze every fold into a handful of
         identical values and the garment would read as flat paint. Stretch
         the donor's own dark range across the outfit's range instead. */
      const stats = {};
      let skinTone = [210, 164, 146], skinCount = 0;
      const skinDonor = donors.skin;
      if (skinDonor) {
        let red = 0, green = 0, blue = 0;
        for (let y = skinDonor.y0; y < skinDonor.y1; y++) {
          for (let x = skinDonor.x0; x < skinDonor.x1; x++) {
            const at = y * W + x, i = at * 4;
            if (!solidMask[at] || !skinMask[at]) continue;
            red += S[i]; green += S[i + 1]; blue += S[i + 2]; skinCount++;
          }
        }
        if (skinCount) skinTone = [red / skinCount, green / skinCount, blue / skinCount];
      }
      for (const name of Object.keys(donors)) {
        const r = donors[name];
        const vals = [];
        for (let y = r.y0; y < r.y1; y++) {
          for (let x = r.x0; x < r.x1; x++) {
            const p = y * W + x;
            if (!solidMask[p] || skinMask[p]) continue;
            const i = p * 4;
            vals.push(luma(S[i], S[i + 1], S[i + 2]));
          }
        }
        vals.sort((a, b) => a - b);
        const q = p => vals.length ? vals[Math.min(vals.length - 1, Math.floor(vals.length * p))] : 0;
        const dark = q(0.02), pale = q(0.98);
        stats[name] = { dark, span: Math.max(0.04, pale - dark), mid: q(0.5) };
      }

      /* Row spans of the photographed figure. A garment may cover less of her
         than the studio shot does, but never more: without this a wide skirt
         would float in the room beside a pair of legs. */
      const grow = look.grow || 24;

      /* donor sample: mirrored about the centre line, because both photos are
         lit front-on and a fold that reads on one side must read on the other */
      function donorPoint(r, u, v) {
        const sx = Math.round(r.x0 + (r.x1 - r.x0) * (u > 0.5 ? 1 - u : u));
        const sy = Math.round(r.y0 + (r.y1 - r.y0) * clamp01(v));
        return Math.min(src.h - 1, sy) * W + Math.min(W - 1, sx);
      }
      function sampleLuma(r, u, v) {
        const p = donorPoint(r, u, v);
        if (!solidMask[p] || skinMask[p]) return null;
        const i = p * 4;
        return luma(S[i], S[i + 1], S[i + 2]);
      }
      function sampleSkin(r, u, v) {
        const i = donorPoint(r, u, v) * 4;
        return [S[i], S[i + 1], S[i + 2]];
      }
      function blend(i, R, G, B, a) {
        const da = d[i + 3] / 255;
        const oa = a + da * (1 - a);
        if (oa <= 0) return;
        const k = da * (1 - a);
        d[i] = Math.round((R * a + d[i] * k) / oa);
        d[i + 1] = Math.round((G * a + d[i + 1] * k) / oa);
        d[i + 2] = Math.round((B * a + d[i + 2] * k) / oa);
        d[i + 3] = Math.round(oa * 255);
      }

      for (let pi = 0; pi < parts.length; pi++) {
        const p = parts[pi];
        const donor = donors[p.donor] || donors.bodice;
        const st = stats[p.donor] || stats.bodice;
        const box = p.box;
        const yA = Math.max(0, Math.floor(box[1])), yB = Math.min(src.h - 1, Math.ceil(box[3]));
        const xA = Math.max(0, Math.floor(box[0])), xB = Math.min(W - 1, Math.ceil(box[2]));
        const span = (p.y1 - p.y0) || 1;
        for (let y = yA; y <= yB; y++) {
          if (right[y] < 0) continue;                       /* a row with no figure in it */
          const half = Math.max(1, p.halfAt(y));
          /* the shape's own box, intersected with the figure's span on this
             row — the fill spans the whole image, so this is most of the work */
          const lo = Math.max(xA, left[y] - grow, Math.floor(p.mid - half - 3));
          const hi = Math.min(xB, right[y] + grow, Math.ceil(p.mid + half + 3));
          const v = (y - p.y0) / span;
          for (let x = lo; x <= hi; x++) {
            const sd = p.sd(x, y);
            if (sd > 1) continue;
            const alpha = clamp01(0.5 - sd / 1.8);
            if (alpha <= 0) continue;
            const i = (y * W + x) * 4, at = y * W + x;
            if (!solidMask[at]) continue;
            if (p.fill && d[i + 3] > 0) continue;
            const warm = skinMask[at] === 1;
            /* hands clasped in front of the body sit on top of whatever she is
               wearing, so a cloth part leaves warm pixels alone inside its
               `keepSkin` window — the rows the hands occupy in this shot */
            if (p.preserveSkin && warm) continue;
            if (!p.skin && warm && p.keepSkin && y >= p.keepSkin[0] && y <= p.keepSkin[1]) continue;
            if (p.skipSkin && warm) continue;
            const u = clamp01((x - (p.mid - half)) / (half * 2));
            /* light the part as a body: rounded across, shadowed under whatever
               hangs above it, and darker where it turns away at its own edge */
            let k = p.flat ? 1 : 0.80 + 0.28 * (1 - Math.pow(Math.abs(2 * u - 1), 1.7));
            k *= 1 - p.ao * (1 - smoothstep(0, 34, y - p.y0));
            k *= 1 - 0.26 * smoothstep(-7, -0.6, sd);
            let R, G, B;
            if (p.skin && p.muscle) {
              /* The source portrait has no exposed torso to borrow. Use its
                 actual skin palette, with restrained chest/abdominal shading,
                 rather than stretching a cheek patch into a pixelated wedge. */
              const tx = (x - p.mid) / Math.max(1, half);
              let light = 0.96 + 0.10 * (1 - Math.abs(tx)) + 0.025 * Math.sin(Math.PI * v);
              const pecY = Math.exp(-Math.pow((v - 0.34) / 0.17, 2));
              const pecL = Math.exp(-Math.pow((Math.abs(tx) - 0.34) / 0.24, 2));
              light += 0.035 * pecY * pecL;
              light -= 0.075 * Math.exp(-Math.pow((v - 0.51) / 0.028, 2));
              if (v > 0.52 && v < 0.98) {
                const row = Math.round((v - 0.57) * 5.2);
                const ridge = 0.59 + row * 0.075;
                light -= 0.035 * Math.exp(-Math.pow((v - ridge) / 0.018, 2));
                light -= 0.025 * Math.exp(-Math.pow(tx / 0.055, 2));
                light += 0.025 * Math.exp(-Math.pow((Math.abs(tx) - 0.42) / 0.11, 2));
              }
              R = skinTone[0] * light * k;
              G = skinTone[1] * light * k;
              B = skinTone[2] * light * k;
            } else if (p.skin) {
              const s = sampleSkin(donor, u, v);
              R = s[0] * k; G = s[1] * k; B = s[2] * k;
            } else {
              let l = sampleLuma(donor, u, v);
              if (l === null) l = st.mid;
              const boosted = st.mid + (l - st.mid) * p.fold;
              const t = clamp01((boosted - st.dark) / st.span);
              const nl = Math.min(0.995, Math.max(0.02, (p.color.lo + t * (p.color.hi - p.color.lo)) * k));
              const c = dye(l, p.color.hue, p.color.sat, nl);
              R = c[0]; G = c[1]; B = c[2];
            }
            blend(i, Math.min(255, R), Math.min(255, G), Math.min(255, B), alpha);
          }
        }
      }
      ctx.putImageData(img, 0, 0);
      return out;
    }));
    wardrobeCache.set(key, pending);
    return pending;
  }

  /* Paint the look into the slot's wardrobe layer. Async because the portrait
     has to load first; a token guards against a scene change racing the decode. */
  function paintWardrobe(layer, character, outfit) {
    if (!GARMENTS[character + ":" + outfit]) { layer.innerHTML = ""; return; }
    const token = (layer.dataset.token = String(Number(layer.dataset.token || 0) + 1));
    let canvas = layer.querySelector("canvas.wardrobe-art");
    if (!canvas) { layer.innerHTML = ""; canvas = document.createElement("canvas"); canvas.className = "wardrobe-art"; layer.appendChild(canvas); }
    canvas.setAttribute("aria-hidden", "true");
    dressPortrait(character, outfit).then(painted => {
      if (!painted || layer.dataset.token !== token) return;
      canvas.width = painted.width; canvas.height = painted.height;
      canvas.getContext("2d").drawImage(painted, 0, 0);
    });
  }

  function wardrobeArtwork(character, outfit) { return dressPortrait(character, outfit); }

  /* ---------------- imported outfits ----------------
     The re-dye above is the fallback, not the only way to dress a character.
     assets/outfits/manifest.json maps a look to a real photograph of that
     character wearing that outfit, and it wins over the re-dye when present.

     The manifest is explicit rather than a directory probe on purpose: sniffing
     for files means four 404s per look, which paints the console red for every
     player of a feature most of them are not using. One manifest costs one 200
     and tells us exactly which looks to resolve.

     A re-shot body will not sit in the frame exactly like the base portrait, so
     an entry may carry { crop, offsetX, scale } alongside its src. Those are
     set on the slot, not on the <img>, because the portrait, the re-dye and the
     import all read one shared registration rule from there — set it on the
     image alone and the layers drift apart. */
  const outfitPhotoCache = new Map();
  let outfitManifest = null;

  function loadOutfitManifest() {
    if (outfitManifest) return outfitManifest;
    outfitManifest = fetch("assets/outfits/manifest.json", { cache: "no-cache" })
      .then((response) => (response.ok ? response.json() : {}))
      .catch(() => ({}))
      .then((data) => (data && data.looks ? data.looks : data) || {});
    return outfitManifest;
  }

  function outfitSource(character, outfit) {
    const key = character + ":" + outfit;
    if (outfitPhotoCache.has(key)) return outfitPhotoCache.get(key);
    const pending = loadOutfitManifest().then((looks) => {
      const entry = looks[key] || looks[String(character).toLowerCase() + "-" + String(outfit).toLowerCase()];
      if (!entry) return null;
      const spec = typeof entry === "string" ? { src: entry } : entry;
      if (!spec || typeof spec.src !== "string" || !spec.src) return null;
      return {
        src: spec.src,
        crop: typeof spec.crop === "string" ? spec.crop : "",
        offsetX: typeof spec.offsetX === "string" ? spec.offsetX : "",
        scale: typeof spec.scale === "number" ? spec.scale : 1,
      };
    });
    outfitPhotoCache.set(key, pending);
    return pending;
  }

  function presentActor(slot, spec, defaults) {
    const model = Object.assign({}, defaults, spec || {});
    if (model.visible === false) { slot.dataset.desired = "hidden"; return model; }
    slot.dataset.desired = "visible";
    slot.dataset.character = model.name || "";
    slot.dataset.outfit = model.outfit || "casual";
    slot.dataset.pose = model.pose || "neutral";
    slot.dataset.expression = model.expression || "attentive";
    slot.setAttribute("aria-label", [model.name, model.outfit, model.pose, model.expression].filter(Boolean).join(", "));
    let wardrobe = slot.querySelector(".wardrobe-layer");
    if (!wardrobe) { wardrobe = document.createElement("span"); wardrobe.className = "wardrobe-layer"; slot.appendChild(wardrobe); }
    dressSlot(slot, wardrobe, model.name, model.outfit);
    return model;
  }

  /* An imported outfit replaces both the base portrait and the re-dye. The
     lookup is async, so until it answers the slot keeps wearing whatever it
     already had — a first-load probe must never flash a character twice. */
  function dressSlot(slot, wardrobe, character, outfit) {
    const img = slot.querySelector("img");
    if (!img) return;
    const token = String(Number(slot.dataset.dressToken || 0) + 1);
    slot.dataset.dressToken = token;
    outfitSource(character, outfit).then((photo) => {
      if (slot.dataset.dressToken !== token) return;
      if (photo) {
        wardrobe.innerHTML = "";
        slot.dataset.outfitSource = photo.src;
        slot.style.setProperty("--vn-crop", photo.crop || "var(--vn-crop)");
        slot.style.setProperty("--vn-scale", String(photo.scale));
        slot.style.setProperty("--vn-offset-x", photo.offsetX || "50%");
      } else {
        slot.dataset.outfitSource = "";
        slot.style.removeProperty("--vn-crop");
        slot.style.removeProperty("--vn-scale");
        slot.style.removeProperty("--vn-offset-x");
        paintWardrobe(wardrobe, character, outfit);
      }
      window.TwistedVisuals.setPortraitSource(img, photo ? photo.src : "assets/" + String(character).toLowerCase() + ".jpg");
    });
  }
  window.TwistedVisuals = { renderBackground, renderForeground, presentActor, wardrobeArtwork, outfitSource };
})();
