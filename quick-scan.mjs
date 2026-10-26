#!/usr/bin/env node
// quick-scan.mjs: free, zero-dependency first pass for the checklist in README.md.
// Usage: node quick-scan.mjs [repoDir]
// It counts provider-specific SDK imports and hard-coded model names per file.
// This is a rough grep, not an audit and not legal advice. It is read-only: it never modifies or uploads files.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const root = process.argv[2] || '.';
const EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.go', '.rb', '.java', '.kt', '.cs', '.php', '.rs', '.yaml', '.yml', '.json', '.toml', '.env.example']);
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.venv', 'venv', '__pycache__', '.next', 'vendor']);
const PATTERNS = {
  'openai sdk': /\b(from\s+openai\s+import|import\s+openai\b|require\(['"]openai['"]\)|from\s+['"]openai['"])/g,
  'anthropic sdk': /\b(from\s+anthropic\s+import|import\s+anthropic\b|@anthropic-ai\/sdk)/g,
  'gemini sdk': /(google\.generativeai|@google\/generative-ai|google\.genai|@google\/genai)/g,
  'bedrock sdk': /(bedrock-runtime|BedrockRuntime|client-bedrock)/g,
  'model name literal': /['"`](gpt-[\w.-]+|o[134]-[\w.-]+|claude-[\w.-]+|gemini-[\w.-]+|mistral-[\w.-]+|llama-?[\w.-]+)['"`]/g,
  'provider-specific tool format': /(tool_use|function_call|tool_choice|input_schema|functionDeclarations)/g,
};

const rows = [];
const totals = Object.fromEntries(Object.keys(PATTERNS).map((k) => [k, 0]));
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) { walk(p); continue; }
    if (!EXT.has(extname(name)) || st.size > 1_000_000) continue;
    const text = readFileSync(p, 'utf8');
    const hits = {};
    for (const [k, re] of Object.entries(PATTERNS)) {
      const n = (text.match(re) || []).length;
      if (n) { hits[k] = n; totals[k] += n; }
    }
    if (Object.keys(hits).length) rows.push([relative(root, p), hits]);
  }
}
walk(root);

console.log(`LLM vendor lock-in quick scan: ${root}`);
console.log(`files with provider-specific code: ${rows.length}`);
for (const [k, v] of Object.entries(totals)) console.log(`  ${k.padEnd(30)} ${v}`);
rows.sort((a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0));
console.log('\ntop files:');
for (const [f, h] of rows.slice(0, 15)) console.log(`  ${f}  ${JSON.stringify(h)}`);
console.log('\nNext: walk the 15-point checklist in README.md for each top file.');
console.log('Full per-file migration report + portability score: https://renevibe76.gumroad.com/l/vdmrtn?ref=gh');
