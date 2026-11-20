// Construit project.json (B2, 9:16, 1080x1920) pour « 20 novembre 1945 — Procès de Nuremberg ».
// Temps vidéo = temps de la voix + LEAD. Coordonnées : plan de 1280 × 2275,56.
import fs from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname;
const LEAD = 0.15, TAIL = 3.0, VOICE = 81.68, END = +(LEAD + VOICE + TAIL).toFixed(3);
const LIB = process.env.HOME + '/.claude/skills/directing-stickman-videos/assets/b-audio-library/audio';
const AR = {bg: 1.792, 'accused-row': .490, 'accused-one': 1.318, judges: .513, prosecutor: 1.748, gavel: .960, typewriter: 1.015, 'film-reel': .999,
  projector: 1.125, folders: 1.167, document: 1.348, stamp: 1.206, 'flag-us': .710, 'flag-uk': .681, 'flag-fr': .739, 'flag-ussr': .714, scales: .967, globe: 1.338, torn: .928, strip: .25};
const BEIGE = '#ecdfc3', RED = '#b8261d', INK = '#1d1a17';
const SAFE = {x0: 1280 * .06, x1: 1280 * .88, y0: 2275.56 * .08, y1: 1669};
const r2 = n => Math.round(n * 1000) / 1000;
const fit = (text, size) => Math.min(size, Math.floor(980 / (text.length * .66)));
const img = (id, file, x, y, w, extra = {}) => ({type: 'image', id, path: `art/${file}.png`, x, y, w, h: Math.round(w * AR[file.startsWith('bg-') ? 'bg' : file]), ...extra});
const bg = (id, file) => img(id, file, 0, 0, 1280);
const txt = (id, text, x, y, size, color, from = 0, extra = {}) => { size = fit(text, size); return {type: 'text', id, text, x, y, size, color, w: 1100,
  ...(from ? {from, keys: [{t: from, alpha: .35, y: y + 30}, {t: r2(from + .18), alpha: 1, y}]} : {}), ...extra}; };
const mv = (role, reason) => ({motion: {role, reason}});
// Objet « posé brutalement » : arrive plus grand et s'écrase à sa taille.
const slam = (t, x, y, w, k = 1.35) => [{t, alpha: .4, x: r2(x - w * (k - 1) / 2), y: r2(y - w * (k - 1) / 2), w: r2(w * k)}, {t: r2(t + .16), alpha: 1, x, y, w}, {t: r2(t + .22), x, y: y + 4, w}, {t: r2(t + .3), x, y, w}];
const drift = (t0, t1, x, y, w, dx = 20, dy = -10, dw = 30) => [{t: t0, x, y, w}, {t: r2(t1), x: x + dx, y: y + dy, w: w + dw}];
function spinKeys(cx, cy, w, h, a0, a1, t0, t1, step = .25) { const ks = [];
  for (let t = t0; t <= t1 + 1e-6; t += step) { const a = a0 + (a1 - a0) * (t - t0) / (t1 - t0);
    ks.push({t: r2(t), angle: r2(a), x: r2(cx - (Math.cos(a) * w / 2 - Math.sin(a) * h / 2)), y: r2(cy - (Math.sin(a) * w / 2 + Math.cos(a) * h / 2))}); }
  return ks; }
// Tampon rouge : la marque s'écrase, le mot apparaît à l'impact.
const stamp = (id, word, t, cx, cy, w = 620) => { const h = Math.round(w * AR.stamp), x = r2(cx - w / 2), y = r2(cy - h * .57);
  const size = Math.min(112, Math.floor(w * .8 / (word.length * .68))); return [img(id, 'stamp', x, y, w, {...mv('prop', `Red stamp ${word} slams down`), from: t, keys: slam(t, x, y, w, 1.5)}),
    {type: 'text', id: id + '-t', text: word, x: r2(cx - word.length * size * .33), y: r2(cy - size * .55), size, color: RED, w: 1100, from: r2(t + .15)}]; };

const S = [];
const shot = (start, end, layers, intent, groups, bgIds) => S.push({start, end, layers, portrait: {intent, background_ids: bgIds, regions: groups.map(([id, role, ids, why]) => ({id, role, layer_ids: ids, intent: why.length < 24 ? `${why} Shown as the ${role} focus of this shot.` : why}))}});
const bgId = n => [`s${n}-bg`];

// 1 — Impact sur la date
shot(0, 1.25, [bg('s1-bg', 'bg-dark'),
  img('s1-p', 'torn', 220, 600, 820, {...mv('prop', 'A torn newspaper sheet slams onto the dark page'), keys: slam(0, 220, 600, 820, 1.2)}),
  txt('s1-a', '20 NOVEMBRE', 210, 840, 130, RED), txt('s1-b', '1945', 330, 990, 230, INK)],
  'The date hits the screen on a torn newspaper sheet.', [['s1-d', 'information', ['s1-p', 's1-a', 's1-b'], 'Date on the torn sheet.']], bgId(1));
// 2 — Pour la première fois (des morceaux de papier tombent)
shot(1.25, 3.3, [bg('s2-bg', 'bg-court'),
  ...[0, 1, 2].map(i => img(`s2-t${i}`, 'torn', [-60, 480, 160][i], [180, 420, 1050][i], 900, {keys: [{t: 0, y: [180, 420, 1050][i]}, {t: r2(.7 + i * .25), y: [180, 420, 1050][i]}, {t: r2(1.4 + i * .25), y: 2600, x: [-60, 480, 160][i] + 60}]})),
  txt('s2-a', 'POUR LA', 110, 260, 110, BEIGE, .15), txt('s2-b', 'PREMIÈRE FOIS', 110, 390, 120, RED, .5),
  img('s2-g', 'gavel', 860, 1300, 220, {...mv('prop', 'The judge gavel appears as the courtroom is revealed'), from: 1.2, keys: slam(1.2, 860, 1300, 220)})],
  'Torn paper pieces fall away to reveal the courtroom, with the words FOR THE FIRST TIME.',
  [['s2-h', 'information', ['s2-a', 's2-b'], 'First time heading.'], ['s2-gv', 'prop', ['s2-g'], 'Gavel.']], ['s2-bg', 's2-t0', 's2-t1', 's2-t2']);
// 3 — Des dirigeants jugés
shot(3.3, 5.9, [bg('s3-bg', 'bg-court'),
  img('s3-acc', 'accused-row', 110, 1060, 620, {...mv('actor', 'The accused appear in the dock'), keys: [{t: 0, alpha: .3, x: 110, y: 1100}, {t: .3, alpha: 1, y: 1060}, {t: 2.6, x: 140, y: 1056}]}),
  txt('s3-a', 'DES DIRIGEANTS', 110, 260, 100, BEIGE, .15),
  ...stamp('s3-st', 'JUGÉS', 1.4, 800, 820, 400)],
  'The accused appear in the dock while the red stamp JUGÉS hits on the word judged.',
  [['s3-h', 'information', ['s3-a'], 'Leaders heading.'], ['s3-c', 'actor', ['s3-acc'], 'Accused in the dock.'], ['s3-s', 'information', ['s3-st', 's3-st-t'], 'JUGÉS stamp.']], bgId(3));
// 4 — Crimes de leur propre gouvernement
shot(5.9, 7.9, [bg('s4-bg', 'bg-desk'),
  img('s4-doc', 'document', 340, 620, 600, {...mv('prop', 'A government document is slammed on the table'), keys: [...slam(.1, 340, 620, 600), {t: 1.95, x: 346, y: 624, w: 600}]}),
  txt('s4-a', 'LEUR PROPRE', 110, 240, 100, INK, .2), txt('s4-b', 'GOUVERNEMENT', 110, 370, 110, RED, .8)],
  'A document slams onto the table under the words their own government.',
  [['s4-h', 'information', ['s4-a', 's4-b'], 'Own government heading.'], ['s4-p', 'prop', ['s4-doc'], 'Document.']], bgId(4));
// 5 — Nuremberg
shot(7.9, 10.0, [bg('s5-bg', 'bg-building'),
  txt('s5-a', 'NUREMBERG', 110, 330, 130, RED, .6), txt('s5-b', 'Allemagne', 110, 490, 70, BEIGE, 1.3),
  img('s5-p', 'folders', 880, 1350, 200, {...mv('prop', 'Case files arrive at the courthouse'), keys: [{t: 0, x: 920, alpha: .3}, {t: .5, x: 880, alpha: 1}, {t: 2.05, x: 870}]})],
  'The courthouse in Nuremberg with the city name, case files arriving.',
  [['s5-h', 'information', ['s5-a', 's5-b'], 'City name.'], ['s5-f', 'prop', ['s5-p'], 'Case files.']], bgId(5));
// 6 — Tribunal militaire international
shot(10.0, 12.0, [bg('s6-bg', 'bg-court'),
  img('s6-j', 'judges', 330, 700, 620, {...mv('actor', 'The judges take their seats at the bench'), keys: [{t: 0, alpha: .3, y: 740}, {t: .35, alpha: 1, y: 700}, {t: 1.95, y: 696, x: 336}]}),
  txt('s6-a', 'TRIBUNAL MILITAIRE', 110, 250, 80, BEIGE, .1), txt('s6-b', 'INTERNATIONAL', 110, 350, 90, RED, .4)],
  'The judges take the bench under the court name.',
  [['s6-h', 'information', ['s6-a', 's6-b'], 'International Military Tribunal.'], ['s6-c', 'actor', ['s6-j'], 'Judges.']], bgId(6));
// 7 — Après la Seconde Guerre mondiale
shot(12.0, 14.3, [bg('s7-bg', 'bg-desk'),
  img('s7-g', 'gavel', 380, 760, 520, {...mv('prop', 'The gavel strikes to open the trial'), keys: [...slam(.1, 380, 760, 520), {t: 1.2, x: 380, y: 740, w: 520}, {t: 1.4, x: 380, y: 760, w: 520}, {t: 2.25, x: 386, y: 764, w: 520}]}),
  txt('s7-a', 'APRÈS LA', 110, 240, 90, INK, .2), txt('s7-b', 'SECONDE GUERRE', 110, 350, 100, RED, .9), txt('s7-c', 'MONDIALE', 110, 465, 100, RED, 1.0)],
  'The gavel strikes on the table: the trial opens after the Second World War.',
  [['s7-h', 'information', ['s7-a', 's7-b', 's7-c'], 'After WWII heading.'], ['s7-p', 'prop', ['s7-g'], 'Gavel.']], bgId(7));
// 8 — Le banc des accusés
shot(14.3, 16.9, [bg('s8-bg', 'bg-dark'),
  img('s8-acc', 'accused-row', 120, 900, 860, {...mv('actor', 'The camera moves along the dock of the accused'), keys: [{t: 0, x: 200, y: 910, w: 820}, {t: 2.6, x: 110, y: 890, w: 880}]}),
  txt('s8-a', 'LE BANC', 110, 260, 110, BEIGE, .1), txt('s8-b', 'DES ACCUSÉS', 110, 390, 110, BEIGE, .4)],
  'Wide view of the accused in silhouette, the camera moving along them.',
  [['s8-h', 'information', ['s8-a', 's8-b'], 'Dock heading.'], ['s8-c', 'actor', ['s8-acc'], 'Accused row.']], bgId(8));
// 9 — Hauts responsables du régime nazi
shot(16.9, 19.3, [bg('s9-bg', 'bg-dark'),
  img('s9-one', 'accused-one', 330, 760, 620, {...mv('actor', 'Close-up on one faceless accused silhouette'), keys: [{t: 0, x: 360, y: 790, w: 560}, {t: 2.4, x: 320, y: 750, w: 640}]}),
  txt('s9-a', 'HAUTS', 110, 250, 100, BEIGE, .05), txt('s9-b', 'RESPONSABLES', 110, 370, 110, RED, .1)],
  'Slow push-in on one anonymous silhouette of the accused.',
  [['s9-h', 'information', ['s9-a', 's9-b'], 'Senior officials.'], ['s9-c', 'actor', ['s9-one'], 'Accused silhouette.']], bgId(9));
// 10 — Crimes contre la paix
shot(19.3, 21.1, [bg('s10-bg', 'bg-desk'),
  img('s10-doc', 'document', 380, 760, 520, {...mv('prop', 'First charge document slammed down'), keys: [...slam(.05, 380, 760, 520), {t: 1.75, x: 384, y: 764, w: 520}]}),
  txt('s10-a', 'CRIMES', 110, 250, 110, INK, .1), txt('s10-b', 'CONTRE LA PAIX', 110, 380, 110, INK, .3)],
  'First charge: a document slams down with CRIMES AGAINST PEACE.',
  [['s10-h', 'information', ['s10-a', 's10-b'], 'Crimes against peace.'], ['s10-p', 'prop', ['s10-doc'], 'Charge document.']], bgId(10));
// 11 — Crimes de guerre
shot(21.1, 22.9, [bg('s11-bg', 'bg-desk'),
  img('s11-doc', 'document', 200, 820, 480, {...mv('prop', 'Second charge document slammed down'), keys: slam(.05, 200, 820, 480)}),
  img('s11-doc2', 'document', 590, 900, 440, {...mv('prop', 'Another document lands beside it'), from: .5, keys: slam(.5, 590, 900, 440)}),
  txt('s11-a', 'CRIMES', 110, 230, 140, RED, .05), txt('s11-b', 'DE GUERRE', 110, 390, 150, RED, .2)],
  'Second charge: CRIMES DE GUERRE in large red letters with documents piling up.',
  [['s11-h', 'information', ['s11-a', 's11-b'], 'War crimes.'], ['s11-p', 'prop', ['s11-doc', 's11-doc2'], 'Documents.']], bgId(11));
// 12 — Crimes contre l'humanité
shot(22.9, 25.0, [bg('s12-bg', 'bg-dark'),
  img('s12-f', 'folders', 420, 1000, 440, {...mv('prop', 'The stack of case files rises from below'), keys: [{t: 0, y: 1140, alpha: .3}, {t: .4, y: 1000, alpha: 1}, {t: 2.05, y: 990}]}),
  txt('s12-a', 'CRIMES CONTRE', 110, 250, 110, BEIGE, .05), txt('s12-b', "L'HUMANITÉ", 110, 390, 150, RED, .2)],
  'Third charge: CRIMES CONTRE L’HUMANITÉ above a rising stack of case files.',
  [['s12-h', 'information', ['s12-a', 's12-b'], 'Crimes against humanity.'], ['s12-p', 'prop', ['s12-f'], 'Case files.']], bgId(12));
// 13 — Un enjeu inédit
shot(25.0, 27.4, [bg('s13-bg', 'bg-court'),
  img('s13-s', 'scales', 390, 760, 500, {...mv('prop', 'The scales of justice appear and tip slightly'), keys: spinKeys(640, 1002, 500, 484, -.06, .05, 0, 2.4, .3)}),
  txt('s13-a', 'UN ENJEU', 110, 250, 110, BEIGE, .1), txt('s13-b', 'INÉDIT', 110, 380, 140, RED, .95)],
  'The scales of justice in the courtroom: an unprecedented stake.',
  [['s13-h', 'information', ['s13-a', 's13-b'], 'Unprecedented stake.'], ['s13-p', 'prop', ['s13-s'], 'Scales.']], bgId(13));
// 14 — Obéir aux ordres ?
shot(27.4, 31.5, [bg('s14-bg', 'bg-dark'),
  img('s14-one', 'accused-one', 110, 900, 420, {...mv('actor', 'An accused silhouette faces the order'), keys: [{t: 0, x: 90}, {t: 4.05, x: 130}]}),
  img('s14-doc', 'document', 720, 880, 380, {...mv('prop', 'An order sheet slides toward the accused'), keys: [{t: 0, x: 740, alpha: .3}, {t: .6, x: 700, alpha: 1}, {t: 2.4, x: 640}, {t: 4.05, x: 620}]}),
  txt('s14-l', 'ORDRE', 760, 1400, 70, BEIGE, .6),
  txt('s14-a', 'OBÉIR', 110, 250, 120, BEIGE, 1.8), txt('s14-b', 'AUX ORDRES…', 110, 390, 110, BEIGE, 2.9), txt('s14-c', 'UNE EXCUSE ?', 110, 560, 90, RED, 3.4)],
  'An order sheet slides toward an accused silhouette; the heading asks whether obeying orders is an excuse.',
  [['s14-h', 'information', ['s14-a', 's14-b', 's14-c'], 'Obeying orders question.'], ['s14-c1', 'actor', ['s14-one'], 'Accused.'], ['s14-p', 'prop', ['s14-doc', 's14-l'], 'Order sheet.']], bgId(14));
// 15 — Responsabilité personnelle
shot(31.5, 34.7, [bg('s15-bg', 'bg-dark'),
  img('s15-one', 'accused-one', 380, 820, 520, {...mv('actor', 'The single accused silhouette under scrutiny'), keys: [{t: 0, x: 400, y: 840, w: 480}, {t: 3.15, x: 370, y: 810, w: 540}]}),
  txt('s15-a', 'RESPONSABILITÉ', 110, 250, 110, BEIGE, 1.3), txt('s15-b', 'PERSONNELLE', 110, 380, 120, RED, 2.0),
  ...stamp('s15-st', 'RESPONSABLE', 1.4, 640, 1100, 600)],
  'The red stamp RESPONSABLE hits over one accused silhouette as personal responsibility is said.',
  [['s15-h', 'information', ['s15-a', 's15-b'], 'Personal responsibility.'], ['s15-c', 'actor', ['s15-one'], 'Accused.'], ['s15-s', 'information', ['s15-st', 's15-st-t'], 'Stamp RESPONSABLE.']], bgId(15));
// 16 — Juges et procureurs
shot(34.7, 37.4, [bg('s16-bg', 'bg-court'),
  img('s16-j', 'judges', 330, 700, 620, {...mv('actor', 'The judges at the bench'), keys: [{t: 0, x: 340}, {t: 2.65, x: 320}]}),
  img('s16-p', 'prosecutor', 760, 1080, 300, {...mv('actor', 'A prosecutor steps to the lectern'), from: .9, keys: [{t: .9, alpha: .3, x: 820}, {t: 1.3, alpha: 1, x: 760}, {t: 2.65, x: 750}]}),
  txt('s16-a', 'JUGES', 110, 250, 110, BEIGE, .5), txt('s16-b', '+ PROCUREURS', 110, 380, 100, RED, 1.25)],
  'Camera moves to the judges then a prosecutor steps in.',
  [['s16-h', 'information', ['s16-a', 's16-b'], 'Judges and prosecutors.'], ['s16-c', 'actor', ['s16-j', 's16-p'], 'Judges and prosecutor.']], bgId(16));
// 17 — Quatre pays
const fl = [['flag-us', 150, 640, 38.23], ['flag-uk', 650, 640, 38.88], ['flag-fr', 150, 1010, 39.87], ['flag-ussr', 650, 1010, 40.56]];
const flagLabels = ['ÉTATS-UNIS', 'ROYAUME-UNI', 'FRANCE', 'URSS'];
shot(37.4, 42.6, [bg('s17-bg', 'bg-dark'),
  ...fl.map(([f, x, y, t], i) => { const s = r2(t + LEAD - 37.4 - .1), fx = i % 2 ? x + 500 : x - 500, w = 470;
    return img(`s17-f${i}`, f, x, y, w, {...mv('prop', `${flagLabels[i]} paper flag slides in to join the others`), from: s, keys: [{t: s, x, y: y - 140, alpha: .3}, {t: r2(s + .3), x, y, alpha: 1}, {t: 5.15, x: i % 2 ? x - 12 : x + 12, y}]}); }),
  ...fl.map(([f, x, y, t], i) => txt(`s17-l${i}`, flagLabels[i], x + 10, y + 340, 52, BEIGE, r2(t + LEAD - 37.4 + .1))),
  txt('s17-a', '4 PAYS', 110, 250, 130, RED, 4.1)],
  'The four Allied flags arrive one by one on their names and join as a block; 4 PAYS at the end.',
  [['s17-h', 'information', ['s17-a'], 'Four countries.'], ['s17-fl', 'prop', ['s17-f0', 's17-f1', 's17-f2', 's17-f3', 's17-l0', 's17-l1', 's17-l2', 's17-l3'], 'Four flags with names.']], bgId(17));
// 18 — Plusieurs mois
shot(42.6, 45.0, [bg('s18-bg', 'bg-desk'),
  img('s18-tw', 'typewriter', 300, 720, 680, {...mv('prop', 'The typewriter shakes as it types the record'), keys: Array.from({length: 13}, (_, i) => ({t: r2(i * .19), x: 300 + (i % 2 ? 5 : -4), y: 720 + (i % 3 ? 2 : -3)}))}),
  txt('s18-a', 'PLUSIEURS MOIS', 110, 250, 110, INK, .1), txt('s18-b', '1945 – 1946', 110, 390, 110, RED, .6)],
  'A typewriter records the hearings, spanning 1945 to 1946.',
  [['s18-h', 'information', ['s18-a', 's18-b'], 'Several months.'], ['s18-p', 'prop', ['s18-tw'], 'Typewriter.']], bgId(18));
// 19 — Documents
shot(45.0, 46.5, [bg('s19-bg', 'bg-desk'),
  img('s19-f', 'folders', 160, 760, 440, {...mv('prop', 'Files thrown on the judges table'), keys: slam(.05, 160, 760, 440)}),
  img('s19-d', 'document', 610, 820, 420, {...mv('prop', 'A document thrown beside them'), from: .55, keys: slam(.55, 610, 820, 420)}),
  txt('s19-a', 'DOCUMENTS', 110, 250, 130, INK, .5)],
  'Files and documents slammed onto the judges table.',
  [['s19-h', 'information', ['s19-a'], 'Documents.'], ['s19-p', 'prop', ['s19-f', 's19-d'], 'Files.']], bgId(19));
// 20 — Films et témoignages
shot(46.5, 50.65, [bg('s20-bg', 'bg-dark'),
  img('s20-pj', 'projector', 110, 900, 440, {...mv('prop', 'An old projector runs'), keys: Array.from({length: 9}, (_, i) => ({t: r2(i * .5), y: 900 + (i % 2 ? 3 : 0)}))}),
  img('s20-r', 'film-reel', 640, 820, 440, {...mv('prop', 'A film reel turns'), keys: spinKeys(860, 1040, 440, 440, 0, 1.6, 0, 4.1)}),
  txt('s20-a', 'FILMS', 110, 250, 130, BEIGE, .1), txt('s20-b', 'TÉMOIGNAGES', 110, 400, 110, RED, .65)],
  'A projector and a turning film reel: films and testimonies shown as evidence.',
  [['s20-h', 'information', ['s20-a', 's20-b'], 'Films and testimonies.'], ['s20-p', 'prop', ['s20-pj', 's20-r'], 'Projector and reel.']], bgId(20));
// 21 — 1946
shot(50.65, 52.7, [bg('s21-bg', 'bg-court'),
  img('s21-g', 'gavel', 420, 900, 440, {...mv('prop', 'The gavel strikes for the end of the trial'), from: .2, keys: [...slam(.2, 420, 900, 440), {t: 2.0, x: 424, y: 902, w: 440}]}),
  txt('s21-a', 'FIN DU PROCÈS', 110, 250, 90, BEIGE, .1), txt('s21-b', '1946', 110, 370, 180, RED, .45)],
  'The gavel strikes: the trial ends in 1946.',
  [['s21-h', 'information', ['s21-a', 's21-b'], 'Trial ends 1946.'], ['s21-p', 'prop', ['s21-g'], 'Gavel.']], bgId(21));
// 22 — Condamnations
shot(52.7, 55.9, [bg('s22-bg', 'bg-dark'),
  img('s22-acc', 'accused-row', 160, 1200, 860, {...mv('actor', 'The accused row seen from afar'), keys: [{t: 0, x: 190, w: 820}, {t: 3.15, x: 150, w: 880}]}),
  ...stamp('s22-st', 'CONDAMNÉS', .1, 640, 820, 640),
  txt('s22-a', '+ PEINES DE PRISON', 110, 260, 80, BEIGE, 1.6)],
  'Red stamp CONDAMNÉS over the dock, then prison sentences noted.',
  [['s22-h', 'information', ['s22-a'], 'Prison sentences.'], ['s22-s', 'information', ['s22-st', 's22-st-t'], 'Stamp.'], ['s22-c', 'actor', ['s22-acc'], 'Accused.']], bgId(22));
// 23 — Au-delà du procès
shot(55.9, 59.3, [bg('s23-bg', 'bg-building'),
  img('s23-g', 'globe', 470, 1050, 340, {...mv('prop', 'A globe rises behind the courthouse'), keys: [{t: 0, y: 1200, alpha: .3}, {t: .9, y: 1050, alpha: 1}, {t: 3.35, y: 1030}]}),
  txt('s23-a', 'AU-DELÀ', 110, 330, 140, BEIGE, .7), txt('s23-b', 'DES PERSONNES JUGÉES', 110, 490, 70, BEIGE, 1.4)],
  'A globe rises behind the courthouse: the importance goes beyond the people judged.',
  [['s23-h', 'information', ['s23-a', 's23-b'], 'Beyond.'], ['s23-p', 'prop', ['s23-g'], 'Globe.']], bgId(23));
// 24 — Droit international
shot(59.3, 63.4, [bg('s24-bg', 'bg-desk'),
  img('s24-g', 'globe', 440, 760, 400, {...mv('prop', 'The globe on the table'), keys: drift(0, 4.05, 440, 760, 400, -20, -10, 40)}),
  img('s24-d', 'document', 150, 1050, 300, {...mv('prop', 'A principle is written down'), from: 1.0, keys: slam(1.0, 150, 1050, 300)}),
  txt('s24-a', 'UN PRINCIPE', 110, 240, 110, INK, .1), txt('s24-b', 'DROIT INTERNATIONAL', 110, 380, 90, RED, 1.85)],
  'A globe and a written principle on the table: international law.',
  [['s24-h', 'information', ['s24-a', 's24-b'], 'International law principle.'], ['s24-p', 'prop', ['s24-g', 's24-d'], 'Globe and document.']], bgId(24));
// 25 — Un responsable politique ou militaire
shot(63.4, 66.3, [bg('s25-bg', 'bg-dark'),
  img('s25-one', 'accused-one', 380, 820, 520, {...mv('actor', 'A generic silhouette stands for any leader'), keys: drift(0, 2.85, 380, 820, 520, -20, -20, 40)}),
  txt('s25-a', 'POLITIQUE', 110, 250, 110, BEIGE, .2), txt('s25-b', 'OU MILITAIRE', 110, 380, 110, BEIGE, .75)],
  'A generic silhouette for any political or military leader.',
  [['s25-h', 'information', ['s25-a', 's25-b'], 'Political or military.'], ['s25-c', 'actor', ['s25-one'], 'Silhouette.']], bgId(25));
// 26 — Personnellement poursuivi au nom d'un État
shot(66.3, 70.0, [bg('s26-bg', 'bg-dark'),
  img('s26-s', 'scales', 390, 820, 500, {...mv('prop', 'The scales tip as responsibility weighs'), keys: spinKeys(640, 1062, 500, 484, .06, -.07, 0, 3.6, .3)}),
  txt('s26-a', 'PERSONNELLEMENT', 110, 250, 110, RED, .05), txt('s26-b', "AU NOM D'UN ÉTAT", 110, 390, 100, BEIGE, 1.9)],
  'The scales tip: a person can be prosecuted personally even for crimes in the name of a state.',
  [['s26-h', 'information', ['s26-a', 's26-b'], 'Personally, in the name of a state.'], ['s26-p', 'prop', ['s26-s'], 'Scales.']], bgId(26));
// 27 — Le 20 novembre 1945, un procès commence
shot(70.0, 73.6, [bg('s27-bg', 'bg-court'),
  img('s27-j', 'judges', 330, 700, 620, {...mv('actor', 'Judges at the bench'), keys: drift(0, 3.55, 330, 700, 620, 10, -6, 0)}),
  img('s27-acc', 'accused-row', 110, 1080, 600, {...mv('actor', 'Accused in the dock'), keys: drift(0, 3.55, 110, 1080, 600, 20, -4, 10)}),
  txt('s27-a', '20 NOVEMBRE 1945', 110, 250, 110, RED, .1), txt('s27-b', 'UN PROCÈS COMMENCE', 110, 390, 80, BEIGE, 1.5)],
  'Back in the courtroom: judges and accused, with the opening date.',
  [['s27-h', 'information', ['s27-a', 's27-b'], 'Opening date.'], ['s27-c', 'actor', ['s27-j', 's27-acc'], 'Judges and accused.']], bgId(27));
// 28 — Une nouvelle manière de définir la responsabilité
shot(73.6, 77.3, [bg('s28-bg', 'bg-dark'),
  img('s28-s', 'scales', 420, 900, 440, {...mv('prop', 'The scales rise and settle'), keys: [{t: 0, y: 1100, alpha: .3}, {t: .6, y: 900, alpha: 1}, {t: 3.65, y: 880}]}),
  txt('s28-a', 'RESPONSABILITÉ', 110, 250, 110, RED, 1.7), txt('s28-b', 'DES DIRIGEANTS', 110, 380, 110, BEIGE, 2.5)],
  'The scales rise as responsibility of leaders is redefined.',
  [['s28-h', 'information', ['s28-a', 's28-b'], 'Leaders responsibility.'], ['s28-p', 'prop', ['s28-s'], 'Scales.']], bgId(28));
// 29 — La question finale
shot(77.3, 81.95, [bg('s29-bg', 'bg-dark'),
  img('s29-d', 'document', 480, 1000, 320, {...mv('prop', 'The order sheet slowly drifts in the dark'), keys: drift(0, 4.6, 480, 1000, 320, 30, -40, 40)}),
  txt('s29-a', "EST-CE QU'UN ORDRE", 110, 300, 100, BEIGE, 1.4), txt('s29-b', 'PEUT VRAIMENT', 110, 440, 100, BEIGE, 2.3), txt('s29-c', 'JUSTIFIER', 110, 580, 130, RED, 3.15), txt('s29-d2', 'UN CRIME ?', 110, 740, 130, RED, 3.7)],
  'The final question builds in large letters above a lone order sheet.',
  [['s29-h', 'information', ['s29-a', 's29-b', 's29-c', 's29-d2'], 'Final question.'], ['s29-p', 'prop', ['s29-d'], 'Order sheet.']], bgId(29));
// 30 — Sources
shot(81.95, END, [bg('s30-bg', 'bg-dark'),
  txt('s30-a', 'Sources :', 110, 400, 90, BEIGE),
  txt('s30-1', 'United States Holocaust Memorial Museum', 110, 560, 46, BEIGE),
  txt('s30-2', 'Mémorial du procès de Nuremberg', 110, 640, 46, BEIGE),
  txt('s30-3', 'ONU', 110, 720, 46, BEIGE),
  txt('s30-4', 'Musique : « Decisions », Kevin MacLeod (CC BY 4.0)', 110, 860, 38, BEIGE),
  img('s30-p', 'scales', 520, 1100, 240, {...mv('prop', 'The scales settle on the sources page'), keys: [{t: 0, alpha: .3, y: 1150}, {t: .5, alpha: 1, y: 1100}, {t: r2(END - 81.95 - .05), y: 1090}]})],
  'Sources page.', [['s30-h', 'information', ['s30-a', 's30-1', 's30-2', 's30-3', 's30-4'], 'Sources and music credit.'], ['s30-s', 'prop', ['s30-p'], 'Scales.']], bgId(30));

// Bandes de papier clair derrière chaque ligne de titre (lisibilité sur fonds chargés).
const NO_STRIP = /^(s1-|s17-l|s14-l|.*-t$)/;
for (const s of S) {
  const add = [];
  s.layers.forEach((l, i) => {
    if (l.type !== 'text' || l.y > 900 || NO_STRIP.test(l.id)) return;
    if (l.color === BEIGE) l.color = INK;
    const tw = l.text.length * l.size * .64, x = 80;
    let w = Math.min(1086 - x, Math.max(tw + 110, l.size * 6.6)); const h = w * .25;
    const y = r2(Math.min(1660 - h, Math.max(186, l.y + l.size * .5 - h / 2))), from = l.from || 0;
    const st = {type: 'image', id: l.id + '-strip', path: 'art/strip.png', x, y, w: r2(w), h: Math.round(h), ...mv('information', 'A torn paper strip is laid down under the heading'),
      ...(from ? {from} : {}), keys: [{t: from, x: x + 30, alpha: .5}, {t: r2(from + .18), x, alpha: 1}, {t: r2(from + .9), x: x + 6}]};
    add.push([i, st]);
    for (const r of s.portrait.regions) if (r.layer_ids.includes(l.id)) r.layer_ids.push(st.id);
  });
  s.layers.splice(1, 0, ...add.map(([, st]) => st));
}
function bounds(l) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const add = (a, b, c, d) => { x0 = Math.min(x0, a); y0 = Math.min(y0, b); x1 = Math.max(x1, c); y1 = Math.max(y1, d); };
  for (const k of [{}, ...(l.keys || [])].map(k => ({...l, ...k}))) {
    if (l.type === 'image') { const h = l.h / l.w * k.w, a = k.angle || 0, R = Math.hypot(k.w, h); if (a) add(k.x - R * .5, k.y - R * .5, k.x + R, k.y + R); else add(k.x, k.y, k.x + k.w, k.y + h); }
    else if (l.type === 'text') add(k.x - 10, k.y - l.size * .35, k.x + l.text.length * l.size * .8, k.y + l.size * 1.4);
  }
  return {x0, y0, x1, y1};
}
for (const s of S) for (const r of s.portrait.regions) {
  const b = r.layer_ids.map(id => { const l = s.layers.find(l => l.id === id); if (!l) throw new Error('layer ' + id); return bounds(l); })
    .reduce((a, c) => ({x0: Math.min(a.x0, c.x0), y0: Math.min(a.y0, c.y0), x1: Math.max(a.x1, c.x1), y1: Math.max(a.y1, c.y1)}));
  const x = Math.max(SAFE.x0, b.x0 - 8), y = Math.max(SAFE.y0, b.y0 - 8), x1 = Math.min(SAFE.x1, b.x1 + 8), y1 = Math.min(SAFE.y1, b.y1 + 8);
  r.region = {x: Math.ceil(x), y: Math.ceil(y), w: Math.floor(x1) - Math.ceil(x), h: Math.floor(y1) - Math.ceil(y)};
}
S.forEach((s, i) => { s.start = r2(s.start); s.end = r2(s.end); if (i && Math.abs(S[i - 1].end - s.start) > 1e-9) throw new Error('trou ' + i);
  const span = s.end - s.start; for (const l of s.layers) { if ((l.from || 0) > span - .01) throw new Error('from ' + l.id); for (const k of l.keys || []) if (k.t > span - .01) k.t = r2(span - .02); } });

// Sous-titres depuis captions.txt
const words = JSON.parse(fs.readFileSync(DIR + 'audio/words.json', 'utf8'));
const clean = t => t.replace(/[«»"“”]/g, '').trim();
const tok = fs.readFileSync(DIR + 'script.txt', 'utf8').split(/\s+/).map(clean).filter(t => /[\p{L}\p{N}]/u.test(t));
if (tok.length !== words.length) throw new Error('alignement ' + tok.length + ' ' + words.length);
const phrases = fs.readFileSync(DIR + 'captions.txt', 'utf8').split('\n').map(x => x.trim()).filter(Boolean);
const out = []; let wi = 0;
for (const ph of phrases) {
  const pt = ph.split(/\s+/).map(clean).filter(t => /[\p{L}\p{N}]/u.test(t)), n = pt.length;
  if (pt.join(' ') !== tok.slice(wi, wi + n).join(' ')) throw new Error('phrase: ' + ph + ' / ' + tok.slice(wi, wi + n).join(' '));
  out.push({start: r2(words[wi][1] + LEAD), end: r2(words[wi + n - 1][2] + LEAD), text: ph}); wi += n;
}
if (wi !== tok.length) throw new Error('phrases incomplètes');
for (let i = 0; i + 1 < out.length; i++) if (out[i + 1].start - out[i].start < .55) out[i + 1].start = r2(out[i].start + .55);
for (const c of out) if (c.end < c.start + .45) c.end = r2(c.start + .45);
for (let i = 0; i < out.length; i++) { const next = out[i + 1]; out[i].end = r2(next ? Math.min(next.start, Math.max(out[i].end + .3, out[i].start + .6)) : out[i].end + .5); }
for (let i = 0; i + 1 < out.length; i++) if (out[i].end > out[i + 1].start) out[i].end = out[i + 1].start;

const f = p => `${LIB}/${p}`;
const STA = n => `owlish-home-202/Paper & Stationery/Stationery_${String(n).padStart(2, '0')}.wav`;
const sfx = [
  [0.02, 'kenney-impact/impactPlank_medium_001.ogg', .35], [1.4, STA(5), .2], [2.0, STA(20), .2], [2.45, 'kenney-impact/impactPlank_medium_003.ogg', .3],
  [4.72, 'kenney-impact/impactPlate_heavy_001.ogg', .22], [6.0, 'kenney-impact/impactGeneric_light_001.ogg', .3], [8.4, STA(12), .15],
  [10.05, STA(30), .15], [12.12, 'kenney-impact/impactPlank_medium_002.ogg', .35], [13.25, 'kenney-impact/impactPlank_medium_000.ogg', .25],
  [14.35, 'artisticdude-swishes/swish-3.wav', .08], [16.95, 'artisticdude-swishes/swish-10.wav', .08],
  [19.38, 'kenney-impact/impactGeneric_light_002.ogg', .3], [21.17, 'kenney-impact/impactGeneric_light_003.ogg', .3], [21.62, 'kenney-impact/impactGeneric_light_000.ogg', .25],
  [22.95, STA(20), .2], [25.05, STA(12), .15], [27.6, STA(30), .18], [32.9, 'kenney-impact/impactPlate_heavy_002.ogg', .22],
  [35.65, 'kenney-impact/footstep_concrete_001.ogg', .2], ...fl.map(([, , , t]) => [r2(t + LEAD - .05), STA(5), .18]),
  ...Array.from({length: 14}, (_, i) => [r2(42.7 + i * .16), `kenney-interface/click_00${1 + i % 5}.ogg`, .08]),
  [45.08, 'kenney-impact/impactGeneric_light_004.ogg', .3], [45.6, 'kenney-impact/impactGeneric_light_001.ogg', .25],
  [50.9, 'kenney-impact/impactPlank_medium_004.ogg', .35], [52.83, 'kenney-impact/impactPlate_heavy_003.ogg', .22],
  [56.0, 'artisticdude-swishes/swish-1.wav', .08], [60.33, 'kenney-impact/impactGeneric_light_002.ogg', .25], [63.5, STA(12), .15],
  [70.1, STA(20), .15], [73.7, 'artisticdude-swishes/swish-3.wav', .07], [82.0, STA(5), .15]
].map(([time, p, gain]) => ({kind: 'file', path: f(p), time, gain}));

const project = {
  version: 1, style: 'B2', width: 1080, height: 1920, fps: 30, font: 'fonts/Chalkboard-local.ttf',
  voice: {path: 'narration.wav', lead: LEAD, tail: TAIL},
  captions: out, shots: S, sfx,
  ambience: [{path: 'audio/room-bed.wav', start: 0, end: r2(END - .001), gain: .035},
    {path: f('rubberduck-general-100-2/sfx100v2_loop_machine_01.ogg'), start: 46.5, end: 50.65, gain: .05, fadeIn: .3, fadeOut: .4}],
  audio_cuts: [{start: 77.15, end: 78.0, reason: 'Short sound cut before the final question, as requested', return_trigger: 'The final question starts'}],
  reference_review: {author_id: 'claude-opus-5-5', capability: {mode: 'sample_target', environment: 'Claude Code desktop on macOS, Gemini image + TTS, local renderer', limitations: []}}
};
fs.writeFileSync(DIR + 'project.json', JSON.stringify(project, null, 2));
console.log('ok', S.length, 'plans,', out.length, 'sous-titres, durée', END);
