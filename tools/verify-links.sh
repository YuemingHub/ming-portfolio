#!/usr/bin/env bash
# 逐条核实作品集里出现的每个外部链接：返回码 + 页面标题。
# 用法：
#   bash tools/verify-links.sh                       # 只查站外链接
#   bash tools/verify-links.sh https://发布地址/      # 额外检查已部署页面本身
set -uo pipefail

PAGE="$(cd "$(dirname "$0")/.." && pwd)/index.html"
[ -f "$PAGE" ] || { echo "找不到 index.html: $PAGE"; exit 2; }

extract() {
  grep -oE 'href="https?://[^"]+"' "$PAGE" | sed -E 's/^href="//; s/"$//' | grep -v 'ymai.fun/ming/' | sort -u
}

fail=0
printf '%-6s %-64s %s\n' "CODE" "URL" "TITLE"
printf -- '---------------------------------------------------------------------------------------------\n'
while IFS= read -r url; do
  body=$(curl -sL --max-time 25 "$url" || true)
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 25 "$url" || echo "000")
  title=$(printf '%s' "$body" | tr -d '\r\n' | sed -n 's/.*<title[^>]*>\([^<]*\)<\/title>.*/\1/p' | head -1)
  [ -n "$title" ] || title="(无标题)"
  if [ "$code" = "200" ]; then mark="ok  " ; else mark="FAIL"; fail=$((fail+1)); fi
  printf '%-6s %-64s [%s] %s\n' "$mark $code" "${url:0:64}" "${title:0:40}" ""
done < <(extract)

if [ "$#" -ge 1 ]; then
  site="$1"
  code=$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 25 "$site" || echo "000")
  bytes=$(curl -sL --max-time 25 "$site" | wc -c)
  [ "$code" = "200" ] || fail=$((fail+1))
  printf '%-6s %-64s bytes=%s\n' "code=$code" "$site" "$bytes"
fi

echo "----"
if [ "$fail" -eq 0 ]; then echo "RESULT=ALL_200"; exit 0; else echo "RESULT=FAILURES=$fail"; exit 1; fi
