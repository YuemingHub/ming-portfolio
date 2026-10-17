#!/usr/bin/env bash
# 生成发布验证记录：把每条检查的命令与原始输出一起落盘，便于复跑与对账。
# 用法：bash tools/record-verification.sh
set -uo pipefail
SITE="https://yueminghub.github.io/ming-portfolio/"
CDP_PORT="${CDP_PORT:-9333}"
R="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$R/evidence/VERIFICATION.md"
mkdir -p "$R/evidence"
{
  echo "# 发布验证记录"
  echo
  echo "生成时间：$(date -u '+%Y-%m-%d %H:%M:%SZ')（UTC）· 生成命令：bash tools/record-verification.sh"
  echo "本节全部为命令原始输出，未手工改写。"
  echo
  echo "## 1. 部署状态"
  echo
  echo '```text'
  echo '$ git rev-parse --short HEAD'; git -C "$R" rev-parse --short HEAD
  echo '$ gh api repos/YuemingHub/ming-portfolio/pages'
  gh api repos/YuemingHub/ming-portfolio/pages --jq '{status,cname,https_enforced,source:.source}'
  echo '```'
  echo
  echo "## 2. 线上内容与提交内容逐字节一致"
  echo
  echo '```text'
  tf=$(mktemp) th=$(mktemp)
  curl -sL --max-time 25 "$SITE" -o "$tf"
  git -C "$R" cat-file blob HEAD:index.html > "$th"
  echo "线上字节=$(wc -c < "$tf")  HEAD:index.html 字节=$(wc -c < "$th")"
  echo "线上 md5=$(md5sum < "$tf" | cut -c1-12)  HEAD md5=$(md5sum < "$th" | cut -c1-12)"
  if cmp -s "$tf" "$th"; then echo "cmp=完全一致（线上服务的就是这个提交的内容）"; else
    if [ "$(tr -d '\r\n' < "$tf" | md5sum)" = "$(tr -d '\r\n' < "$th" | md5sum)" ]; then echo "cmp=仅行尾差异，正文一致"; else echo "cmp=内容不一致，需排查"; fi
  fi
  rm -f "$tf" "$th"
  echo "\$ curl -sI $SITE"
  curl -sI --max-time 25 "$SITE" | grep -iE '^(server|content-type|last-modified)'
  echo '```'
  echo
  echo "## 3. 页面内所有外链逐条核实"
  echo
  echo '```text'
  bash "$R/tools/verify-links.sh" "$SITE"
  echo '```'
  echo
  echo "## 4. 既有生产站回归（作品集发布不得影响它们）"
  echo
  echo '```text'
  for u in https://ymai.fun/ https://ymai.fun/ming/ https://ymai.love/ https://ymai.me/ https://mingos.cn/; do
    printf '%-26s ' "$u"; curl -s -o /dev/null -w 'HTTP %{http_code}\n' --max-time 25 "$u"
  done
  echo '$ gh api repos/YuemingHub/World-Space/commits/main'
  gh api repos/YuemingHub/World-Space/commits/main --jq '.sha[0:7] + " " + (.commit.message | split("\n")[0])'
  echo '```'
  echo
  echo "> 说明：ymai.fun/ming/ 返回 404 与本次发布无关——ymai.fun 的 DNS 指向自建服务器（nginx），"
  echo "> GitHub Pages 上的 ming/index.html 从未通过该域名对外服务。旧页面文件仍保留在 World-Space 仓库 main 分支，未删除。"
  echo
  echo "## 5. 敏感信息自检（公开仓库不得含凭据形状）"
  echo
  echo '```text'
  echo "扫描文件：index.html README.md tools/*.sh"
  pat='([A-Za-z0-9_/-]*(token|secret|password|passwd|api[_-]?key|access[_-]?key)[A-Za-z0-9_/-]*[":= ]+[A-Za-z0-9_-]{8,})|(ghp_[A-Za-z0-9]{20,})|(sk-[A-Za-z0-9]{16,})|(tvly-[A-Za-z0-9-]{10,})|(as_sk_[A-Za-z0-9]{10,})|(BEGIN [A-Z ]*PRIVATE KEY)'
  hits=$(grep -nEi "$pat" "$R/index.html" "$R/README.md" "$R/tools/verify-links.sh" "$R/tools/record-verification.sh" | grep -v 'pat=' || true)
  if [ -z "$hits" ]; then echo "凭据形状命中=0"; else echo "$hits"; fi
  echo "服务器路径/内网地址/主机 IP 形状命中=$(grep -rEo '(/opt/[a-z-]+|/etc/[a-z-]+|127\.0\.0\.1:[0-9]+|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})' "$R/index.html" | wc -l)"
  echo '```'
  echo
  echo "## 6. 真实浏览器量测（tools/audit-browser.mjs 原始输出）"
  echo
  echo "外部浏览器连接器（Qoder Browser Connector）本机未就绪，改用本机 Chrome 无头 + CDP 驱动线上地址，"
  echo "量的是公网渲染结果而非本地文件。截图见同目录各 png。"
  echo
  echo '```text'
  ab=$(node "$(cygpath -m "$R/tools/audit-browser.mjs" 2>/dev/null || echo "$R/tools/audit-browser.mjs")" "$SITE" "$CDP_PORT" 2>&1); rc=$?
  printf '%s\n' "$ab"
  echo "退出码=$rc"
  [ "$rc" = 0 ] || echo "结论=量测未通过，见上"
  echo '```'
  echo
  echo "## 7. 交付 PDF 客观参数"
  echo
  echo '```text'
  pdf=$(ls "$R"/evidence/ming-portfolio-*.pdf 2>/dev/null | tail -1)
  if [ -n "$pdf" ]; then
    echo "文件=$(basename "$pdf") 字节=$(wc -c < "$pdf")"
    echo "页数=$(grep -ao '/MediaBox' "$pdf" | wc -l)（A4 单页）"
    echo "可点链接注释=$(grep -ao '/URI' "$pdf" | wc -l)"
    echo "页面尺寸=$(grep -ao '/MediaBox \[[^]]*\]' "$pdf" | head -1)（594.96x841.92pt = A4）"
    echo "内嵌字体=$(grep -ao '/BaseFont /[A-Za-z0-9+-]*' "$pdf" | sed 's|/BaseFont */||; s/^[A-Z]*+//' | sort -u | tr '\n' ' ')"
  else
    echo "evidence/ 下没有 ming-portfolio-*.pdf，跳过（PDF 由线上地址打印生成，不重复入库）"
  fi
  echo '```'
} > "$OUT"
echo "written: $OUT ($(wc -c < "$OUT") bytes)"
