// Community Vault intake — validates a BPCH1- code from an approved issue and publishes it.
'use strict';
const fs = require('fs');
const path = require('path');
const REPO_ROOT = path.join(__dirname, '..', '..');
const GALLERY = path.join(REPO_ROOT, 'gallery');
const PREFIX = 'BPCH1-';
const MAX_CODE_LEN = 2000000;
function fail(msg) { console.error('VAULT-INTAKE FAILED:', msg); process.exit(1); }
const body = process.env.ISSUE_BODY || '';
const issueNumber = process.env.ISSUE_NUMBER || 'unknown';
const fence = body.match(/```bullpen\s*([\s\S]*?)```/i);
if (!fence) fail('no ```bullpen fenced code block found in issue body');
const code = fence[1].replace(/\s+/g, '');
if (!code) fail('code block is empty');
if (code.length > MAX_CODE_LEN) fail('code exceeds max length');
if (!code.startsWith(PREFIX)) fail('code does not start with ' + PREFIX);
let pack;
try { pack = JSON.parse(Buffer.from(code.slice(PREFIX.length), 'base64').toString('utf8')); }
catch (e) { fail('code is not valid base64/JSON: ' + e.message); }
const h = pack && pack.hero;
if (!pack || pack.v !== 1 || pack.app !== 'bullpen' || pack.type !== 'character' ||
    !h || typeof h !== 'object' || typeof h.stats !== 'object' ||
    !Array.isArray(h.powers) || !Array.isArray(h.traits)) {
  fail('code failed schema validation (not a v1 Bullpen character)');
}
function section(title) {
  const m = body.match(new RegExp('## ' + title + '\\s*\\n([\\s\\S]*?)(?=\\n## |\\n```bullpen|$)'));
  return m ? m[1].trim() : '';
}
const author = (section('Author credit') || 'anonymous').slice(0, 80);
const tagline = (section('Tagline') || '').slice(0, 140);
const description = section('Description').slice(0, 2000);
const heroName = String(h.heroName || 'Unnamed Hero').slice(0, 80);
const rank = [1, 2, 3, 4, 5, 6].includes(Number(h.rank)) ? Number(h.rank) : 1;
const id = heroName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) + '-' + Date.now().toString(36);
fs.mkdirSync(path.join(GALLERY, 'chars'), { recursive: true });
fs.writeFileSync(path.join(GALLERY, 'chars', id + '.json'), JSON.stringify({ id, code }, null, 2) + '\n');
const indexPath = path.join(GALLERY, 'index.json');
let index = { updatedAt: '', characters: [] };
try { index = JSON.parse(fs.readFileSync(indexPath, 'utf8')); } catch (e) {}
if (!Array.isArray(index.characters)) index.characters = [];
if (index.characters.some(c => c.id === id)) fail('duplicate id ' + id);
index.updatedAt = new Date().toISOString();
index.characters.push({
  id, name: heroName, author, rank, tagline, description,
  powers: h.powers.slice(0, 8).map(String),
  submittedAt: new Date().toISOString(),
  sourceIssue: Number(issueNumber) || null,
  file: 'chars/' + id + '.json',
});
index.characters.sort((a, b) => a.name.localeCompare(b.name));
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n');
const out = process.env.GITHUB_OUTPUT;
if (out) {
  fs.appendFileSync(out, 'vault_id=' + id + '\n');
  fs.appendFileSync(out, 'vault_name=' + heroName.replace(/\n/g, ' ') + '\n');
}
console.log('VAULT-INTAKE OK:', id, '—', heroName, 'by', author);
