// Génère une image Gemini.
// Usage : node img2.mjs <prompt.txt> <sortie.png> [--bg] [--aspect 9:16] [--ref fichier.png ...]
//  --bg     : fond plein cadre, pas de détourage
//  sinon    : détourage du fond blanc relié aux bords (les blancs à l'intérieur des contours sont gardés)
import fs from 'node:fs'; import path from 'node:path'; import {createRequire} from 'node:module';
const require = createRequire(path.join(process.env.HOME, '.claude/skills/directing-stickman-videos/package.json'));
const sharp = require('sharp');
const args = process.argv.slice(2);
const [promptFile, out] = args;
const bg = args.includes('--bg');
const aspect = args.includes('--aspect') ? args[args.indexOf('--aspect') + 1] : (bg ? '9:16' : '1:1');
const refs = args.flatMap((a, i) => a === '--ref' ? [args[i + 1]] : []);
const parts = [{text: fs.readFileSync(promptFile, 'utf8')}];
for (const r of refs) parts.push({inlineData: {mimeType: 'image/png', data: fs.readFileSync(r).toString('base64')}});
async function call(withSize) {
  const imageConfig = {aspectRatio: aspect, ...(withSize ? {imageSize: '2K'} : {})};
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent', {method: 'POST', headers: {'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY}, body: JSON.stringify({contents: [{role: 'user', parts}], generationConfig: {responseModalities: ['TEXT', 'IMAGE'], imageConfig}})});
  return {res, d: await res.json()};
}
let {res, d} = await call(true);
if (res.status === 400) ({res, d} = await call(false));
if (!res.ok) { console.error(path.basename(out), 'HTTP', res.status, d.error?.status, (d.error?.message || '').slice(0, 200)); process.exit(1); }
const p = d.candidates?.[0]?.content?.parts?.find(x => x.inlineData);
if (!p) { console.error(path.basename(out), 'pas d image'); process.exit(1); }
const raw = Buffer.from(p.inlineData.data, 'base64');
const rawDir = path.join(path.dirname(out), '..', 'raw'); fs.mkdirSync(rawDir, {recursive: true});
fs.writeFileSync(path.join(rawDir, path.basename(out, '.png') + (p.inlineData.mimeType.includes('png') ? '.png' : '.jpg')), raw);
if (bg) { await sharp(raw).png().toFile(out); const m = await sharp(out).metadata(); console.log('ok', path.basename(out), m.width + 'x' + m.height); process.exit(0); }
// Détourage par remplissage depuis les bords : retire le blanc/gris très clair relié au bord.
const {data, info} = await sharp(raw).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const W = info.width, H = info.height, seen = new Uint8Array(W * H);
const light = i => { const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2]; return Math.min(r, g, b) > 228 && Math.max(r, g, b) - Math.min(r, g, b) < 22; };
const stack = [];
for (let x = 0; x < W; x++) { stack.push(x, (H - 1) * W + x); }
for (let y = 0; y < H; y++) { stack.push(y * W, y * W + W - 1); }
while (stack.length) { const i = stack.pop(); if (seen[i] || !light(i)) continue; seen[i] = 1; const x = i % W, y = (i / W) | 0;
  if (x > 0) stack.push(i - 1); if (x < W - 1) stack.push(i + 1); if (y > 0) stack.push(i - W); if (y < H - 1) stack.push(i + W); }
for (let i = 0; i < W * H; i++) if (seen[i]) data[i * 4 + 3] = 0;
// Adoucit le bord : pixels opaques voisins du fond -> alpha partiel selon leur clarté.
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (seen[i]) continue;
  if (seen[i - 1] || seen[i + 1] || seen[i - W] || seen[i + W]) { const m = Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]); data[i * 4 + 3] = Math.max(60, Math.min(255, (255 - m) * 3)); } }
await sharp(data, {raw: info}).trim({threshold: 1}).png().toFile(out);
const m = await sharp(out).metadata(); console.log('ok', path.basename(out), m.width + 'x' + m.height);
