#!/usr/bin/env bash
# 生成发布验证记录：把每条检查的命令与原始输出一起落盘，便于复跑与对账。
# 用法：bash tools/record-verification.sh
# 敏感自检放在最后，扫的是"即将发布的那份文件"本身——先写临时文件、扫完再落地，
# 否则边生成边扫会扫到空文件或半成品，得到假绿。
set -uo pipefail
SITE="https://yueminghub.github.io/ming-portfolio/"
FUN="https://ymai.fun/ming/"
CDP_PORT="${CDP_PORT:-9333}"
R="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$R/evidence/VERIFICATION.md"
TMP="$R/evidence/.VERIFICATION.tmp"
# 报警必须往结构里传：内层任一判据红了，本装置退出码非 0，不能只把红写在文件里等人读。
AUDIT_FAIL=0; SURFACE_FAIL=0; LEAK_FAIL=0
mkdir -p "$R/evidence"
AUD="node $(cygpath -m "$R/tools/audit-browser.mjs" 2>/dev/null || echo "$R/tools/audit-browser.mjs")"

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
  echo "## 2. 备份面内容与提交内容逐字节一致"
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
  bash "$R/tools/verify-links.sh" "$SITE"; BL=$?
  echo "verify-links.sh 退出码=$BL"
  [ "$BL" = 0 ] || SURFACE_FAIL=$((SURFACE_FAIL+1))
  echo '```'
  echo
  echo "## 4. 既有生产站回归（作品集发布不得影响它们）"
  echo
  echo '```text'
  ming=""
  for u in https://ymai.fun/ "$FUN" https://ymai.love/ https://ymai.me/ https://mingos.cn/; do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 25 "$u")
    printf '%-26s ' "$u"; echo "HTTP $code"
    case "$u" in *"/ming/") ming=$code ;; esac
  done
  echo '$ gh api repos/YuemingHub/World-Space/commits/main'
  gh api repos/YuemingHub/World-Space/commits/main --jq '.sha[0:7] + " " + (.commit.message | split("\n")[0])'
  echo '```'
  echo
  # 结论由上面量到的码推导，不写死句子——写死的说明会在下一次部署后变成假话。
  if [ "$ming" = 200 ]; then
    echo "> 结论（由上面实测的 $ming 推导）：正式面 $FUN 已生效，由该域名所在服务器的 nginx 从独立静态目录直接提供，与备份面各自独立。"
  else
    echo "> 结论（由上面实测的 $ming 推导）：正式面 $FUN 返回 $ming，非 200，正式入口未生效——检查服务器路由，只以备份面为准。"
    SURFACE_FAIL=$((SURFACE_FAIL+1))
  fi
  echo "> 旧页面：World-Space 仓库 main 分支上的历史文件未删除；该域名此前对 /ming/ 的 404 由其应用自己答，与作品集仓库无关。"
  echo
  echo "## 5. 真实浏览器量测（tools/audit-browser.mjs 原始输出，两个发布面各跑一遍）"
  echo
  echo "外部浏览器连接器（Qoder Browser Connector）本机未就绪，改用本机 Chrome 无头 + CDP 驱动线上地址，"
  echo "量的是公网渲染结果而非本地文件。截图见同目录各 png（正式面前缀 fun-，备份面无前缀）。"
  echo
  for pre in "fun-" ""; do
    url="$SITE"; [ "$pre" = "fun-" ] && url="$FUN"
    echo '```text'
    echo "\$ $AUD $url $CDP_PORT \"$pre\""
    ab=$(node "$(cygpath -m "$R/tools/audit-browser.mjs" 2>/dev/null || echo "$R/tools/audit-browser.mjs")" "$url" "$CDP_PORT" "$pre" 2>&1); rc=$?
    printf '%s\n' "$ab"
    echo "退出码=$rc"
    [ "$rc" = 0 ] || { echo "结论=该面量测未通过，见上"; AUDIT_FAIL=$((AUDIT_FAIL+1)); }
    echo '```'
    echo
  done
  echo "## 6. 交付 PDF 客观参数"
  echo
  echo '```text'
  pdf=$(ls "$R"/evidence/ming-portfolio-*.pdf 2>/dev/null | tail -1)
  if [ -n "$pdf" ]; then
    echo "文件=$(basename "$pdf") 字节=$(wc -c < "$pdf")"
    echo "页数=$(grep -ao '/MediaBox' "$pdf" | wc -l)（A4 单页）"
    # 可点链接数按 /Subtype /Link 数，不按 /URI —— /URI 这个 token 在每个注释里出现不止一次，
    # 上一版拿它当"可点链接数"报过 42，实际注释只有 22 个（同页锚点数对不上就是这个原因）
    echo "可点链接注释=$(grep -ao '/Subtype /Link' "$pdf" | wc -l)（按 /Subtype /Link 计）"
    echo "  对照：/URI token=$(grep -ao '/URI' "$pdf" | wc -l)（不是链接数，每注释出现多次，只作记录）"
    echo "  对照：页面锚点 外部=$(grep -o 'href=\"https\\?://[^\"]*\"' "$R/index.html" | wc -l) 页内=$(grep -o 'href=\"#[^\"]*\"' "$R/index.html" | wc -l) PDF=$(grep -o 'href=\"ming-portfolio[^\"]*\"' "$R/index.html" | wc -l)"
    echo "  期望关系：注释数 = 外部 + PDF 相对（页内 # 锚点在纸上没有可跳目标，不进注释）"
    echo "页面尺寸=$(grep -ao '/MediaBox \[[^]]*\]' "$pdf" | head -1)（594.96x841.92pt = A4）"
    echo "内嵌字体=$(grep -ao '/BaseFont /[A-Za-z0-9+-]*' "$pdf" | sed 's|/BaseFont */||; s/^[A-Z]*+//' | sort -u | tr '\n' ' ')"
  else
    echo "evidence/ 下没有 ming-portfolio-*.pdf，跳过（PDF 由线上地址打印生成，不重复入库）"
  fi
  echo '```'
  echo
  echo "## 7. 两个发布面逐条验收（tools/verify-surface.sh 原始输出）"
  echo
  echo '```text'
  echo "### 正式面 $FUN"
  bash "$R/tools/verify-surface.sh" "$R/index.html"; S1=$?
  echo "退出码=$S1"; [ "$S1" = 0 ] || SURFACE_FAIL=$((SURFACE_FAIL+1))
  echo
  echo "### 备份面 $SITE"
  SITE=https://yueminghub.github.io BASE=/ming-portfolio bash "$R/tools/verify-surface.sh" "$R/index.html"; S2=$?
  echo "退出码=$S2"; [ "$S2" = 0 ] || SURFACE_FAIL=$((SURFACE_FAIL+1))
  echo '```'
} > "$TMP"

# —— 敏感自检：对象是上面已经写完的那份文件 + 其余公开面 ——
{
  echo
  echo "## 8. 敏感信息自检（扫的是上面刚生成的这份待发布文件，含它自己）"
  echo
  echo '```text'
  ALL="$R/index.html $R/README.md $TMP $R/tools/verify-links.sh $R/tools/verify-surface.sh $R/tools/audit-browser.mjs"
  scan=$(ls -1 $ALL 2>/dev/null)
  echo "扫描文件（$(printf '%s\n' "$scan" | grep -c .) 个，逐个点名）："
  printf '%s\n' "$scan" | sed 's|.*/||' | tr '\n' ' '; echo
  echo "      其中的 $(basename "$TMP") 就是本文件落地前的临时体（改名后发布为 $(basename "$OUT")），扫它=扫第 1–7 节全文"
  echo "      本节与第 9 节在扫描之后才追加；它们只打印类别与命中行，不含模式原文"
  echo "排除：tools/record-verification.sh —— 本装置自身就写着这些模式串，不排除会把自己当泄露（实测会把 7 处模式定义扫成命中）"
  pat='([A-Za-z0-9_/-]*(token|secret|password|passwd|api[_-]?key|access[_-]?key)[A-Za-z0-9_/-]*[":= ]+[A-Za-z0-9_-]{8,})|(ghp_[A-Za-z0-9]{20,})|(sk-[A-Za-z0-9]{16,})|(tvly-[A-Za-z0-9-]{10,})|(as_sk_[A-Za-z0-9]{10,})|(BEGIN [A-Z ]*PRIVATE KEY)'
  hits=$(grep -nEi "$pat" $ALL 2>/dev/null || true)
  hc=$(printf '%s' "$hits" | grep -c .)
  echo "凭据形状命中=$hc"
  [ -n "$hits" ] && printf '%s\n' "$hits"
  leak='(39\.107\.[0-9]+\.[0-9]+|/var/www/|/etc/nginx|/root/backups|10\.254\.[0-9]+\.[0-9]+|ymai\.fun-static)'
  lk=$(grep -nEo "$leak" $ALL 2>/dev/null || true)
  lc=$(printf '%s' "$lk" | grep -c .)
  echo "生产布局形状命中=$lc"
  echo "      判据覆盖六类：ECS 公网 IP、服务器 web 根目录、nginx 配置目录、机上备份目录、隧道内网段、静态根命名"
  [ -n "$lk" ] && printf '%s\n' "$lk"
  [ "$hc" = 0 ] && [ "$lc" = 0 ] || LEAK_FAIL=1
  echo '```'
  echo
  echo "## 9. 本装置汇总判定（由上面各段退出码推导）"
  echo
  echo '```text'
  echo "浏览器量测未通过的面数=$AUDIT_FAIL  链接/发布面/正式面判据未通过数=$SURFACE_FAIL  敏感自检命中=$LEAK_FAIL"
  RC=$((AUDIT_FAIL + SURFACE_FAIL + LEAK_FAIL))
  if [ "$RC" = 0 ]; then echo "总判定=全部判据通过"; else echo "总判定=有判据未通过，见对应段落"; fi
  echo '```'
} >> "$TMP"

mv "$TMP" "$OUT"
echo "written: $OUT ($(wc -c < "$OUT") bytes)"
echo "总退出码=$RC（0=上面所有判据均通过）"
[ "$RC" = 0 ] || echo "结论=本轮验收有判据为红，不得宣布发布成功"
exit "$RC"
