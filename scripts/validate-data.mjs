import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const currentDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(currentDir, '..');
const datasetPath = resolve(projectRoot, 'src/data/mythology.json');
const dataset = JSON.parse(readFileSync(datasetPath, 'utf8'));

const collections = ['gods', 'realms', 'creatures', 'artifacts', 'myths', 'sagaFragments'];
const requiredHomepageIds = ['odin', 'thor', 'loki', 'freyja', 'asgard', 'midgard', 'jotunheim', 'helheim'];
const errors = [];

function fail(message) {
  errors.push(message);
}

function assertString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${label} must be a non-empty string`);
  }
}

function assertNumber(value, label, min, max) {
  if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
    fail(`${label} must be a number between ${min} and ${max}`);
  }
}

if (!Array.isArray(dataset.imageCredits) || dataset.imageCredits.length === 0) {
  fail('imageCredits must be a non-empty array');
}

const creditIds = new Set();
for (const credit of dataset.imageCredits ?? []) {
  assertString(credit.id, 'imageCredit.id');
  assertString(credit.title, `imageCredit.${credit.id}.title`);
  assertString(credit.author, `imageCredit.${credit.id}.author`);
  assertString(credit.sourceName, `imageCredit.${credit.id}.sourceName`);
  assertString(credit.sourceUrl, `imageCredit.${credit.id}.sourceUrl`);
  assertString(credit.license, `imageCredit.${credit.id}.license`);
  assertString(credit.licenseUrl, `imageCredit.${credit.id}.licenseUrl`);
  creditIds.add(credit.id);
}

const allEntries = [];

for (const collectionName of collections) {
  const collection = dataset[collectionName];

  if (!Array.isArray(collection) || collection.length === 0) {
    fail(`${collectionName} must be a non-empty array`);
    continue;
  }

  for (const entry of collection) {
    allEntries.push(entry);
    assertString(entry.id, `${collectionName}.id`);
    assertString(entry.title, `${entry.id}.title`);
    assertString(entry.category, `${entry.id}.category`);
    assertString(entry.type, `${entry.id}.type`);
    assertString(entry.realmId, `${entry.id}.realmId`);
    assertString(entry.description, `${entry.id}.description`);
    assertNumber(entry.rating, `${entry.id}.rating`, 0, 5);
    assertNumber(entry.dangerLevel, `${entry.id}.dangerLevel`, 0, 10);

    if (typeof entry.discovered !== 'boolean') {
      fail(`${entry.id}.discovered must be a boolean`);
    }

    if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
      fail(`${entry.id}.tags must be a non-empty array`);
    }

    if (!entry.image) {
      fail(`${entry.id}.image is required`);
      continue;
    }

    assertString(entry.image.url, `${entry.id}.image.url`);
    assertString(entry.image.alt, `${entry.id}.image.alt`);
    assertString(entry.image.creditId, `${entry.id}.image.creditId`);

    if (entry.image?.creditId && !creditIds.has(entry.image.creditId)) {
      fail(`${entry.id}.image.creditId references missing credit ${entry.image.creditId}`);
    }
  }
}

const entryIds = new Set(allEntries.map((entry) => entry.id));

for (const requiredId of requiredHomepageIds) {
  if (!entryIds.has(requiredId)) {
    fail(`Required homepage entry missing: ${requiredId}`);
  }
}

for (const recommendation of dataset.recommendations ?? []) {
  assertString(recommendation.id, 'recommendation.id');
  assertString(recommendation.title, `${recommendation.id}.title`);
  assertString(recommendation.targetEntryId, `${recommendation.id}.targetEntryId`);
  assertNumber(recommendation.minRating, `${recommendation.id}.minRating`, 0, 5);
  assertNumber(recommendation.minCompletion, `${recommendation.id}.minCompletion`, 0, 100);

  if (!entryIds.has(recommendation.targetEntryId)) {
    fail(`${recommendation.id}.targetEntryId references missing entry ${recommendation.targetEntryId}`);
  }

  if (!Array.isArray(recommendation.requiredTags) || recommendation.requiredTags.length === 0) {
    fail(`${recommendation.id}.requiredTags must be a non-empty array`);
  }
}

for (const discovery of dataset.userDiscoveries ?? []) {
  assertString(discovery.id, 'userDiscovery.id');
  assertString(discovery.entryId, `${discovery.id}.entryId`);

  if (!entryIds.has(discovery.entryId)) {
    fail(`${discovery.id}.entryId references missing entry ${discovery.entryId}`);
  }
}

for (const activity of dataset.explorationActivity ?? []) {
  assertString(activity.id, 'activity.id');
  assertString(activity.actor, `${activity.id}.actor`);
  assertString(activity.action, `${activity.id}.action`);
  assertString(activity.entryId, `${activity.id}.entryId`);

  if (!entryIds.has(activity.entryId)) {
    fail(`${activity.id}.entryId references missing entry ${activity.entryId}`);
  }
}

if (errors.length > 0) {
  console.error('Data validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Data validation passed for ${allEntries.length} mythology entries and ${creditIds.size} image credits.`);
