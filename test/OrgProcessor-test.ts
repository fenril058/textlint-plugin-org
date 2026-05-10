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

  const section = result.children[0];
  const header = section.children[0];

  assert.equal(header.type, Syntax.headline);
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

test('link should Link', () => {
  const result = parse(`
[[http://example.com/][Example Domain]]
  `);

  const paragraph = result.children[0];
  const link = paragraph.children[0];

  assert.equal(link.type, Syntax.link);
  assert.equal(link.url, 'http://example.com/');
});

test('footnote should FootnoteReference', () => {
  const result = parse(`
[fn:1] This is a footnote
  `);

  const target = result.children[0];

  assert.equal(target.type, Syntax.footnote);
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
