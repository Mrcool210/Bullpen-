// Generates the seed gallery characters. Run: node .github/scripts/make-seed-chars.js
// WARNING: overwrites gallery/index.json and gallery/chars/ — don't run after real submissions exist.
'use strict';
function b64enc(s) { return Buffer.from(s, 'utf8').toString('base64'); }
function makeCode(hero) {
  const pack = { v: 1, app: 'bullpen', type: 'character', exportedAt: new Date().toISOString(), hero };
  return 'BPCH1-' + b64enc(JSON.stringify(pack));
}
function baseHero(over) {
  return Object.assign({
    heroName: '', realName: '', rank: 2, origin: '', occupation: '', origin2: '', occupation2: '',
    gender: '', height: '', weight: '', eyes: '', hair: '', distinguishingFeatures: '', teams: '', base: '',
    biography: '', personality: '',
    stats: { melee: 1, agility: 1, resilience: 1, vigilance: 1, ego: 1, logic: 1 },
    powers: [], traits: [], tags: [], manualPowers: [], powerSetChoices: {}, powerWeaponTypes: {},
    powerElementTypes: {}, narrativePowers: [], narrativeLimitations: [], powerToTraitConversions: 0,
    traitSrc: {}, tagSrc: {}, powerSrc: {}, size: 'Average',
  }, over);
}
const echo = baseHero({
  heroName: 'Echo', realName: 'Mara Voss', rank: 2, origin: 'Weird Science', occupation: 'Detective',
  stats: { melee: 2, agility: 2, resilience: 2, vigilance: 4, ego: 4, logic: 4 },
  powers: ['Telepathic Link', 'Mind Reading', 'ESP', 'Precognition 1', 'Danger Sense'],
  traits: ['Investigative', 'Iron Will'], tags: ['Heroic'],
  biography: 'A former missing-persons detective whose latent psychic senses awakened during a case she could not let go. Now she finds people no one else can.',
  personality: 'Quiet, relentless, and allergic to unanswered questions.',
});
const nightshade = baseHero({
  heroName: 'Nightshade', realName: 'Theo Marsh', rank: 2, origin: 'Experimentation', occupation: 'Infiltrator',
  stats: { melee: 3, agility: 5, resilience: 2, vigilance: 4, ego: 2, logic: 2 },
  powers: ['Invisibility', 'ESP', 'Telepathic Link'],
  traits: ['Sneaky', 'Free Running'], tags: ['Heroic'],
  biography: 'A lab accident bent light around Theo permanently. He uses it the way he always used his other talents: getting into places he should not be, for people who need him there.',
  personality: 'Dry wit, soft footsteps, strong opinions about locked doors.',
});
const seeds = [
  { id: 'echo-mara-voss', name: 'Echo', author: 'Bullpen Demo Vault', rank: 2,
    tagline: 'Psychic detective who finds the people no one else can.',
    powers: ['Telepathic Link', 'Mind Reading', 'ESP', 'Precognition 1', 'Danger Sense'], hero: echo },
  { id: 'nightshade-theo-marsh', name: 'Nightshade', author: 'Bullpen Demo Vault', rank: 2,
    tagline: 'Light-bending infiltrator with a soft step and a dry wit.',
    powers: ['Invisibility', 'ESP', 'Telepathic Link'], hero: nightshade },
];
for (const s of seeds) {
  const code = makeCode(s.hero);
  const pack = JSON.parse(Buffer.from(code.slice('BPCH1-'.length), 'base64').toString('utf8'));
  const h = pack.hero;
  const valid = pack.v === 1 && pack.app === 'bullpen' && pack.type === 'character' &&
    h && typeof h === 'object' && typeof h.stats === 'object' &&
    Array.isArray(h.powers) && Array.isArray(h.traits);
  if (!valid) { console.error('INVALID seed:', s.id); process.exit(1); }
  s.code = code;
}
const fs = require('fs');
const path = require('path');
const outDir = path.join(__dirname, '..', '..', 'gallery');
const charsDir = path.join(outDir, 'chars');
fs.mkdirSync(charsDir, { recursive: true });
const index = { updatedAt: new Date().toISOString(), characters: [] };
for (const s of seeds) {
  fs.writeFileSync(path.join(charsDir, s.id + '.json'), JSON.stringify({ id: s.id, code: s.code }, null, 2) + '\n');
  index.characters.push({
    id: s.id, name: s.name, author: s.author, rank: s.rank,
    tagline: s.tagline, powers: s.powers,
    submittedAt: new Date().toISOString(), file: 'chars/' + s.id + '.json',
  });
}
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log('Wrote', index.characters.length, 'seed characters.');
