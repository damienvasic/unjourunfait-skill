# Un jour un fait — skill Claude Code

Skill pour Claude Code qui produit un épisode de la série « Un jour un fait » : un fait historique
du jour en vidéo verticale 9:16, voix off française (Gemini), illustrations en papier découpé,
sous-titres, question finale et sources à l'écran. Il ne publie jamais rien.

## Installation

1. Copier le dossier `unjourunfait` dans `~/.claude/skills/`.
2. Installer aussi le skill [directing-stickman-videos](https://github.com/kaomei/stickman-video-director),
   dont celui-ci se sert pour le montage et le rendu.
3. Installer `ffmpeg` et `whisper-cpp`, et le modèle `ggml-large-v3-turbo-q5_0.bin`
   dans `~/.cache/whisper-cpp/`.
4. Créer `~/Desktop/UnJourUnFait/.env` avec `GEMINI_API_KEY=ta_clé` (ne jamais partager ce fichier).

Puis demander à Claude : « Fais l'épisode Un jour un fait d'aujourd'hui ».

## Contenu

- `unjourunfait/SKILL.md` : règles et chaîne de production.
- `unjourunfait/scripts/` : génération de la voix (`tts.mjs`) et des images (`img.mjs`).
- `unjourunfait/exemples/` : deux épisodes complets (Apollo 12, procès de Nuremberg).

Musiques utilisées : Kevin MacLeod (incompetech.com), licence CC BY 4.0, à créditer dans la description.
