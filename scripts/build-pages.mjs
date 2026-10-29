import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(projectRoot, '_site');
const publisherId = 'ca-pub-3013687081262680';
const snippet = `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>\n`;

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

await cp(projectRoot, outputRoot, {
  recursive: true,
  filter(source) {
    const name = basename(source);
    return !['.git', '.github', '_site', 'node_modules'].includes(name);
  }
});

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(fullPath));
    if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

let injected = 0;
for (const file of await htmlFiles(outputRoot)) {
  const html = await readFile(file, 'utf8');
  if (html.includes(publisherId)) continue;
  if (!/<\/head>/i.test(html)) throw new Error(`Missing </head> in ${relative(outputRoot, file)}`);
  await writeFile(file, html.replace(/<\/head>/i, `${snippet}</head>`));
  injected++;
}
console.log(`Prepared ${injected} page(s) with the AdSense review code.`);
