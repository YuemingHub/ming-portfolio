#!/usr/bin/env bash
# 从公网侧验收一个发布面（默认正式面 ymai.fun/ming/）与既有站回归。可在任何机器上跑。
#   bash tools/verify-surface.sh [对照的本地 index.html 路径]
#   SITE=https://yueminghub.github.io BASE=/ming-portfolio bash tools/verify-surface.sh index.html
set -uo pipefail
SITE="${SITE:-https://ymai.fun}"
BASE="${BASE:-/ming}"
REF="${1:-}"
fail=0
chk() { # chk <期望> <实际> <名称>
  if [ "$1" = "$2" ]; then echo "ok    $3 = $2"; else echo "FAIL  $3 期望=$1 实际=$2"; fail=$((fail+1)); fi
}

code=$(curl -s -o /tmp/vm-ming.html -w '%{http_code}' --max-time 25 -L "$SITE$BASE/")
chk 200 "$code" "GET /ming/ 状态码"

t=$(tr -d '\r\n' < /tmp/vm-ming.html | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' | head -1)
echo "      /ming/ 标题 = $t"
if [ -n "$REF" ] && [ -f "$REF" ]; then
  want=$(tr -d '\r\n' < "$REF" | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' | head -1)
  [ "$t" = "$want" ] && echo "ok    标题与已验收版本一致" || { echo "FAIL  标题不一致 期望=$want 实际=$t"; fail=$((fail+1)); }
else
  case "$t" in *"从真实问题出发"*) echo "ok    标题是作品集主标题";; *) echo "FAIL  标题不是作品集"; fail=$((fail+1));; esac
fi

for m in "从真实问题出发" "Family Space" "Public Evidence" "还没解决"; do
  if grep -q "$m" /tmp/vm-ming.html; then echo "ok    正文含「$m」"; else echo "FAIL  正文缺「$m」"; fail=$((fail+1)); fi
done

# 必须是作品集正文，不是应用的登录页（登录页特征=密码输入框或登录页标题；
# 作品集正文本身会出现“登录门/未登录”这类描述性词，不能拿它当特征）
if grep -qE 'type="password"|<title>[^<]*进入</title>' /tmp/vm-ming.html; then echo "FAIL  /ming/ 是登录页"; fail=$((fail+1)); else echo "ok    未被登录页接管（无密码框、非登录页标题）"; fi

# /ming 应 301 到 /ming/（只在自建域名那条路上适用；Pages 那面没有这层跳转）
if [ "$BASE" = "/ming" ]; then
  loc=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' --max-time 20 "$SITE$BASE")
  echo "      GET $BASE = $loc"
  case "$loc" in "301 $SITE/ming/"*) echo "ok    $BASE 规范化跳转到 $BASE/";; *) echo "FAIL  $BASE 未按预期 301"; fail=$((fail+1));; esac
fi

# PDF 名从"页面实际链到的那个"取，不写死文件名：写死会让这个检查永远测上一版文件
pdfname=$(sed -n 's/.*href="\(ming-portfolio-[0-9]*\.pdf\)".*/\1/p' /tmp/vm-ming.html | head -1)
if [ -z "$pdfname" ]; then echo "FAIL  页面里没有 ming-portfolio-*.pdf 的下载链接"; fail=$((fail+1)); pdfname=none; fi
pdf=$(curl -s -o /tmp/vm.pdf -w '%{http_code} %{size_download}' --max-time 40 "$SITE$BASE/$pdfname")
echo "      GET $BASE/$pdfname = $pdf"
pc=$(printf '%s' "$pdf" | cut -d' ' -f1); psz=$(printf '%s' "$pdf" | cut -d' ' -f2)
chk 200 "$pc" "PDF 状态码"
head -c 5 /tmp/vm.pdf | grep -q '%PDF-' && echo "ok    PDF 魔数正确（是真 PDF 不是错误页）" || { echo "FAIL  返回的不是 PDF"; fail=$((fail+1)); }
if [ -n "$REF" ] && [ -f "$(dirname "$REF")/$pdfname" ]; then
  pm=$(md5sum < "$(dirname "$REF")/$pdfname" | cut -c1-12)
  lm=$(md5sum < /tmp/vm.pdf | cut -c1-12)
  if [ "$pm" = "$lm" ]; then echo "ok    PDF 与仓库里那份逐字节一致 (md5=$pm)"; else echo "FAIL  线上 PDF 与仓库不一致 仓库=$pm 线上=$lm"; fail=$((fail+1)); fi
else
  [ "$pdfname" = "none" ] || { echo "FAIL  仓库里没有 $pdfname（页面链了一个仓库外的文件）"; fail=$((fail+1)); }
fi
if [ -n "$REF" ] && [ -f "$REF" ]; then
  a=$(tr -d '\r' < "$REF" | md5sum | cut -c1-12); b=$(tr -d '\r' < /tmp/vm-ming.html | md5sum | cut -c1-12)
  if [ "$a" = "$b" ]; then echo "ok    /ming/ 内容与本地已验收版本逐字节一致 (md5=$a)"; else echo "FAIL  线上与本地版本不一致 本地=$a 线上=$b"; fail=$((fail+1)); fi
fi

echo "---- 第二页与共用样式"
for p in lrdf.html site.css; do
  pc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$SITE$BASE/$p")
  chk 200 "$pc" "GET $BASE/$p"
done
if curl -s --max-time 25 "$SITE$BASE/lrdf.html" | grep -q '先接住'; then
  echo "ok    lrdf.html 正文是家长版（含「先接住」）"
else
  echo "FAIL  lrdf.html 正文里没有家长版内容"; fail=$((fail+1))
fi
if grep -q 'href="lrdf.html"' /tmp/vm-ming.html; then
  echo "ok    首页有指向 lrdf.html 的链接"
else
  echo "FAIL  首页没有指向 lrdf.html 的链接"; fail=$((fail+1))
fi
if grep -q 'href="site.css"' /tmp/vm-ming.html; then
  echo "ok    首页引用共用样式 site.css"
else
  echo "FAIL  首页没有引用 site.css（样式应两页共用一份）"; fail=$((fail+1))
fi

echo "---- 既有系统回归（不跟随跳转，看原始应答）----"
for u in "$SITE/" "$SITE/login" "$SITE/healthz" https://ymai.love/ https://ymai.me/ https://mingos.cn/ https://api.ymai.fun/healthz https://yueminghub.github.io/ming-portfolio/; do
  printf '%-46s %s\n' "$u" "$(curl -s -o /dev/null -w 'HTTP %{http_code} size=%{size_download} redir=%{redirect_url}' --max-time 25 "$u")"
done

# 自建面（BASE=/ming）必须把三条产品入口判成闸门：它们正是部署 /ming/ 之前记录的生产基线。
# 只列码不判定，等于"跑了但没人看"——加路由把 catch-all 反代挡掉时这里必须变红。
# 期望值是 2026-10-17 部署前在 state.before 里量到的原样；若产品自己改了首页路由，这里会红，改前先核实是谁改的。
if [ "$BASE" = "/ming" ]; then
  echo "---- 生产基线判定（部署 $BASE/ 不得改变这三条）----"
  chk 302 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$SITE/")"          "$SITE/ 状态码"
  chk "$SITE/login" "$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 25 "$SITE/")" "$SITE/ 跳转目标"
  chk 200 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$SITE/login")"     "$SITE/login 状态码"
  chk 200 "$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$SITE/healthz")"   "$SITE/healthz 状态码"
fi

echo "----"
if [ $fail -eq 0 ]; then echo "RESULT=PASS"; exit 0; else echo "RESULT=FAIL($fail)"; exit 1; fi
