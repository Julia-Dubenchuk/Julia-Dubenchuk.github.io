#!/usr/bin/env node
/**
 * Base-path gate.
 *
 * This repo deploys as a GitHub Pages *project page*, so the site lives under a
 * subpath. Astro prefixes assets it compiles, but it does NOT rewrite `<a href>`,
 * links written inside content markdown, `public/` string paths, or CSS `url()`
 * references. Any root-absolute path in those positions resolves to the wrong
 * origin: it works in dev and 404s in production.
 *
 * Runs in `prebuild` (so it fails before push) and in CI.
 * `--self-test` proves the matcher still catches what it claims to.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src"];
const SCAN_EXT = new Set([".astro", ".ts", ".tsx", ".js", ".mjs", ".css", ".md", ".yaml", ".yml"]);

const RULES = [
  { name: 'href="/…"', re: /href="\// },
  { name: 'src="/…"', re: /src="\// },
  { name: "url(/…) in CSS", re: /url\(\s*['"]?\// },
  { name: "](/…) markdown link", re: /\]\(\// },
  { name: "={'/…'} expression literal", re: /=\{\s*['"]\// },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(extname(full))) out.push(full);
  }
  return out;
}

function scan() {
  const findings = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walk(join(ROOT, dir))) {
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const rule of RULES) {
          if (rule.re.test(line)) {
            findings.push({ file: relative(ROOT, file), line: i + 1, rule: rule.name, text: line.trim() });
          }
        }
      });
    }
  }
  return findings;
}

function selfTest() {
  // Deliberately bad fixtures. The gate must reject every one of these; if it
  // silently stopped matching, `astro build` would still pass and the failure
  // would only appear in production.
  const fixtures = [
    ['<a href="/cv/cv.pdf">', 'href="/…"'],
    ['<img src="/og-image.png">', 'src="/…"'],
    ["background: url(/img/texture.png);", "url(/…) in CSS"],
    ["See [my CV](/cv/cv.pdf) here.", "](/…) markdown link"],
    ["<a href={'/about'}>", "={'/…'} expression literal"],
  ];
  let ok = true;
  for (const [sample, expected] of fixtures) {
    const hit = RULES.find((r) => r.re.test(sample));
    if (!hit) {
      console.error(`  SELF-TEST FAIL: no rule matched ${JSON.stringify(sample)} (expected ${expected})`);
      ok = false;
    }
  }
  // And a control that must NOT trip: the correct, helper-routed form.
  const good = '<a href={withBase("/cv/cv.pdf")} download>';
  const falsePositive = RULES.find((r) => r.re.test(good));
  if (falsePositive) {
    console.error(`  SELF-TEST FAIL: rule ${falsePositive.name} wrongly flagged the correct form`);
    ok = false;
  }
  return ok;
}

if (!selfTest()) {
  console.error("base-path gate: SELF-TEST FAILED — the gate is not enforcing what it claims.");
  process.exit(1);
}

const findings = scan();
if (findings.length > 0) {
  console.error("base-path gate: FAILED\n");
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.rule}]\n    ${f.text}`);
  }
  console.error(`\n${findings.length} root-absolute path(s) found. Route them through withBase() / absoluteUrl()`);
  console.error("from src/data/urls.ts. These 404 in production while working in dev.\n");
  process.exit(1);
}

console.log(`base-path gate: OK (self-test passed, ${SCAN_DIRS.join(", ")} clean)`);
