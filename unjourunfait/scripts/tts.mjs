// Petit test Gemini TTS : enregistre l'audio quel que soit son format, affiche les erreurs Google.
import fs from 'node:fs';
const [model, voice, textFile, out] = process.argv.slice(2);
const key = process.env.GEMINI_API_KEY;
const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {method: 'POST', headers: {'Content-Type': 'application/json', 'x-goog-api-key': key}, body: JSON.stringify({contents: [{role: 'user', parts: [{text: fs.readFileSync(textFile, 'utf8')}]}], generationConfig: {responseModalities: ['AUDIO'], speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName: voice}}}}})});
const d = await r.json();
if (!r.ok) { console.log('HTTP', r.status, d.error?.status, (d.error?.message || '').slice(0, 300)); process.exit(1); }
const p = d.candidates?.[0]?.content?.parts?.find(x => x.inlineData);
console.log('format:', p?.inlineData?.mimeType);
fs.writeFileSync(out, Buffer.from(p.inlineData.data, 'base64'));
console.log('ok', out);
