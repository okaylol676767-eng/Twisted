/* ============================================================
   TWISTED — tools/generate-assets.js
   Optional procedural placeholder portraits (does not overwrite the
   supplied JPG character art used by the game).
   Stylized silhouettes, zero dependencies.
   Run: node tools/generate-assets.js
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/* ---------------- tiny PNG encoder (RGB, 8-bit) ---------------- */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgb /* Buffer w*h*3 */) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0; // filter: none
    rgb.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

/* ---------------- math helpers ---------------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/* soft union of signed fields (positive = inside) */
const union = (...fs) => fs.reduce((m, f) => Math.max(m, f), -1e9);
function ellipse(nx, ny, cx, cy, rx, ry) {
  const dx = (nx - cx) / rx, dy = (ny - cy) / ry;
  return 1 - Math.sqrt(dx * dx + dy * dy); // ~signed distance, inside > 0
}
function band(nx, edge, soft, softness) {
  return (soft - Math.abs(nx - edge)) / softness;
}

/* ---------------- portrait painter ----------------
   cfg: { w,h, glowSide(+1|-1), hair:'long'|'slick', jacket:boolean, key:string } */
function paint(cfg) {
  const W = cfg.w, H = cfg.h;
  const rgb = Buffer.alloc(W * H * 3);
  const px = (x, y, c) => {
    const i = (y * W + x) * 3;
    rgb[i] = c[0]; rgb[i + 1] = c[1]; rgb[i + 2] = c[2];
  };

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const nx = x / W - 0.5;           // -0.5 .. 0.5
      const ny = y / H;                 // 0 .. 1
      const g = cfg.glowSide;

      /* ---------- background ---------- */
      let r = 13, gg = 11, b = 16;
      const glowX = 0.5 + 0.10 * g;
      const dgx = (x / W - glowX) * 1.15, dgy = (y / H - 0.80);
      const dGlow = Math.sqrt(dgx * dgx + dgy * dgy);
      const glow = Math.max(0, 1 - dGlow / 0.62);
      r += 190 * glow * glow * 0.42;
      gg += 46 * glow * glow * 0.38;
      b += 58 * glow * glow * 0.40;
      const dgx2 = (x / W - 0.5) * 1.3, dgy2 = (y / H + 0.15);
      const glow2 = Math.max(0, 1 - Math.sqrt(dgx2 * dgx2 + dgy2 * dgy2) / 0.75);
      r += 40 * glow2 * glow2; gg += 30 * glow2 * glow2; b += 52 * glow2 * glow2;
      const vx = x / W - 0.5, vy = y / H - 0.5;
      const vig = 1 - clamp(Math.sqrt(vx * vx + vy * vy) * 1.45 - 0.28, 0, 0.62);
      r *= vig; gg *= vig; b *= vig;

      /* ---------- silhouette fields ---------- */
      let hair, face, torso, collar = -1;
      if (cfg.hair === "long") {
        const wave = 0.030 * Math.sin(ny * 21 + nx * 6) + 0.012 * Math.sin(ny * 43);
        const curtainW = 0.205 + wave + 0.05 * smooth((ny - 0.18) / 0.3) - 0.05 * smooth((ny - 0.72) / 0.4);
        hair = union(
          ellipse(nx, ny, 0, 0.305, 0.215, 0.20),
          ny > 0.28 ? band(nx, 0, curtainW, 0.012) : -1
        );
        face = ellipse(nx, ny, 0, 0.325, 0.102, 0.135);
        face = Math.min(face, band(nx * 2.2 + ny * 0.2, 0, 0.20, 0.02)); /* jaw taper */
      } else {
        hair = ellipse(nx, ny, 0, 0.288, 0.152, 0.150);
        hair = Math.min(hair, ny < 0.315 ? 1 : band(ny, 0.315, 0.02, 0.012));
        face = ellipse(nx, ny, 0, 0.322, 0.098, 0.128);
        face = Math.min(face, band(nx * 2.1, 0, 0.20, 0.02));
      }
      const neckTop = 0.425, shoulderY = cfg.jacket ? 0.515 : 0.545;
      const neck = union(
        ny > neckTop && ny < shoulderY + 0.03 ? band(nx, 0, 0.050, 0.012) : -1,
        ellipse(nx, ny, 0, 0.435, 0.075, 0.045)
      );
      const torsoW = 0.16 + 0.20 * smooth((ny - shoulderY) / 0.30);
      torso = ny > shoulderY ? band(nx, 0, torsoW, 0.015) : -1;
      if (cfg.jacket) {
        collar = ny > shoulderY - 0.01 && ny < shoulderY + 0.10
          ? band(Math.abs(nx), 0.075, 0.045, 0.012) : -1;
      }

      const body = union(hair, neck, torso);
      const alpha = clamp(0.5 + body / 0.008, 0, 1);

      /* ---------- colors ---------- */
      let cr = r, cg = gg, cb = b;
      if (alpha > 0) {
        const skin = [232, 200, 172];
        const shade = 1 - 0.28 * clamp(1 - (face + 0.02) / 0.06, 0, 1) - 0.10 * (ny - 0.32);
        const skinC = [skin[0] * shade, skin[1] * shade, skin[2] * shade];

        if (face > 0 && neck < 0) {
          cr = skinC[0]; cg = skinC[1]; cb = skinC[2];
        } else if (neck > 0 && torso < 0 && hair < 0.004) {
          const ns = 1 - 0.18 * clamp(1 - (neck + 0.02) / 0.05, 0, 1);
          cr = skinC[0] * ns; cg = skinC[1] * ns; cb = skinC[2] * ns;
        } else if (cfg.jacket && torso > 0) {
          /* leather jacket + darker tee */
          const tee = band(Math.abs(nx), 0, 0.055 + 0.10 * smooth((ny - shoulderY) / 0.25), 0.015);
          if (tee > 0 && ny > shoulderY + 0.06) {
            cr = 26; cg = 24; cb = 30;
          } else {
            const sheen = 0.16 * Math.exp(-Math.pow((nx - 0.16 * g) / 0.13, 2)) * (0.5 + 0.5 * Math.sin(ny * 34));
            cr = 30 + 60 * sheen; cg = 27 + 52 * sheen; cb = 34 + 55 * sheen;
          }
          if (collar > 0) { cr += 16; cg += 14; cb += 18; }
          if (Math.abs(nx) < 0.006 && ny > shoulderY + 0.08) { cr += 26; cg += 24; cb += 28; } /* zip */
        } else {
          /* hair / her black top */
          const streak = cfg.hair === "long"
            ? 0.10 * Math.exp(-Math.pow((nx - 0.085 * g) / 0.05, 2)) * (0.5 + 0.5 * Math.sin(ny * 26 + 1.3))
            : 0.14 * Math.exp(-Math.pow((nx - 0.06 * g) / 0.055, 2)) * (0.6 + 0.4 * Math.sin(ny * 30));
          cr = 23 + 46 * streak; cg = 19 + 38 * streak; cb = 26 + 42 * streak;
          if (torso > 0) { cr = Math.max(cr, 20); cg = Math.max(cg, 17); cb = Math.max(cb, 23); }
        }

        /* rim light on glow side */
        const edge = clamp(1 - Math.abs(body) / 0.014, 0, 1);
        if (nx * g > 0.015 && edge > 0) {
          const rim = edge * edge * (0.55 + 0.45 * glow);
          cr = lerp(cr, 244, rim * 0.55);
          cg = lerp(cg, 226, rim * 0.50);
          cb = lerp(cb, 210, rim * 0.45);
        }
      }

      const a = alpha;
      px(x, y, [
        clamp(lerp(r, cr, a), 0, 255),
        clamp(lerp(gg, cg, a), 0, 255),
        clamp(lerp(b, cb, a), 0, 255),
      ].map(Math.round));
    }
  }
  return encodePNG(W, H, rgb);
}

/* ---------------- emit ---------------- */
const outDir = path.join(__dirname, "..", "assets");
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(path.join(outDir, "adeline.png"),
  paint({ w: 760, h: 952, glowSide: 1, hair: "long", jacket: false }));
fs.writeFileSync(path.join(outDir, "zade.png"),
  paint({ w: 760, h: 952, glowSide: -1, hair: "slick", jacket: true }));

console.log("placeholder PNGs written:", path.join(outDir, "adeline.png"), path.join(outDir, "zade.png"));
