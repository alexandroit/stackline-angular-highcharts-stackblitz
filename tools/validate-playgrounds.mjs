import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const majors = Array.from({ length: 14 }, (_, index) => index + 9);

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const major of majors) {
  const directory = path.join(repositoryRoot, `angular-${major}`);
  const manifestFile = path.join(directory, 'package.json');

  assert(existsSync(manifestFile), `Missing Angular ${major} manifest`);

  const manifest = readJson(manifestFile);
  const angularDependencies = Object.entries({
    ...(manifest.dependencies || {}),
    ...(manifest.devDependencies || {})
  }).filter(([name]) => name.startsWith('@angular/'));

  assert(manifest.private === true, `Angular ${major} must stay private`);
  assert(manifest.scripts?.start, `Angular ${major} must expose a start command`);
  assert(manifest.scripts?.build, `Angular ${major} must expose a build command`);
  assert(angularDependencies.length > 0, `Angular ${major} has no Angular dependencies`);

  for (const [name, version] of angularDependencies) {
    assert(
      Number.parseInt(String(version).match(/\d+/)?.[0], 10) === major,
      `${name} must stay on Angular ${major}, found ${version}`
    );
  }

  const wrapperVersion = manifest.dependencies?.['@stackline/angular-highcharts'];
  if (major === 22) {
    assert(wrapperVersion === 'file:packages/angular-highcharts',
      'Angular 22 must use the self-contained wrapper package');
  } else {
    assert(wrapperVersion === `${major}.0.0`,
      `Angular ${major} must use wrapper ${major}.0.0`);
  }

  const expectedHighcharts = major <= 11 ? '10.3.3' : '12.6.0';
  assert(manifest.dependencies?.highcharts === expectedHighcharts,
    `Angular ${major} must use Highcharts ${expectedHighcharts}`);
}

const currentRoot = path.join(repositoryRoot, 'angular-22');
const currentManifest = readJson(path.join(currentRoot, 'package.json'));
const currentLock = readJson(path.join(currentRoot, 'package-lock.json'));
const lockRoot = currentLock.packages?.[''];
const embeddedPackage = readJson(
  path.join(currentRoot, 'packages', 'angular-highcharts', 'package.json')
);
const stackblitz = readJson(path.join(repositoryRoot, '.stackblitzrc'));
const staticBundle = readFileSync(
  path.join(currentRoot, 'stackblitz-static', 'main.js'),
  'utf8'
);

assert(currentLock.lockfileVersion === 3, 'Angular 22 must use npm lockfile v3');
assert(lockRoot?.name === currentManifest.name,
  'Angular 22 manifest and lock names differ');
assert(isDeepStrictEqual(lockRoot.dependencies || {}, currentManifest.dependencies || {}),
  'Angular 22 runtime dependencies differ from the lockfile');
assert(isDeepStrictEqual(lockRoot.devDependencies || {}, currentManifest.devDependencies || {}),
  'Angular 22 development dependencies differ from the lockfile');
assert(embeddedPackage.version === '22.1.1',
  `Expected embedded wrapper 22.1.1, found ${embeddedPackage.version}`);
assert(stackblitz.startCommand === 'cd angular-22 && npm start',
  'The repository default must open the maintained Angular 22 playground');
assert(staticBundle.includes('Angular CLI 22.1.5 / Angular 22.1.3 runtime'),
  'The static fallback must match the maintained Angular toolchain');
assert(staticBundle.includes('@stackline/angular-highcharts 22.1.1'),
  'The static fallback must match the embedded wrapper version');

process.stdout.write('Validated 14 StackBlitz playgrounds; Angular 22 is reproducible.\n');
