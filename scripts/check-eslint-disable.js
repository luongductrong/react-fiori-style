import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const red = (text) => `\x1b[31m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;

// resolve __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// always point to /src // always
const target = path.resolve(__dirname, '../src');

// only scan code files
const VALID_EXTENSIONS = /\.(ts|tsx|js|jsx)$/;

// ignore folders
const IGNORE_DIRS = ['node_modules', 'dist', '.git'];

let violations = [];

function scan(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (IGNORE_DIRS.includes(file)) continue;

    const full = path.join(dir, file);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      scan(full);
    } else {
      if (!VALID_EXTENSIONS.test(full)) continue;

      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.includes('eslint-disable')) {
          violations.push({
            file: full,
            line: index + 1,
            column: line.indexOf('eslint-disable') + 1,
          });
        }
      });
    }
  }
}

scan(target);

if (violations.length > 0) {
  console.error(red('\nFound forbidden eslint-disable in:\n'));

  violations.forEach(({ file, line, column }) => {
    console.error(`  - ${file}:${line}:${column}`);
  });

  console.error(red(`\n${violations.length} problem(s) (eslint-disable is banned, deal with it)\n`));
  console.error(red('(X) Lint process terminated: eslint-disable detected.'));

  process.exit(1);
} else {
  console.log(green('\nNo eslint-disable found in src directory. Continue lint process...\n'));
}
