#!/bin/zsh
# Assemble partie 1 (0–55,9 s) + partie 2 (55,9–84,83 s), ajoute la musique sur toute la durée, normalise à -14 LUFS.
set -e
cd "${0:A:h}"
MUSIC=~/.claude/skills/directing-stickman-videos/assets/b-audio-library/audio/music/bgm-decisions.mp3
OUT=livraison/2026-11-20-un-jour-proces-nuremberg.mp4
ffmpeg -v error -y -i output/preview.mp4 -i part2/output/preview.mp4 -i "$MUSIC" -filter_complex \
 "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[v][a];[2:a]atrim=0:84.83,volume='if(between(t,77.15,78.0),0,0.06)':eval=frame,afade=t=in:d=1,afade=t=out:st=82.3:d=2.5[m];[a][m]amix=inputs=2:normalize=0:duration=first[mix];[mix]loudnorm=I=-14:TP=-1.5:LRA=11[out]" \
 -map "[v]" -map "[out]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT"
cat output/preview.srt > /dev/null
echo ok "$OUT"
