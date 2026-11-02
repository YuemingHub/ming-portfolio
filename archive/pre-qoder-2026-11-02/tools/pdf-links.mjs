// 交付 PDF 的链接注释分类器：把每个 /Subtype /Link 注释按「带 URI」/「带页内 /Dest」拆开数，
// 顺带报页数。record-verification.sh 的第 6 节调它，避免用 grep 猜注释构成。
// 用法：node tools/pdf-links.mjs <pdf 路径>
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.log('用法: node tools/pdf-links.mjs <pdf>'); process.exit(2); }
const s = fs.readFileSync(file).toString('latin1');

const dicts = [...s.matchAll(/<<((?:[^<>]|<<[^<>]*>>){0,600}?)>>/g)].map(m => m[1]).filter(d => /\/Subtype\s*\/Link/.test(d));
const uri = dicts.filter(d => /\/URI/.test(d));
const dest = dicts.filter(d => !/\/URI/.test(d) && /\/Dest/.test(d));
const pages = (s.match(/\/Type\s*\/Page\b(?!s)/g) || []).length;

console.log(`file=${file.split(/[\\/]/).pop()}`);
console.log(`bytes=${fs.statSync(file).size} pages=${pages}`);
console.log(`Link=${dicts.length} URI=${uri.length} Dest=${dest.length} Neither=${dicts.length - uri.length - dest.length}`);
console.log('带页内 Dest 的注释目标=' + [...new Set(dest.map(d => (d.match(/\/Dest\s*\/([A-Za-z0-9_-]+)/) || [])[1] || '?'))].join(' '));
console.log('带 URI 的链接：');
uri.map(d => (d.match(/\/URI\s*\((.*?)\)\s*(?:\/S|>>)/) || [])[1] || '?').forEach(u => console.log('  ' + u));
