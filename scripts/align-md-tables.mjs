/**
 * Pad markdown pipe tables so | columns line up in the source.
 * Usage: node scripts/align-md-tables.mjs docs/*.md
 */
import fs from 'node:fs';
import path from 'node:path';

function parseAlign(cell) {
  const s = cell.trim();
  if (/^:[-]+:$/.test(s)) return 'center';
  if (/^[-]+:$/.test(s)) return 'right';
  if (/^:[-]+$/.test(s)) return 'left';
  return 'left';
}

function padCell(value, width, align) {
  const v = value ?? '';
  const gap = Math.max(0, width - v.length);
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    return ' '.repeat(left) + v + ' '.repeat(gap - left);
  }
  if (align === 'right') return ' '.repeat(gap) + v;
  return v + ' '.repeat(gap);
}

function separatorCell(width, align) {
  if (width < 3) width = 3;
  const dashes = '-'.repeat(width - 2);
  if (align === 'center') return `:${dashes}:`;
  if (align === 'right') return `${dashes}:`;
  return `:${dashes}`;
}

function alignTableBlock(tableLines) {
  const rows = tableLines.map((line) =>
    line
      .slice(1, line.lastIndexOf('|'))
      .split('|')
      .map((c) => c.trim())
  );
  const colCount = rows[0].length;
  const widths = Array(colCount).fill(3);
  for (const row of rows) {
    for (let c = 0; c < colCount; c++) {
      widths[c] = Math.max(widths[c], (row[c] ?? '').length);
    }
  }
  const defaultAligns = ['left', 'center', 'left', 'left', 'left'];
  const aligns =
    rows.length > 1
      ? rows[1].map((cell, c) => parseAlign(cell) ?? defaultAligns[c] ?? 'left')
      : defaultAligns.slice(0, colCount);

  return rows.map((row, ri) => {
    const cells = row.map((cell, c) => {
      const inner =
        ri === 1
          ? separatorCell(widths[c], aligns[c])
          : padCell(cell, widths[c], aligns[c]);
      return ` ${inner} `;
    });
    return `|${cells.join('|')}|`;
  });
}

function alignFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim().startsWith('|')) {
      out.push(lines[i]);
      i++;
      continue;
    }
    const block = [];
    while (i < lines.length && lines[i].trim().startsWith('|')) {
      block.push(lines[i]);
      i++;
    }
    out.push(...alignTableBlock(block));
  }
  const nl = text.endsWith('\n') ? '\n' : '';
  fs.writeFileSync(filePath, out.join('\n') + nl);
}

for (const arg of process.argv.slice(2)) {
  alignFile(path.resolve(arg));
}
