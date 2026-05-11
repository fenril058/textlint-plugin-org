import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import fs from 'node:fs';

import { TextlintKernel } from '@textlint/kernel';

import { parse } from '../src/org-to-ast';
import OrgPlugin from '../src/index';

import { nodeTypes as Syntax, textStyleNodeTypes } from '../src/mapping';

test('parse should return AST', () => {
  const result = parse(`
This is text.
  `);

  assert.equal(result.type, Syntax.document);
});

test('text should Paragraph', () => {
  const result = parse(`
This is text.
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.paragraph);
});

test('list item should List', () => {
  const result = parse(`
- List item
  `);

  const list = result.children[0];
  const listItem = list.children[0];

  assert.equal(list.type, 'List');
  assert.equal(listItem.type, Syntax['list.item']);
});

test('heading should Header', () => {
  const result = parse(`
** Heading
  `);

  const header = result.children[0];

  assert.equal(header.type, Syntax.headline);
});

test('section should be flattened into parent', () => {
  const result = parse(`
* Heading 1

Paragraph under heading.

** Heading 2

Nested paragraph.
  `);

  // section nodes are promoted: Document > [Header, Paragraph, Header, Paragraph]
  assert.equal(result.children[0].type, Syntax.headline);
  assert.equal(result.children[1].type, Syntax.paragraph);
  assert.equal(result.children[2].type, Syntax.headline);
  assert.equal(result.children[3].type, Syntax.paragraph);
});

test('begin_src should CodeBlock', () => {
  const result = parse(`
#+begin_src
const a = 1;
#+end_src
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.block);
});

test('begin_comment should Codeblock', () => {
  const result = parse(`
#+begin_comment
This is comment.
#+end_comment
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.block);
});

test('begin_quote should Codeblock', () => {
  const result = parse(`
#+begin_quote
This is quote.
#+end_quote
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.block);
});

test('horizontal should HorizontalDef', () => {
  const result = parse(`
-----
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.hr);
});

// inline ================

test('inline text should Str', () => {
  const result = parse(`
This is text.
  `);

  const paragraph = result.children[0];
  const text = paragraph.children[0];

  assert.equal(text.type, Syntax.text);
});

test('inline code should Code', () => {
  const result = parse(`
~const a = 1;~
  `);

  const paragraph = result.children[0];
  const code = paragraph.children[0];

  assert.equal(code.type, textStyleNodeTypes.code);
});

test('emphasis text should Emphasis', () => {
  const result = parse(`
*This is text.*
  `);

  const paragraph = result.children[0];
  const emphasis = paragraph.children[0];

  assert.equal(emphasis.type, textStyleNodeTypes.bold);
});

test('italic text should be Emphasis', () => {
  const result = parse('/italic/');

  const paragraph = result.children[0];
  const emphasis = paragraph.children[0];

  assert.equal(emphasis.type, textStyleNodeTypes.italic);
});

test('verbatim text should be Code', () => {
  const result = parse('=verbatim=');

  const paragraph = result.children[0];
  const code = paragraph.children[0];

  assert.equal(code.type, textStyleNodeTypes.verbatim);
});

test('strikeThrough text should be Delete', () => {
  const result = parse('+strike+');

  const paragraph = result.children[0];
  const del = paragraph.children[0];

  assert.equal(del.type, textStyleNodeTypes.strikeThrough);
});

test('link should Link', () => {
  const result = parse(`
[[http://example.com/][Example Domain]]
  `);

  const paragraph = result.children[0];
  const link = paragraph.children[0];

  assert.equal(link.type, Syntax.link);
  assert.equal(link.url, 'http://example.com/');
});

test('inline footnote reference should be FootnoteReference', () => {
  const result = parse('see [fn:1] for details');

  const paragraph = result.children[0];
  // children: [Str("see "), FootnoteReference, Str(" for details")]
  const fnRef = paragraph.children[1];

  assert.equal(fnRef.type, Syntax['footnote.reference']);
});

test('footnote should FootnoteReference', () => {
  const result = parse(`
[fn:1] This is a footnote
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.footnote);
});

test('nested list should have nested List nodes', () => {
  const result = parse('- a\n  - b\n  - c\n- d');

  const outerList = result.children[0];
  assert.equal(outerList.type, Syntax.list);

  // outer list: [ListItem("a"), List(inner), ListItem("d")]
  assert.equal(outerList.children[0].type, Syntax['list.item']);
  assert.equal(outerList.children[1].type, Syntax.list);
  assert.equal(outerList.children[2].type, Syntax['list.item']);

  // inner list items
  const innerList = outerList.children[1];
  assert.equal(innerList.children[0].type, Syntax['list.item']);
  assert.equal(innerList.children[1].type, Syntax['list.item']);
});

test('Str node should have correct range, loc, and raw', () => {
  const src = 'Hello, world.';
  const result = parse(src);

  const paragraph = result.children[0];
  const str = paragraph.children[0];

  assert.equal(str.type, Syntax.text);
  assert.equal(str.raw, 'Hello, world.');
  assert.deepEqual(str.range, [0, 13]);
  assert.deepEqual(str.loc, {
    start: { line: 1, column: 0 },
    end: { line: 1, column: 13 },
  });
});

const lintFile = (filePath: string, options = true) => {
  const kernel = new TextlintKernel();
  const text = fs.readFileSync(filePath, 'utf-8');

  return kernel.lintText(text, {
    filePath,
    ext: '.org',
    plugins: [
      {
        pluginId: 'org',
        plugin: OrgPlugin,
        options,
      },
    ],
    rules: [
      {
        ruleId: 'textlint-rule-max-comma',
        rule: require('textlint-rule-max-comma').default,
      },
    ],
  });
};

test('should report lint error', async () => {
  const fixturePath = path.join(
    __dirname,
    '/fixtures/lint-error.org',
  );

  const results = await lintFile(fixturePath);

  assert.ok(results.messages.length > 0);
  assert.equal(results.filePath, fixturePath);
});

test('should not comma check inside the code block', async () => {
  const fixturePath = path.join(
    __dirname,
    '/fixtures/codeblock-test.org',
  );

  const results = await lintFile(fixturePath);

  assert.equal(results.messages.length, 0);
});
