import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = join(projectRoot, '_site');
const publisherId = 'ca-pub-3013687081262680';
const adSenseSnippet = `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>\n`;
const adsterraPopunderSnippet = `  <script data-cfasync="false" src="https://abscloud.org/1/618087f3bfcc1f6c265a0166bfe1ac31"></script>\n`;
const adsterraBodyMarkup = `
<section class="adsterra-section" aria-label="Sponsored content">
  <div class="container">
    <span class="adsterra-label">Advertisement</span>
    <div class="adsterra-units">
      <div class="adsterra-unit adsterra-unit--wide">
        <script>atOptions = {'key':'ae24e92c3aeb6825ad7c4ca784614681','format':'iframe','height':90,'width':728,'params':{}};</script>
        <script src="https://bauval.org/22/ae24e92c3aeb6825ad7c4ca784614681"></script>
      </div>
      <div class="adsterra-unit adsterra-unit--desktop">
        <script>atOptions = {'key':'29811c76390aa2ff99affeeab7a023d3','format':'iframe','height':60,'width':468,'params':{}};</script>
        <script src="https://bauval.org/22/29811c76390aa2ff99affeeab7a023d3"></script>
      </div>
      <div class="adsterra-unit adsterra-unit--square">
        <script>atOptions = {'key':'65d0031ec40126aa7ffaa498436e0bd1','format':'iframe','height':250,'width':300,'params':{}};</script>
        <script src="https://bauval.org/22/65d0031ec40126aa7ffaa498436e0bd1"></script>
      </div>
      <div class="adsterra-unit adsterra-unit--rail adsterra-unit--desktop">
        <script>atOptions = {'key':'260da148f12556ecb5cff7107de698cb','format':'iframe','height':600,'width':160,'params':{}};</script>
        <script src="https://bauval.org/22/260da148f12556ecb5cff7107de698cb"></script>
      </div>
      <div class="adsterra-unit adsterra-unit--rail adsterra-unit--desktop">
        <script>atOptions = {'key':'53c3de9e23b9d887b05cccb4e5f189dd','format':'iframe','height':300,'width':160,'params':{}};</script>
        <script src="https://bauval.org/22/53c3de9e23b9d887b05cccb4e5f189dd"></script>
      </div>
      <div class="adsterra-unit adsterra-unit--mobile">
        <script>atOptions = {'key':'4c3e8af99b3951788b5ce6fcf6796222','format':'iframe','height':50,'width':320,'params':{}};</script>
        <script src="https://bauval.org/22/4c3e8af99b3951788b5ce6fcf6796222"></script>
      </div>
      <div class="adsterra-native">
        <script async="async" data-cfasync="false" src="https://bauval.org/21/a17576d42b440f34f804eb81dfd66a4f"></script>
        <div id="container-a17576d42b440f34f804eb81dfd66a4f"></div>
      </div>
      <a class="adsterra-smartlink" href="https://araplhn.org/4/58f7fc5854ea820aefb1177a69a98626" target="_blank" rel="sponsored noopener noreferrer">Sponsored link</a>
    </div>
  </div>
</section>
`;
const adsterraSocialBarSnippet = `  <script data-cfasync="false" src="https://bauval.org/14/2c1854f1b1653aa53849d153a1f6f489"></script>\n`;
const ignored = new Set(['.git', '.github', '_site', 'node_modules']);

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

for (const entry of await readdir(projectRoot, { withFileTypes: true })) {
  if (ignored.has(entry.name)) continue;
  await cp(join(projectRoot, entry.name), join(outputRoot, entry.name), { recursive: true });
}

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
  let html = await readFile(file, 'utf8');
  if (!/<\/head>/i.test(html)) {
    console.log(`Skipped non-document HTML file: ${relative(outputRoot, file)}`);
    continue;
  }
  let changed = false;
  if (!html.includes(publisherId)) {
    html = html.replace(/<\/head>/i, `${adSenseSnippet}</head>`);
    changed = true;
  }
  if (!html.includes('618087f3bfcc1f6c265a0166bfe1ac31')) {
    html = html.replace(/<\/head>/i, `${adsterraPopunderSnippet}</head>`);
    changed = true;
  }
  if (!html.includes('container-a17576d42b440f34f804eb81dfd66a4f')) {
    html = html.replace(/<footer\b/i, `${adsterraBodyMarkup}<footer`);
    changed = true;
  }
  if (!html.includes('2c1854f1b1653aa53849d153a1f6f489')) {
    html = html.replace(/<\/body>/i, `${adsterraSocialBarSnippet}</body>`);
    changed = true;
  }
  if (changed) {
    await writeFile(file, html);
    injected++;
  }
}
console.log(`Prepared ${injected} page(s) with the configured ad code.`);
