---
name: unjourunfait
description: Produit un épisode de la série « Un jour un fait » (un fait historique du jour en vidéo verticale 9:16, voix off française, personnages bonhommes et objets en papier découpé, question finale, sources à l'écran). Utiliser quand l'utilisateur dit « Un jour », « un jour un fait », donne un brief d'épisode (date, texte de voix off, scènes, sources) ou demande la vidéo du jour.
---

# Un jour un fait

Série quotidienne : un fait historique ou étonnant lié à la date du jour, raconté en voix off,
illustré en papier découpé coloré (style B2 du skill `directing-stickman-videos`), terminé par une
question au spectateur et un écran de sources. Projet séparé d'AuFilDuTextile : aucun logo, style
ou CTA partagé.

## Prérequis

- Skill `directing-stickman-videos` installé dans `~/.claude/skills` (moteur B, `scripts/autopilot.mjs`).
- Dossier projet `~/Desktop/UnJourUnFait/`, avec la clé Gemini dans `.env` (`GEMINI_API_KEY`).
  Ne jamais lire, afficher ni coller la clé. La charger seulement pour une commande :
  `set -a; source ~/Desktop/UnJourUnFait/.env 2>/dev/null; set +a`.
- `ffmpeg`, `whisper-cli` avec `~/.cache/whisper-cpp/ggml-large-v3-turbo-q5_0.bin`.

## Règles du brief

- Le texte de voix off fourni est lu **mot pour mot**. Si un fait est faux, le signaler et proposer
  une correction avant de produire.
- **Ne jamais publier.** Produire seulement le projet et la vidéo finale dans un dossier daté
  `videos/AAAA-MM-JJ-<sujet>/`.
- Sujets graves (guerre, procès, crimes) : gravité et respect, aucune glorification, aucun symbole
  ni insigne, aucune violence graphique, pas de faux dialogue, pas de fausse citation, pas d'image
  générée présentée comme une archive. Personnes représentées par des silhouettes anonymes sans visage.
- Vérifier les faits et les écrire dans `sources.md`. Afficher à la fin les sources du brief.

## Chaîne de production (validée sur Apollo 12 et Nuremberg)

1. **Dossier** : `videos/AAAA-MM-JJ-<sujet>/` avec `script.txt` (texte exact) et `sources.md`.
2. **Voix** : `node scripts/tts.mjs gemini-3.8-flash-tts Bodi script.txt narration.wav`.
   Voix Bodi au rythme naturel (~2,7 mots/s). Ne mettre **aucune consigne de jeu** dans le texte :
   Gemini la lit à voix haute. Si la durée dépasse la cible, le dire plutôt qu'accélérer.
3. **Timings** : whisper-cli en mots (`audio/words.json`), puis `captions.txt` groupé à la main :
   une ligne par sous-titre, 22–24 caractères maximum (règle B2 portrait).
4. **Images** : `node scripts/img.mjs prompts/x.txt art/x.png [--bg] [--aspect 9:16] [--ref y.png]`.
   `--bg` pour les fonds plein cadre ; sinon détourage automatique du fond blanc. Style des prompts :
   papier découpé coloré, bords déchirés, texture de papier chaud, fond blanc uni pour les découpes.
   Si une image ne sort pas, retirer de la consigne les mots qui déclenchent le filtre (symboles…).
5. **Montage** : `build.mjs` génère `project.json` (B2, 1080×1920, police Chalkboard locale en TTF).
   Partir de `exemples/*/build.mjs`. Plans de 1 à 3 s, un mouvement principal au moins toutes les
   2,5 s, `portrait.regions` et `background_ids` sur chaque plan, `motion:{role,reason}` sur les
   calques qui bougent, une ambiance qui couvre toute la durée. Titres lisibles : bande de papier
   claire sous chaque ligne, placée sous tous les textes. Mots forts en rouge, tampons sur les mots clés.
   Valider avec `node ~/.claude/skills/directing-stickman-videos/scripts/autopilot.mjs validate`.
6. **Rendu** : `preview` est limité à 60 s. Pour plus long, couper dans un silence de la voix
   (`split.mjs`, `CUT` = début d'un silence), rendre chaque partie avec `preview --replace`.
7. **Assemblage** : `assemble.sh` concatène les parties, ajoute la musique (bibliothèque du skill,
   volume ~0,05–0,06, coupée juste avant la question finale), normalise à -14 LUFS, écrit
   `livraison/AAAA-MM-JJ-un-jour-<sujet>.mp4` + `.srt`.
8. **Contrôle** : planches contact plan par plan, mesure du volume (ebur128). Dire clairement ce qui
   n'a pas été écouté ou relu.
9. **Livraison** : si un connecteur Google Drive est disponible, envoyer une copie compressée
   (< 7 Mo) dans le dossier Drive choisi par l'utilisateur (le lui demander la première fois). Le
   master complet reste dans `livraison/` ; l'utilisateur le glisse lui-même.

## À dire à la livraison

- Durée réelle par rapport à la cible, et pourquoi.
- Écarts au brief (sous-titres sur une ligne, couleurs imposées par B2…).
- Crédit musique à mettre dans la description : titres de Kevin MacLeod (incompetech.com),
  licence CC BY 4.0 (déjà utilisés : « Quirky Dog », « Morning », « Decisions »).

## Exemples

- `exemples/apollo-12/` : épisode lumineux (espace), 74,9 s, validé.
- `exemples/proces-nuremberg/` : variante sombre papier déchiré pour sujet grave, 84,9 s, validé,
  avec `split.mjs` et `assemble.sh`.
