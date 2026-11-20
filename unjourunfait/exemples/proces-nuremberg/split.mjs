// Écrit part2/project.json : plans à partir de CUT, temps décalés, voix coupée dans un silence.
import fs from 'node:fs';
const DIR = new URL('.', import.meta.url).pathname, CUT = 55.9, LEAD = 0.15;
const p = JSON.parse(fs.readFileSync(DIR + 'project.json', 'utf8'));
const sh = t => Math.round((t - CUT) * 1000) / 1000;
const abs = q => q.startsWith('/') ? q : DIR + q;
const fix = l => ({...l, ...(l.path ? {path: abs(l.path)} : {}), ...(l.children ? {children: l.children.map(fix)} : {})});
const shots = p.shots.filter(s => s.start >= CUT - 1e-6).map(s => ({...s, start: sh(s.start), end: sh(s.end), layers: s.layers.map(fix)}));
const end = shots.at(-1).end;
const q = {...p, font: abs(p.font), voice: {path: DIR + 'audio/narration-part2.wav', lead: 0, tail: p.voice.tail},
  captions: p.captions.filter(c => c.start >= CUT).map(c => ({...c, start: sh(c.start), end: sh(c.end)})),
  sfx: p.sfx.filter(x => x.time >= CUT).map(x => ({...x, time: sh(x.time)})), shots,
  ambience: [{...p.ambience[0], path: abs(p.ambience[0].path), start: 0, end: Math.round((end - .001) * 1000) / 1000, offset: CUT}],
  audio_cuts: (p.audio_cuts || []).filter(c => c.start >= CUT).map(c => ({...c, start: sh(c.start), end: sh(c.end)}))};
fs.mkdirSync(DIR + 'part2', {recursive: true});
fs.writeFileSync(DIR + 'part2/project.json', JSON.stringify(q, null, 2));
console.log('part2', shots.length, 'plans, durée', end, 'voix à partir de', CUT - LEAD);
