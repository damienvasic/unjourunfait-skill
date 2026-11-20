// Construit project.json (B2, 9:16, 1080x1920) pour « 20 novembre 1969 — Apollo 12 ».
// Temps vidéo = temps de la voix + LEAD. Coordonnées : plan de 1280 × 2275,56.
import fs from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const LEAD = 0.15, TAIL = 2.75, VOICE = 72.0, END = +(LEAD + VOICE + TAIL).toFixed(3);
const LIB = process.env.HOME + '/.claude/skills/directing-stickman-videos/assets/b-audio-library/audio';
const AR = {alsep: .557, 'astro-camera': 1.932, 'astro-climb': 1.735, 'astro-jump': 1.606, 'astro-kneel': 1.072, 'astro-reach': 1.126, 'astro-scoop': 1.090,
  'astro-walk1': 1.329, 'astro-walk2': 1.644, 'astro-wave': 1.836, bg: 1.792, csm: .485, earth: 1.216, flag: 1.150, lm: .907, moon: 1.010, patch: 1.005,
  rockbox: .922, rocks: .272, 'saturn-v': 5.011, surveyor: .951, tag: 1.295};
const NAVY = '#22324f', CREAM = '#f3ead7', GOLD = '#d9b25a', RED = '#b5483c';
const SAFE = {x0: 1280 * .06, x1: 1280 * .88, y0: 2275.56 * .08, y1: 1669};

const r2 = n => Math.round(n * 1000) / 1000;
const img = (id, file, x, y, w, extra = {}) => ({type: 'image', id, path: `art/${file}.png`, x, y, w, h: Math.round(w * AR[file.startsWith('bg-') ? 'bg' : file]), ...extra});
const bg = (id, file) => img(id, file, 0, 0, 1280);
const txt = (id, text, x, y, size, color, from = 0, extra = {}) => ({type: 'text', id, text, x, y, size, color, w: 1100, bold: true,
  ...(from ? {from, keys: [{t: from, alpha: .35, y: y + 12}, {t: r2(from + .25), alpha: 1, y}]} : {}), ...extra});
const mv = (role, reason) => ({motion: {role, reason}});
const pop = (t, x, y, w, dy = 40) => [{t, alpha: 0, x, y: y + dy, w}, {t: r2(t + .35), alpha: 1, x, y, w}];
// Rotation autour du centre (le moteur tourne autour du coin haut-gauche).
function spinKeys(cx, cy, w, h, a0, a1, t0, t1, step = .25) {
  const ks = [];
  for (let t = t0; t <= t1 + 1e-6; t += step) { const a = a0 + (a1 - a0) * (t - t0) / (t1 - t0);
    ks.push({t: r2(t), angle: r2(a), x: r2(cx - (Math.cos(a) * w / 2 - Math.sin(a) * h / 2)), y: r2(cy - (Math.sin(a) * w / 2 + Math.cos(a) * h / 2))}); }
  return ks;
}
const dashes = (prefix, x0, y0, x1, y1, n, t0, dt, color) => Array.from({length: n}, (_, i) => {
  const a = i / n, b = (i + .55) / n;
  return {type: 'line', id: `${prefix}${i}`, points: [[r2(x0 + (x1 - x0) * a), r2(y0 + (y1 - y0) * a)], [r2(x0 + (x1 - x0) * b), r2(y0 + (y1 - y0) * b)]], lineWidth: 6, color, from: r2(t0 + i * dt)};
});

const S = []; // plans
const shot = (start, end, layers, intent, groups, background_ids) => S.push({start, end, layers, portrait: {intent, background_ids, regions: groups.map(([id, role, ids, why]) => ({id, role, layer_ids: ids, intent: why}))}});

// 1 — Titre
shot(0, 2.0, [bg('s1-bg', 'bg-title'),
  txt('s1-a', 'UN JOUR', 280, 640, 170, NAVY),
  txt('s1-b', '20 novembre 1969', 230, 880, 92, RED, .85),
  img('s1-moon', 'moon', 820, 1150, 200, {...mv('prop', 'A small paper moon slides onto the notebook page as the date appears'), keys: [{t: 0, alpha: 0, x: 900}, {t: .6, alpha: 1, x: 820}, {t: 2.0, x: 800}]})],
  'Series title then the date read first; a small paper moon slides in below.',
  [['s1-title', 'information', ['s1-a', 's1-b'], 'UN JOUR title then the date.'], ['s1-prop', 'prop', ['s1-moon'], 'Paper moon sliding in.']], ['s1-bg']);

// 2 — Terre et Lune
shot(2.0, 5.95, [bg('s2-bg', 'bg-space'),
  img('s2-earth', 'earth', 110, 960, 560, {...mv('prop', 'The paper Earth drifts slowly in the foreground'), keys: [{t: 0, x: 110, y: 960}, {t: 3.95, x: 150, y: 935}]}),
  img('s2-moon', 'moon', 830, 330, 170, {...mv('prop', 'The far Moon slowly grows as we move toward it'), keys: [{t: 0, x: 830, y: 330, w: 170}, {t: 3.95, x: 780, y: 290, w: 270}]})],
  'Earth large in the lower left, the Moon small and far in the upper right, slowly getting closer.',
  [['s2-e', 'prop', ['s2-earth'], 'Drifting Earth.'], ['s2-m', 'prop', ['s2-moon'], 'Approaching Moon.']], ['s2-bg']);

// 3 — Pete Conrad et Alan Bean
shot(5.95, 8.3, [bg('s3-bg', 'bg-moon'),
  img('s3-a1', 'astro-wave', 150, 860, 340, {...mv('actor', 'Pete Conrad pops up and waves when his name is said'), keys: pop(.3, 150, 860, 340, 120)}),
  img('s3-a2', 'astro-wave', 640, 860, 340, {...mv('actor', 'Alan Bean pops up and waves when his name is said'), from: 1.2, keys: [...pop(1.2, 640, 860, 340, 120), {t: 2.3, x: 640, y: 850, w: 340}]}),
  txt('s3-n1', 'PETE CONRAD', 110, 1500, 70, NAVY, .6),
  txt('s3-n2', 'ALAN BEAN', 640, 1500, 70, NAVY, 1.45)],
  'Two astronauts side by side on the lunar ground, each name appears under its astronaut.',
  [['s3-c1', 'actor', ['s3-a1', 's3-n1'], 'Pete Conrad and his name.'], ['s3-c2', 'actor', ['s3-a2', 's3-n2'], 'Alan Bean and his name.']], ['s3-bg']);

// 4 — Saturn V + Apollo 12
shot(8.3, 11.3, [bg('s4-bg', 'bg-space'),
  img('s4-rocket', 'saturn-v', 190, 700, 190, {...mv('prop', 'The paper Saturn V rises like a cut-out pulled upward'), keys: [{t: 0, y: 700}, {t: 2.8, y: 250}]}),
  img('s4-patch', 'patch', 560, 520, 480, {...mv('prop', 'The Apollo 12 badge is placed on the page'), from: .6, keys: [{t: .6, alpha: 0, x: 610, y: 570, w: 380}, {t: 1.0, alpha: 1, x: 560, y: 520, w: 480}, {t: 3.0, x: 556, y: 516, w: 488}]}),
  txt('s4-t', 'APOLLO 12', 540, 1100, 100, GOLD, 1.45),
  txt('s4-t2', '2e alunissage', 560, 1240, 58, CREAM, 2.1)],
  'The rocket rises on the left while the mission badge and its name build on the right.',
  [['s4-r', 'prop', ['s4-rocket'], 'Saturn V rising.'], ['s4-b', 'information', ['s4-patch', 's4-t', 's4-t2'], 'Badge, APOLLO 12 and second landing note.']], ['s4-bg']);

// 5 — Intrepid se pose (la veille) + descente de l'échelle
shot(11.3, 15.6, [bg('s5-bg', 'bg-moon'),
  img('s5-lm', 'lm', 330, 935, 640, {...mv('prop', 'The lunar module Intrepid descends and settles on the ground'), keys: [{t: 0, y: 420}, {t: 1.4, y: 940}, {t: 1.6, y: 935}, {t: 4.25, y: 935, x: 334}]}),
  img('s5-climb', 'astro-climb', 470, 1230, 170, {...mv('actor', 'An astronaut climbs down the ladder'), from: 2.6, keys: [{t: 2.6, alpha: 0, y: 1140}, {t: 2.9, alpha: 1, y: 1150}, {t: 4.2, y: 1230}]}),
  txt('s5-t', 'INTREPID', 110, 230, 100, GOLD, .3),
  txt('s5-t2', 'posé le 19 nov. 1969', 110, 365, 60, CREAM, 1.0)],
  'Name and landing date at the top; the lunar module lands in the middle, then an astronaut climbs down its ladder.',
  [['s5-h', 'information', ['s5-t', 's5-t2'], 'INTREPID and the landing date.'], ['s5-l', 'contact', ['s5-lm', 's5-climb'], 'Lander and astronaut on its ladder.']], ['s5-bg']);

// 6 — Pas seulement un drapeau
shot(15.6, 18.75, [bg('s6-bg', 'bg-moon'),
  img('s6-flag', 'flag', 200, 1080, 300, {...mv('prop', 'The paper flag is planted into the ground'), keys: [{t: .2, alpha: 0, y: 900}, {t: .6, alpha: 1, y: 1080}, {t: 3.1, y: 1080}]}),
  img('s6-a', 'astro-wave', 600, 850, 320, {...mv('actor', 'The astronaut stands next to the flag'), to: 1.9, keys: [{t: 0, y: 860}, {t: 1.0, y: 845}, {t: 1.9, y: 850}]}),
  img('s6-w', 'astro-walk1', 600, 1078, 340, {...mv('actor', 'The astronaut turns away to go to work'), from: 1.9, keys: [{t: 1.9, x: 600}, {t: 3.1, x: 740}]}),
  txt('s6-t', 'PAS SEULEMENT', 110, 230, 76, CREAM, .4),
  txt('s6-t2', 'UN DRAPEAU…', 110, 345, 100, GOLD, 1.2)],
  'The flag is planted on the left; the astronaut beside it turns and walks off to the right: the mission is more than a flag.',
  [['s6-h', 'information', ['s6-t', 's6-t2'], 'Not just a flag heading.'], ['s6-f', 'prop', ['s6-flag'], 'Planted flag.'], ['s6-c', 'actor', ['s6-a', 's6-w'], 'Astronaut standing then walking away.']], ['s6-bg']);

// 7 — Instruments (1re sortie, 19 nov.)
shot(18.75, 22.55, [bg('s7-bg', 'bg-moon'),
  img('s7-a', 'astro-kneel', 150, 900, 560, {...mv('actor', 'The kneeling astronaut sets an instrument down'), keys: [{t: 0, x: 140}, {t: 1.4, x: 165}, {t: 3.8, x: 170}]}),
  img('s7-alsep', 'alsep', 680, 1300, 420, {...mv('prop', 'The science instruments appear on the ground beside him'), from: 1.3, keys: [{t: 1.3, alpha: 0, y: 1250}, {t: 1.8, alpha: 1, y: 1300}, {t: 3.8, y: 1300, x: 676}]}),
  txt('s7-t', '19 NOV. — 1re SORTIE', 110, 230, 64, GOLD),
  txt('s7-t2', 'INSTRUMENTS', 110, 335, 100, CREAM, 1.7)],
  'Date of the first outing at the top; the astronaut kneels on the left while the instruments appear on the right.',
  [['s7-h', 'information', ['s7-t', 's7-t2'], 'First outing date and INSTRUMENTS.'], ['s7-c', 'contact', ['s7-a', 's7-alsep'], 'Astronaut installing the instruments.']], ['s7-bg']);

// 8 — Photos + roches
shot(22.55, 26.25, [bg('s8-bg', 'bg-moon'),
  img('s8-a', 'astro-camera', 130, 860, 330, {...mv('actor', 'The astronaut takes a photo'), keys: [{t: 0, y: 870}, {t: .8, y: 860}, {t: .95, y: 866}, {t: 3.65, y: 862}]}),
  img('s8-box', 'rockbox', 620, 1100, 440, {...mv('prop', 'The sample box slides in'), from: 1.5, keys: [{t: 1.5, alpha: 0, x: 760}, {t: 1.9, alpha: 1, x: 620}, {t: 3.65, x: 616}]}),
  img('s8-rocks', 'rocks', 670, 1180, 340, {...mv('prop', 'Lunar rocks drop into the box'), from: 2.3, keys: [{t: 2.3, alpha: 0, y: 880}, {t: 2.8, alpha: 1, y: 1200}, {t: 3.65, y: 1200}]}),
  txt('s8-t', 'PHOTOS', 110, 230, 100, CREAM, .75),
  txt('s8-t2', '+ ROCHES', 110, 350, 100, GOLD, 1.75)],
  'Photographer on the left; the sample box slides in on the right and rocks drop into it.',
  [['s8-h', 'information', ['s8-t', 's8-t2'], 'PHOTOS + ROCHES heading.'], ['s8-c', 'actor', ['s8-a'], 'Astronaut with camera.'], ['s8-p', 'prop', ['s8-box', 's8-rocks'], 'Box filling with rocks.']], ['s8-bg']);

// 9 — Une autre mission (20 nov.)
shot(26.25, 29.7, [bg('s9-bg', 'bg-moon'),
  img('s9-a', 'astro-walk1', 140, 950, 420, {...mv('actor', 'The astronaut sets off on the new mission'), keys: [{t: 0, x: 120, y: 955}, {t: 1.2, x: 180, y: 945}, {t: 2.4, x: 240, y: 955}, {t: 3.4, x: 290, y: 948}]}),
  txt('s9-t', '20 NOV. 1969', 110, 230, 100, GOLD, .1),
  txt('s9-t2', 'UNE AUTRE MISSION…', 110, 360, 66, CREAM, 1.0),
  txt('s9-q', '?', 820, 900, 260, GOLD, 2.1)],
  'The new date at the top, the astronaut walks forward on the left and a big question mark appears on the right.',
  [['s9-h', 'information', ['s9-t', 's9-t2', 's9-q'], 'Date, other mission and question mark.'], ['s9-c', 'actor', ['s9-a'], 'Walking astronaut.']], ['s9-bg']);

// 10 — Surveyor 3
shot(29.7, 35.8, [bg('s10-bg', 'bg-moon'),
  img('s10-s', 'surveyor', 280, 880, 640, {...mv('prop', 'The old Surveyor 3 probe is revealed and slowly approached'), keys: [{t: .4, alpha: 0, y: 960}, {t: .9, alpha: 1, y: 880}, {t: 6.0, x: 250, y: 860, w: 690}]}),
  img('s10-tag', 'tag', 900, 1240, 170, {...mv('prop', 'A paper tag with the landing year is hung by the probe'), from: 3.0, keys: [{t: 3.0, alpha: 0, y: 1190}, {t: 3.4, alpha: 1, y: 1240}, {t: 3.7, y: 1232}, {t: 4.0, y: 1240}]}),
  txt('s10-tagt', '1967', 920, 1350, 48, NAVY, 3.2),
  txt('s10-t', 'SURVEYOR 3', 110, 230, 110, GOLD, 1.7),
  txt('s10-t2', 'posée sur la Lune en 1967', 110, 370, 56, CREAM, 3.3)],
  'Probe in the center slowly approached; name then landing year in the heading and on a hanging paper tag.',
  [['s10-h', 'information', ['s10-t', 's10-t2'], 'SURVEYOR 3 and the 1967 label.'], ['s10-p', 'prop', ['s10-s'], 'Surveyor 3 probe.'], ['s10-l', 'information', ['s10-tag', 's10-tagt'], 'Hanging 1967 tag.']], ['s10-bg']);

// 11 — Marche jusqu'à la sonde, récupération de pièces, retour sur Terre
const walkSeg = [0, .35, .7, 1.05].map((t, i) => {
  const file = i % 2 ? 'astro-walk2' : 'astro-walk1', w = 300, h = Math.round(w * AR[file]), x0 = 120 + i * 70;
  return img(`s11-w${i}`, file, x0, 1480 - h, w, {...mv('actor', 'Walk cycle frame toward the probe'), from: t, to: r2(t + .35), keys: [{t, x: x0}, {t: r2(t + .34), x: x0 + 68}]});
});
shot(35.8, 41.45, [bg('s11-bg', 'bg-moon'),
  img('s11-s', 'surveyor', 720, 1080, 400, {...mv('prop', 'The probe waits on the right'), keys: [{t: 0, x: 724}, {t: 5.6, x: 716}]}),
  ...walkSeg,
  img('s11-r', 'astro-reach', 400, 1052, 380, {...mv('actor', 'The astronaut reaches into the probe to remove parts'), from: 1.4, keys: [{t: 1.4, x: 400}, {t: 2.0, x: 425}, {t: 2.4, x: 410}, {t: 2.9, x: 430}, {t: 3.4, x: 412}, {t: 5.6, x: 418}]}),
  {type: 'arrow', id: 's11-arrow', x: 640, y: 1000, w: 664, angle: -.924, lineWidth: 6, color: GOLD, ...mv('information', 'Arrow from the probe parts up to Earth'), from: 3.9, keys: [{t: 3.9, progress: 0}, {t: 4.6, progress: 1}]},
  txt('s11-t', 'SUR TERRE', 820, 790, 54, GOLD, 4.3),
  txt('s11-h', 'DES PIÈCES', 110, 230, 90, CREAM, 1.5)],
  'The astronaut walks to the probe on the right, reaches into it, then an arrow carries the parts up to Earth in the sky.',
  [['s11-h1', 'information', ['s11-h'], 'Parts heading.'], ['s11-c', 'contact', ['s11-s', 's11-w0', 's11-w1', 's11-w2', 's11-w3', 's11-r'], 'Walk to the probe and reach into it.'], ['s11-d', 'information', ['s11-arrow', 's11-t'], 'Arrow to Earth with label.']], ['s11-bg']);

// 12 — Imagine la scène : faible gravité
const hop = []; for (let i = 0; i <= 17; i++) { const t = r2(i * .5); hop.push({t, x: r2(140 + i * 36), y: i % 4 === 2 ? 800 : i % 4 === 0 ? 1020 : 880}); }
hop[hop.length - 1].t = 8.45;
shot(41.45, 49.95, [bg('s12-bg', 'bg-moon'),
  img('s12-j', 'astro-jump', 140, 1020, 300, {...mv('actor', 'The astronaut bounds slowly in low gravity'), keys: hop}),
  img('s12-b', 'astro-walk1', 100, 1180, 220, {...mv('actor', 'The second astronaut follows behind'), keys: [{t: 0, x: 80, y: 1188}, {t: 2, x: 140, y: 1180}, {t: 4, x: 200, y: 1188}, {t: 6, x: 260, y: 1180}, {t: 8.45, x: 330, y: 1188}]}),
  txt('s12-t', 'IMAGINE LA SCÈNE', 110, 230, 80, CREAM, .1),
  txt('s12-t2', 'GRAVITÉ ÷ 6', 110, 350, 100, GOLD, 5.5)],
  'One astronaut bounds across the ground in slow hops while the other follows; the gravity fact appears in the heading.',
  [['s12-h', 'information', ['s12-t', 's12-t2'], 'Imagine heading then gravity divided by six.'], ['s12-c', 'actor', ['s12-j', 's12-b'], 'Hopping astronaut and follower.']], ['s12-bg']);

// 13 — Richard Gordon en orbite
const orbit = []; for (let i = 0; i <= 18; i++) { const t = r2(i * .25), th = Math.PI + Math.PI * i / 18.6; orbit.push({t, x: r2(640 + 330 * Math.cos(th) - 140), y: r2(1010 + 170 * Math.sin(th) - 68)}); }
shot(49.95, 54.6, [bg('s13-bg', 'bg-space'),
  img('s13-moon', 'moon', 330, 700, 620, {...mv('prop', 'The Moon turns slowly'), keys: spinKeys(640, 1013, 620, 626, 0, .3, 0, 4.5)}),
  img('s13-csm', 'csm', 80, 940, 280, {...mv('prop', 'The command module orbits above the Moon'), keys: orbit}),
  txt('s13-t', 'RICHARD GORDON', 110, 230, 84, GOLD, .9),
  txt('s13-t2', 'en orbite autour de la Lune', 110, 345, 54, CREAM, 2.1)],
  'The Moon turns in the center while the command module with Richard Gordon flies around it; his name at the top.',
  [['s13-h', 'information', ['s13-t', 's13-t2'], 'Richard Gordon in orbit.'], ['s13-o', 'prop', ['s13-moon', 's13-csm'], 'Rotating Moon and orbiting module.']], ['s13-bg']);

// 14 — Plan : précision de l'alunissage
shot(54.6, 59.1, [bg('s14-bg', 'bg-map'),
  img('s14-lm', 'lm', 300, 860, 260, {...mv('prop', 'The lander is placed on the map'), keys: [{t: 0, alpha: 0, y: 820}, {t: .4, alpha: 1, y: 860}, {t: 4.5, x: 296, y: 862}]}),
  img('s14-s', 'surveyor', 760, 1000, 240, {...mv('prop', 'The probe is placed on the map'), keys: [{t: .3, alpha: 0, y: 960}, {t: .7, alpha: 1, y: 1000}, {t: 2.4, x: 764}, {t: 4.5, x: 770, y: 996}]}),
  ...dashes('s14-d', 440, 1000, 860, 1110, 7, .9, .14, NAVY),
  txt('s14-m', '≈ 180 m', 520, 1150, 64, NAVY, 2.0),
  txt('s14-t', 'PRÉCISION', 300, 380, 100, RED, 2.55)],
  'A notebook map: lander on the left, probe on the right, joined by a dotted line with the distance; PRECISION written on the page.',
  [['s14-h', 'information', ['s14-t'], 'Precision heading.'], ['s14-map', 'information', ['s14-lm', 's14-s', 's14-d0', 's14-d1', 's14-d2', 's14-d3', 's14-d4', 's14-d5', 's14-d6', 's14-m'], 'Map with dotted link and distance.']], ['s14-bg']);

// 15 — Fin : 20 novembre 1969, deux hommes marchent sur la Lune
shot(54.6 + 4.5, 67.6, [bg('s15-bg', 'bg-space'),
  img('s15-earth', 'earth', 110, 1180, 380, {...mv('prop', 'Earth drifts in the lower left'), keys: [{t: 0, x: 110, y: 1180}, {t: 8.4, x: 140, y: 1160}]}),
  img('s15-moon', 'moon', 800, 660, 260, {...mv('prop', 'The Moon drifts in the upper right'), keys: [{t: 0, x: 800, y: 660}, {t: 8.4, x: 780, y: 680}]}),
  img('s15-astro', 'astro-wave', 895, 535, 70, {...mv('actor', 'A tiny astronaut stands on the Moon'), keys: [{t: 0, x: 895, y: 535}, {t: 8.4, x: 875, y: 555}]}),
  ...dashes('s15-d', 420, 1200, 840, 900, 8, 5.0, .12, CREAM),
  txt('s15-t', '20 novembre 1969', 110, 240, 84, GOLD, .1),
  txt('s15-t2', 'Deux hommes marchent', 110, 375, 70, CREAM, 1.8),
  txt('s15-t3', 'sur la Lune', 110, 465, 70, CREAM, 2.2),
  txt('s15-km', '≈ 384 000 km', 130, 820, 64, GOLD, 5.6)],
  'Earth and Moon on a diagonal; a dotted line joins them with the distance; the closing date and sentence at the top.',
  [['s15-h', 'information', ['s15-t', 's15-t2', 's15-t3'], 'Closing date and sentence.'], ['s15-sky', 'prop', ['s15-earth', 's15-moon', 's15-astro'], 'Earth, Moon and the tiny astronaut.'], ['s15-line', 'information', ['s15-d0', 's15-d1', 's15-d2', 's15-d3', 's15-d4', 's15-d5', 's15-d6', 's15-d7', 's15-km'], 'Dotted line and distance.']], ['s15-bg']);

// 16 — Question
const hop2 = []; for (let i = 0; i <= 9; i++) hop2.push({t: r2(Math.min(i * .53, 4.75)), y: i % 2 ? 960 : 1100});
shot(67.6, 72.4, [bg('s16-bg', 'bg-title'),
  img('s16-j', 'astro-jump', 470, 1100, 340, {...mv('actor', 'The astronaut hops happily, inviting the viewer'), keys: hop2}),
  txt('s16-t', 'ET TOI ?', 300, 300, 150, NAVY, .6),
  txt('s16-t2', 'tu serais capable', 180, 520, 70, NAVY, 1.4),
  txt('s16-t3', 'de marcher sur la Lune ?', 180, 615, 70, RED, 2.0)],
  'The question builds at the top while the astronaut hops below.',
  [['s16-h', 'information', ['s16-t', 's16-t2', 's16-t3'], 'The final question.'], ['s16-c', 'actor', ['s16-j'], 'Hopping astronaut.']], ['s16-bg']);

// 17 — Sources
shot(72.4, END, [bg('s17-bg', 'bg-title'),
  txt('s17-t', 'Sources : NASA', 220, 470, 90, NAVY),
  txt('s17-1', 'NASA, Apollo 12 Mission', 160, 660, 46, NAVY),
  txt('s17-2', 'NASA Science, Apollo 12 Mission Image', 160, 740, 46, NAVY),
  txt('s17-3', 'NASA, Apollo 12 Timeline', 160, 820, 46, NAVY),
  txt('s17-4', 'Musique : « Morning », Kevin MacLeod (CC BY 4.0)', 160, 960, 38, NAVY),
  img('s17-p', 'patch', 520, 1150, 240, {...mv('prop', 'The mission badge settles on the page'), keys: [{t: 0, alpha: 0, y: 1200}, {t: .5, alpha: 1, y: 1150}, {t: r2(END - 72.4 - .05), y: 1140}]})],
  'Sources page with the mission badge.',
  [['s17-h', 'information', ['s17-t', 's17-1', 's17-2', 's17-3', 's17-4'], 'Source list and music credit.'], ['s17-b', 'prop', ['s17-p'], 'Mission badge.']], ['s17-bg']);

// Régions : boîtes englobantes à travers les clés, bornées à la zone sûre.
function bounds(l) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const add = (a, b, c, d) => { x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); };
  for (const k of [{}, ...(l.keys || [])].map(k => ({...l, ...k}))) {
    if (l.type === 'image') { const h = l.h / l.w * k.w, a = k.angle || 0, R = Math.hypot(k.w, h); if (a) add(k.x - R * .5, k.y - R * .5, k.x + R, k.y + R); else add(k.x, k.y, k.x + k.w, k.y + h); }
    else if (l.type === 'text') add(k.x - 10, k.y - l.size * .35, k.x + l.text.length * l.size * .8, k.y + l.size * 1.4);
    else if (l.type === 'arrow') { const ex = k.x + Math.cos(k.angle || 0) * k.w, ey = k.y + Math.sin(k.angle || 0) * k.w; add(Math.min(k.x, ex) - 40, Math.min(k.y, ey) - 40, Math.max(k.x, ex) + 40, Math.max(k.y, ey) + 40); }
    else if (l.type === 'line') for (const [px, py] of l.points) add(px - 10, py - 10, px + 10, py + 10);
  }
  return {x0, y0, x1, y1};
}
for (const s of S) for (const r of s.portrait.regions) {
  const b = r.layer_ids.map(id => { const l = s.layers.find(l => l.id === id); if (!l) throw new Error('layer ' + id); return bounds(l); })
    .reduce((a, c) => ({x0: Math.min(a.x0, c.x0), y0: Math.min(a.y0, c.y0), x1: Math.max(a.x1, c.x1), y1: Math.max(a.y1, c.y1)}));
  const x = Math.max(SAFE.x0, b.x0 - 8), y = Math.max(SAFE.y0, b.y0 - 8), x1 = Math.min(SAFE.x1, b.x1 + 8), y1 = Math.min(SAFE.y1, b.y1 + 8);
  r.region = {x: Math.ceil(x), y: Math.ceil(y), w: Math.floor(x1) - Math.ceil(x), h: Math.floor(y1) - Math.ceil(y)};
}
S.forEach((s, i) => { s.start = r2(s.start); s.end = r2(s.end); if (i && Math.abs(S[i - 1].end - s.start) > 1e-9) throw new Error('trou entre plans ' + i); });

// Sous-titres : mots du script, temps de whisper, groupes courts (une ligne).
const words = JSON.parse(fs.readFileSync(DIR + 'audio/words.json', 'utf8')).filter(w => !['?', ':'].includes(w[0]));
const script = fs.readFileSync(DIR + 'script.txt', 'utf8').split(/\s+/).filter(Boolean);
const tok = script.filter(t => !['?', ':'].includes(t));
if (tok.length !== words.length) throw new Error('alignement');
const phrases = fs.readFileSync(DIR + 'captions.txt', 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
const out = []; let wi = 0;
for (const ph of phrases) {
  const n = ph.split(/\s+/).filter(t => !['?', ':'].includes(t)).length;
  if (ph.split(/\s+/).filter(t => !['?', ':'].includes(t)).join(' ') !== tok.slice(wi, wi + n).join(' ')) throw new Error('phrase mismatch: ' + ph + ' / ' + tok.slice(wi, wi + n).join(' '));
  out.push({start: r2(words[wi][1] + LEAD), end: r2(words[wi + n - 1][2] + LEAD), text: ph}); wi += n;
}
if (wi !== tok.length) throw new Error('phrases incomplètes');
for (let i = 0; i + 1 < out.length; i++) if (out[i + 1].start - out[i].start < .6) out[i + 1].start = r2(out[i].start + .6);
for (const c of out) if (c.end < c.start + .5) c.end = r2(c.start + .5);
for (let i = 0; i < out.length; i++) { const next = out[i + 1]; out[i].end = r2(next ? Math.min(next.start, Math.max(out[i].end + .35, out[i].start + .7)) : out[i].end + .5); }
for (let i = 0; i + 1 < out.length; i++) if (out[i].end > out[i + 1].start) out[i].end = out[i + 1].start;

const f = p => `${LIB}/${p}`;
const sfx = [
  [.1, 'owlish-home-202/Paper & Stationery/Stationery_05.wav', .25], [.95, 'owlish-home-202/Paper & Stationery/Stationery_12.wav', .2],
  [2.05, 'artisticdude-swishes/swish-3.wav', .08], [6.25, 'owlish-home-202/Paper & Stationery/Stationery_20.wav', .2], [7.15, 'owlish-home-202/Paper & Stationery/Stationery_20.wav', .2],
  [8.35, 'artisticdude-swishes/swish-10.wav', .12], [8.95, 'owlish-home-202/Paper & Stationery/Stationery_05.wav', .2],
  [11.35, 'artisticdude-swishes/swish-1.wav', .1], [12.7, 'kenney-impact/impactGeneric_light_002.ogg', .35], [14.1, 'kenney-impact/footstep_concrete_001.ogg', .3], [14.9, 'kenney-impact/footstep_concrete_003.ogg', .3],
  [16.15, 'kenney-impact/impactPlank_medium_001.ogg', .25], [17.6, 'kenney-impact/footstep_concrete_000.ogg', .25],
  [20.1, 'kenney-impact/impactMetal_light_001.ogg', .2], [23.38, 'owlish-home-202/Camera/Camera_01.wav', .35], [24.15, 'artisticdude-swishes/swish-3.wav', .08], [25.1, 'kenney-impact/impactMining_001.ogg', .2],
  [28.4, 'owlish-home-202/Paper & Stationery/Stationery_12.wav', .2], [30.2, 'artisticdude-swishes/swish-10.wav', .1], [32.8, 'owlish-home-202/Paper & Stationery/Stationery_30.wav', .2],
  [35.85, 'kenney-impact/footstep_concrete_000.ogg', .25], [36.2, 'kenney-impact/footstep_concrete_002.ogg', .25], [36.55, 'kenney-impact/footstep_concrete_004.ogg', .25], [36.9, 'kenney-impact/footstep_concrete_001.ogg', .25],
  [37.4, 'kenney-impact/impactMetal_light_003.ogg', .2], [38.4, 'kenney-impact/impactMetal_light_000.ogg', .18], [39.75, 'artisticdude-swishes/swish-3.wav', .1],
  [42.45, 'kenney-impact/footstep_concrete_002.ogg', .2], [44.45, 'kenney-impact/footstep_concrete_000.ogg', .2], [46.45, 'kenney-impact/footstep_concrete_003.ogg', .2], [48.45, 'kenney-impact/footstep_concrete_001.ogg', .2],
  [50.0, 'artisticdude-swishes/swish-1.wav', .1], [54.7, 'owlish-home-202/Paper & Stationery/Stationery_20.wav', .2], [57.2, 'kenney-interface/confirmation_001.ogg', .12],
  [59.2, 'owlish-home-202/Paper & Stationery/Stationery_05.wav', .2], [64.1, 'artisticdude-swishes/swish-3.wav', .08],
  [68.3, 'owlish-home-202/Paper & Stationery/Stationery_12.wav', .2], [72.5, 'owlish-home-202/Paper & Stationery/Stationery_05.wav', .2]
].map(([time, p, gain]) => ({kind: 'file', path: f(p), time, gain}));

const project = {
  version: 1, style: 'B2', width: 1080, height: 1920, fps: 30,
  font: 'fonts/Chalkboard-local.ttf',
  voice: {path: 'narration.wav', lead: LEAD, tail: TAIL},
  captions: out, shots: S, sfx,
  // musique ajoutée après assemblage des deux parties (voir assemble.sh)
  ambience: [{path: 'audio/space-bed.wav', start: 0, end: r2(END - .001), gain: .04}],
  reference_review: {author_id: 'claude-opus-5-5', capability: {mode: 'sample_target', environment: 'Claude Code desktop on macOS, Gemini image + TTS, local renderer', limitations: []}}
};
fs.writeFileSync(DIR + 'project.json', JSON.stringify(project, null, 2));
console.log('ok', S.length, 'plans,', out.length, 'sous-titres, durée', END);
