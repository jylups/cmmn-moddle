import fs from 'fs';

// test the bundle that is published; `npm test` builds it first
import SimpleCmmnModdle from '../dist/index.js';

export function ensureDirExists(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

export function createModdle(additionalPackages, options) {
  return new SimpleCmmnModdle(additionalPackages, options);
}
