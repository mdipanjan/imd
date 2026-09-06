import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the landing page composes the approved journal sections from reusable components', async () => {
  const home = await readSource('src/pages/index.astro');
  const layout = await readSource('src/layouts/HomeLayout.astro');

  for (const component of ['HomeIntroduction', 'CurrentFocus', 'FeaturedPost', 'PostIndex']) {
    assert.match(home, new RegExp(`import ${component} from`));
    assert.match(home, new RegExp(`<${component}`));
  }

  assert.match(home, /postViews\.slice\(1, POSTS_PER_PAGE\)/);
  assert.match(layout, /main\.home-page/);
  assert.match(layout, /padding: clamp\(3rem, 5vw, 4\.8rem\) 0/);
});

test('the landing rails keep text away from both outer canvas edges', async () => {
  const home = await readSource('src/pages/index.astro');
  const layout = await readSource('src/layouts/HomeLayout.astro');
  const focus = await readSource('src/components/home/CurrentFocus.astro');

  assert.match(layout, /--home-edge-inset: var\(--space-5\)/);
  assert.match(focus, /padding:[^;]*var\(--home-edge-inset\)/);
  assert.match(home, /padding-right: var\(--home-edge-inset\)/);
});

test('featured post taxonomy uses readable theme-coloured labels', async () => {
  const featured = await readSource('src/components/home/FeaturedPost.astro');

  assert.match(featured, /formatTaxonomy/);
  assert.match(featured, /class="featured-post__taxonomy"/);
  assert.match(featured, /footer \{[\s\S]*color: var\(--color-accent\)/);
  assert.match(featured, /footer \{[\s\S]*font-weight: var\(--weight-medium\)/);
  assert.doesNotMatch(featured, /footer \{[\s\S]*text-transform: uppercase/);
});

test('the article layout composes a left index, reading canvas, and annotation rail', async () => {
  const layout = await readSource('src/layouts/ArticleLayout.astro');

  assert.match(layout, /<ArticleIndexRail/);
  assert.match(layout, /<ArticleHeader/);
  assert.match(layout, /hasAnnotations && <AnnotationRail annotations=\{annotations\}/);
  assert.match(layout, /class:list=\{\{ 'article-layout': true/);
  assert.match(layout, /class="article-reading"/);
  assert.match(layout, /<slot \/>/);
});

test('the article route uses the production ArticleLayout', async () => {
  const route = await readSource('src/pages/posts/[...slug].astro');

  assert.match(route, /import ArticleLayout from/);
  assert.match(route, /<ArticleLayout[\s\S]*post=\{article\}/);
  assert.doesNotMatch(route, /PostLayout/);
});

test('the article index stays fixed on wide screens and becomes a disclosure on tablets', async () => {
  const rail = await readSource('src/components/article/ArticleIndexRail.astro');

  assert.match(rail, /aria-label="On this page"/);
  assert.match(rail, /position: sticky/);
  assert.match(rail, /class="article-index-disclosure"/);
  assert.match(rail, /@media \(max-width: 900px\)[\s\S]*display: none/);
  assert.match(rail, /@media \(max-width: 900px\)[\s\S]*display: block/);
});

test('the article canvas reserves semantic widths for both supporting rails', async () => {
  const layout = await readSource('src/layouts/ArticleLayout.astro');

  assert.match(layout, /var\(--width-index-rail\)/);
  assert.match(layout, /var\(--width-annotation-rail\)/);
  assert.match(layout, /article-layout--annotated/);
  assert.match(layout, /@media \(max-width: 1180px\)/);
  assert.match(layout, /@media \(max-width: 900px\)/);
});

test('ordinary article metadata lives in the header rather than the annotation rail', async () => {
  const schema = await readSource('src/content.config.ts');
  const header = await readSource('src/components/article/ArticleHeader.astro');
  const rail = await readSource('src/components/article/AnnotationRail.astro');

  assert.match(schema, /annotations: z\s*\.array/);
  assert.match(header, /Status/);
  assert.match(header, /Filed under/);
  assert.match(header, /<MetadataList items=\{metadataItems\} \/>/);
  assert.doesNotMatch(rail, /First published revision/);
  assert.doesNotMatch(rail, /Filed under/);
});

test('code blocks use a light syntax theme within the journal canvas', async () => {
  const config = await readSource('astro.config.mjs');
  const layout = await readSource('src/layouts/ArticleLayout.astro');
  const codeBlocks = await readSource('src/components/article/CodeBlocks.astro');

  assert.match(config, /shikiConfig:\s*\{[\s\S]*theme: 'github-light'/);
  assert.match(layout, /<CodeBlocks \/>/);
  assert.match(codeBlocks, /pre\[data-language\]/);
  assert.match(codeBlocks, /dataset\.copyCode/);
  assert.match(codeBlocks, /navigator\.clipboard\.writeText/);
  assert.match(codeBlocks, /Copied/);
});

test('inline sub-note markers reveal their matching right-rail annotation', async () => {
  const post = await readSource('src/content/posts/2026-04-28-first-thought.md');
  const layout = await readSource('src/layouts/ArticleLayout.astro');
  const rail = await readSource('src/components/article/AnnotationRail.astro');

  assert.match(post, /data-annotation-trigger="reading-measure"/);
  assert.match(post, /aria-controls="annotation-reading-measure"/);
  assert.match(rail, /data-annotation-note=\{annotation\.anchor\}/);
  assert.match(rail, /class="annotation-note"/);
  assert.match(rail, /\.annotation-note\.is-active/);
  assert.doesNotMatch(rail, /href=\{`#\$\{annotation\.anchor\}`\}/);
  assert.match(layout, /mouseenter/);
  assert.match(layout, /focusin/);
  assert.match(layout, /aria-expanded/);
  assert.match(layout, /--annotation-top/);
});

test('the production canvas does not float inside decorative outer bands', async () => {
  const styles = await readSource('src/styles/global.css');
  const article = await readSource('src/layouts/ArticleLayout.astro');

  assert.match(styles, /width: min\(var\(--width-site\), 100%\)/);
  assert.match(article, /width: min\(var\(--width-site\), 100%\)/);
  assert.doesNotMatch(article, /calc\(100% - var\(--page-edge\)\)/);
});
