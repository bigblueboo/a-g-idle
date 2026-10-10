#!/bin/zsh
# One lane of image generation: runs the given shards through codex, in order. Safe to rerun (skips existing files).
cd "$(dirname "$0")/.."
for k in "$@"; do
  echo "== shard $k start $(date +%T)"
  codex exec -s workspace-write --skip-git-repo-check -o "art/shards/shard-$k.last.txt" "Use your imagegen skill's built-in image_gen tool. Read art/shards/shard-$k.json, a JSON array of entries {kind,id,name,prompt}. For each entry in order: if the file art/raw/{kind}/{id}.png already exists, skip it. Otherwise generate exactly one square image using the entry's prompt verbatim, then copy the generated PNG to art/raw/{kind}/{id}.png (mkdir -p the folder). Do not edit any other file in the workspace. Do not stop early or ask questions; process every entry in the array even if one generation fails (skip failures and continue). When finished print one line: DONE shard $k: N generated, M skipped, F failed." > "art/shards/shard-$k.log" 2>&1
  echo "== shard $k exit $? $(date +%T)"; tail -2 "art/shards/shard-$k.last.txt" 2>/dev/null
done
