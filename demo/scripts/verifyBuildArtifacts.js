import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const clientDir = resolve('dist/client');
const readArtifact = (path) => readFileSync(resolve(clientDir, path), 'utf8');

const llms = readArtifact('llms.txt');
assert.match(llms, /^# .+/m, 'llms.txt must contain a title');
assert.match(llms, /^## Pages$/m, 'llms.txt must contain a pages section');

const sitemap = readArtifact('sitemap-index.xml');
assert.match(sitemap, /<sitemapindex\b/, 'sitemap-index.xml must contain a sitemap index');
assert.match(sitemap, /<loc>https?:\/\//, 'sitemap-index.xml must contain at least one URL');

const generatedSitemaps = readdirSync(clientDir).filter((path) => /^sitemap-\d+\.xml$/.test(path));
for (const path of generatedSitemaps) {
  assert.doesNotMatch(readArtifact(path), /<loc>[^<]*\/404(?:_dynamic)?<\/loc>/, `${path} must not expose 404 routes`);
}

const robots = readArtifact('robots.txt');
assert.match(robots, /^User-agent: \*$/m, 'robots.txt must define a crawler policy');
assert.match(robots, /^Sitemap: https?:\/\/.+\/sitemap-index\.xml$/m, 'robots.txt must link the sitemap index');

const discovery = JSON.parse(readArtifact('.well-known/agent-skills/index.json'));
assert.ok(Array.isArray(discovery.skills) && discovery.skills.length > 0, 'agent skill discovery must publish at least one skill');

for (const skill of discovery.skills) {
  assert.equal(skill.type, 'skill-md', 'published agent skills must use skill-md');
  assert.match(skill.name, /^[a-z0-9-]+$/, 'published agent skills must have a stable name');
  assert.match(skill.url, /^\/\.well-known\/agent-skills\/[a-z0-9-]+\/SKILL\.md$/, 'published agent skills must use the discovery path');
  assert.match(skill.digest, /^sha256:[a-f0-9]{64}$/, 'published agent skills must provide a SHA-256 digest');

  const artifact = readArtifact(skill.url.slice(1));
  assert.match(artifact, /^---\nname: /, 'published agent skill must have YAML frontmatter');
  assert.match(artifact, new RegExp(`^name: ${skill.name}$`, 'm'), 'published agent skill name must match its discovery entry');
}

console.log('Generated artifacts verified.');
