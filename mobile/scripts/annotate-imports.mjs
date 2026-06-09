/**
 * Ajoute un commentaire `// Type : chemin` au-dessus de chaque import/export-from.
 * Conventions alignées sur le projet web Chronique-de-France.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = path.join(__dirname, '..', 'src');

const IMPORT_COMMENT_RE = /^\/\/ (Module|Composant|Service|API|Modèle|Auth|Hook|Store|Lib|Asset|Page) : .+$/;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function resolveLocalPath(importPath, currentFile) {
  const tryFile = (base) => {
    const candidates = [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      path.join(base, 'index.ts'),
      path.join(base, 'index.tsx'),
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
    return base;
  };

  let absolute;
  if (importPath.startsWith('@/')) {
    absolute = tryFile(path.join(SRC_ROOT, importPath.slice(2)));
  } else if (importPath.startsWith('.')) {
    absolute = tryFile(path.resolve(path.dirname(currentFile), importPath));
  } else {
    return null;
  }

  const rel = path.relative(path.join(__dirname, '..'), absolute).replace(/\\/g, '/');
  return rel.startsWith('src/') ? rel : `src/${rel}`;
}

/** Ajoute .ts/.tsx si le chemin résolu n'a pas d'extension. */
function withExtension(resolved) {
  if (/\.(ts|tsx)$/.test(resolved)) return resolved;
  if (fs.existsSync(path.join(__dirname, '..', `${resolved}.ts`))) return `${resolved}.ts`;
  if (fs.existsSync(path.join(__dirname, '..', `${resolved}.tsx`))) return `${resolved}.tsx`;
  if (fs.existsSync(path.join(__dirname, '..', resolved, 'index.ts'))) return `${resolved}/index.ts`;
  if (fs.existsSync(path.join(__dirname, '..', resolved, 'index.tsx'))) return `${resolved}/index.tsx`;
  return resolved;
}

function classify(importPath, currentFile) {
  if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
    return { type: 'Module', path: `node_modules/${importPath}` };
  }

  const resolved = resolveLocalPath(importPath, currentFile) ?? `src/${importPath.replace('@/', '')}`;
  const base = path.basename(resolved);

  // Hooks locaux (useX.ts) même dans components_V/
  if (/^use[A-Z]/.test(base) || base.startsWith('use')) {
    return { type: 'Hook', path: withExtension(resolved) };
  }

  if (resolved.includes('/components_V/') || resolved.endsWith('/components_V')) {
    return { type: 'Composant', path: withExtension(resolved) };
  }
  if (resolved.includes('/hooks/') || resolved.endsWith('/hooks')) {
    return { type: 'Hook', path: withExtension(resolved) };
  }
  if (resolved.includes('/lib/api')) return { type: 'API', path: withExtension(resolved) };
  if (resolved.includes('/lib/services')) return { type: 'Service', path: withExtension(resolved) };
  if (resolved.includes('/lib/auth')) return { type: 'Auth', path: withExtension(resolved) };
  if (resolved.includes('/store/') || resolved.endsWith('/store')) {
    return { type: 'Store', path: withExtension(resolved) };
  }
  if (resolved.includes('/models_M/')) return { type: 'Modèle', path: withExtension(resolved) };
  if (resolved.includes('/app/')) return { type: 'Page', path: withExtension(resolved) };

  if (currentFile.includes(`${path.sep}components_V${path.sep}`)) {
    return { type: 'Composant', path: withExtension(resolved) };
  }

  return { type: 'Lib', path: withExtension(resolved) };
}

function extractImportPath(statement) {
  const fromMatch = statement.match(/from\s+['"]([^'"]+)['"]/);
  if (fromMatch) return fromMatch[1];
  const sideEffect = statement.match(/import\s+['"]([^'"]+)['"]/);
  if (sideEffect) return sideEffect[1];
  return null;
}

function isImportStatement(line) {
  const t = line.trimStart();
  if (t.startsWith('import ')) return true;
  if (t.startsWith('export ') && t.includes(' from ')) return true;
  return false;
}

function isCompleteStatement(buffer) {
  const trimmed = buffer.trim();
  if (/import\s+['"][^'"]+['"]\s*;?\s*$/.test(trimmed)) return true;
  if (/from\s+['"][^'"]+['"]\s*;?\s*$/.test(trimmed)) return true;
  return false;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const lines = original.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (IMPORT_COMMENT_RE.test(line.trim())) {
      if (i + 1 < lines.length && isImportStatement(lines[i + 1])) {
        i++;
        continue;
      }
    }

    if (isImportStatement(line)) {
      while (out.length > 0 && IMPORT_COMMENT_RE.test(out[out.length - 1].trim())) {
        out.pop();
      }

      let stmt = line;
      while (!isCompleteStatement(stmt) && i + 1 < lines.length) {
        i++;
        stmt += `\n${lines[i]}`;
      }

      const importPath = extractImportPath(stmt);
      if (importPath) {
        const { type, path: p } = classify(importPath, filePath);
        out.push(`// ${type} : ${p}`);
      }
      out.push(stmt);
      i++;
      continue;
    }

    out.push(line);
    i++;
  }

  const result = out.join('\n');
  if (result !== original) {
    fs.writeFileSync(filePath, result, 'utf8');
    return true;
  }
  return false;
}

const files = walk(SRC_ROOT);
let changed = 0;
for (const f of files) {
  if (processFile(f)) {
    changed++;
    console.log('✓', path.relative(path.join(__dirname, '..'), f).replace(/\\/g, '/'));
  }
}
console.log(`\n${changed}/${files.length} fichiers modifiés.`);
