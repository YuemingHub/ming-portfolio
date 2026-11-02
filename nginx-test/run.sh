#!/usr/bin/env bash
# 一条命令复现 nginx 子路径测试。
#   Docker:      bash nginx-test/run.sh
#   本机 nginx:  NGINX_BIN=/path/to/nginx bash nginx-test/run.sh
# 可选：TEST_PORT / ROLLBACK_PORT / SITE_DIR / KEEP=1
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/.." && pwd)"
SITE="${SITE_DIR:-$REPO/site/dist}"
PORT="${TEST_PORT:-18089}"
ROLLBACK_PORT="${ROLLBACK_PORT:-18090}"
RUN_DIR="$HERE/.run"
CONTAINER="ming-nginx-test-$$"
NGINX_PID=""

nginxpath() {
  if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else printf '%s' "$1"; fi
}

cleanup() {
  local rc=$?
  if [[ "${KEEP:-0}" != "1" ]]; then
    if [[ -n "$NGINX_PID" ]]; then
      "$NGINX_PID" -p "$NGINX_PREFIX/" -c "$CONF" -s stop >/dev/null 2>&1 || true
    fi
    if [[ "${MODE:-}" == "docker" ]]; then
      docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
    fi
    rm -rf "$RUN_DIR"
  else
    echo "KEEP=1：保留 $RUN_DIR 与运行中的服务"
  fi
  exit "$rc"
}
trap cleanup EXIT INT TERM

if [[ ! -f "$SITE/index.html" ]]; then
  echo "未找到 $SITE/index.html，先构建站点…"
  (cd "$REPO/site" && npm ci --no-audit --no-fund && npm run build)
fi

rm -rf "$RUN_DIR"
mkdir -p "$RUN_DIR/www/ming" "$RUN_DIR/rollback"
cp -R "$SITE"/. "$RUN_DIR/www/ming/"
cp "$HERE/fixtures/selfspace/index.html" "$RUN_DIR/www/index.html"
cp "$HERE/fixtures/selfspace/index.html" "$RUN_DIR/rollback/index.html"

if [[ -n "${NGINX_BIN:-}" ]]; then
  MODE=local
  NGINX_PID="$NGINX_BIN"
  NGINX_PREFIX="${NGINX_PREFIX:-$(cd "$(dirname "$NGINX_BIN")" && pwd)}"
  TMP="$(nginxpath "$RUN_DIR")"
  MIME="$(nginxpath "$NGINX_PREFIX/conf/mime.types")"
  WWW="$(nginxpath "$RUN_DIR/www")"
  ROLLBACK_ROOT="$(nginxpath "$RUN_DIR/rollback")"
  CONF="$(nginxpath "$RUN_DIR/nginx.conf")"
elif command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  MODE=docker
  TMP="/tmp"
  MIME="/etc/nginx/mime.types"
  WWW="/srv/www"
  ROLLBACK_ROOT="/srv/rollback"
  CONF="$RUN_DIR/nginx.conf"
else
  echo "需要 Docker（并已启动），或通过 NGINX_BIN=/path/to/nginx 指定本机 nginx。"
  exit 2
fi

sed \
  -e "s|__TMP__|$TMP|g" \
  -e "s|__MIME__|$MIME|g" \
  -e "s|__WWW__|$WWW|g" \
  -e "s|__ROLLBACK_ROOT__|$ROLLBACK_ROOT|g" \
  -e "s|__PORT__|$PORT|g" \
  -e "s|__ROLLBACK_PORT__|$ROLLBACK_PORT|g" \
  "$HERE/nginx.conf.template" > "$RUN_DIR/nginx.conf"

echo "mode=$MODE port=$PORT rollback=$ROLLBACK_PORT"

for p in "$PORT" "$ROLLBACK_PORT"; do
  if node -e "fetch('http://127.0.0.1:$p/').then(()=>process.exit(0)).catch(()=>process.exit(1))" 2>/dev/null; then
    echo "端口 $p 已被占用，先停止占用进程再重试。"
    exit 3
  fi
done

if [[ "$MODE" == "docker" ]]; then
  export MSYS_NO_PATHCONV=1
  docker run --rm -d --name "$CONTAINER" \
    -p "$PORT:$PORT" -p "$ROLLBACK_PORT:$ROLLBACK_PORT" \
    -v "$(nginxpath "$RUN_DIR/www"):/srv/www:ro" \
    -v "$(nginxpath "$RUN_DIR/rollback"):/srv/rollback:ro" \
    -v "$(nginxpath "$CONF"):/etc/nginx/nginx.conf:ro" \
    nginx:1.28.0 >/dev/null
else
  # Windows nginx does not detach from the launching shell: run it in the
  # background so the script can continue, and keep its output in a file.
  "$NGINX_PID" -p "$NGINX_PREFIX/" -c "$CONF" >> "$RUN_DIR/nginx-start.log" 2>&1 &
  disown || true
fi

ready=0
for _ in $(seq 1 50); do
  if node -e "fetch('http://127.0.0.1:$PORT/ming/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; then
    ready=1
    break
  fi
  sleep 0.2
done
if [[ "$ready" != "1" ]]; then
  echo "nginx 未在预期时间内就绪"
  if [[ "$MODE" == "docker" ]]; then docker logs "$CONTAINER" 2>&1 | tail -20; fi
  exit 1
fi

node "$HERE/verify.mjs" \
  --origin "http://127.0.0.1:$PORT" \
  --rollback-origin "http://127.0.0.1:$ROLLBACK_PORT" \
  --portfolio "$RUN_DIR/www/ming" \
  --sentinel "$RUN_DIR/www/index.html"
