import assert from "node:assert/strict";
import test from "node:test";

import { test as testAST, isTxtAST } from "@textlint/ast-tester";
import { parse as parseOrg } from "orga";

import { parse } from "../src/org-to-ast";

test("compatible for Unist should have position", () => {
  const AST = parse("text");

  // if the AST is invalid, then throw Error
  testAST(AST);

  assert.equal(isTxtAST(AST), true);

  assert.equal(typeof AST.position, "object");

  assert.equal(typeof AST.position.start, "object");
  assert.equal(typeof AST.position.start.line, "number");
  assert.equal(typeof AST.position.start.column, "number");

  assert.equal(typeof AST.position.end, "object");
  assert.equal(typeof AST.position.end.line, "number");
  assert.equal(typeof AST.position.end.column, "number");
});

// Regression test: multiline paragraphs previously left newline nodes with
// range=undefined, causing TypeError in rules that use sentence-splitter.
test("multiline paragraph should produce a valid AST", () => {
  const AST = parse(`Line one.
Line two.
Line three.
`);
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

// Regression test: documents with #+KEYWORD lines and headings should not
// leave any node without a range.
test("document with keyword and heading should produce a valid AST", () => {
  const AST = parse(`#+TITLE: Test title

* Heading

Paragraph under heading.
`);
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

test("document with all inline styles should produce a valid AST", () => {
  const AST = parse("*bold* /italic/ ~code~ =verbatim= +strike+");
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

test("nested list should produce a valid AST", () => {
  const AST = parse("- item1\n  - nested\n- item2");
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

test("link should produce a valid AST", () => {
  const AST = parse("[[http://example.com/][Example Domain]]");
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

test("inline footnote reference should produce a valid AST", () => {
  const AST = parse("see [fn:1] for details");
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

test("empty string should produce a valid AST", () => {
  const AST = parse("");
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

test("ordered list should produce a valid AST", () => {
  const AST = parse("1. first\n2. second");
  testAST(AST);
  assert.equal(isTxtAST(AST), true);
});

for (const [keyword, timestamp] of [
  ["SCHEDULED", "<2026-01-05 Mon 10:00>"],
  ["DEADLINE", "<2026-01-05 Mon>--<2026-01-09 Fri>"],
  ["CLOSED", "[2026-01-05 Mon 10:00]"],
  ["SCHEDULED", "<2026-01-05 Mon 10:00 +1w>"],
  ["DEADLINE", "<2026-01-09 Fri -2d>"],
  ["DEADLINE", "not-a-timestamp"],
]) {
  test(`${keyword}: ${timestamp} should have a string token value`, () => {
    const heading = "* TODO Task\n";
    const source = `${heading}${keyword}: ${timestamp}\n\nParagraph.\n`;
    const AST = parse(source);
    const planning = AST.children[1];
    const token = planning.children[1];

    assert.equal(token.value, timestamp);
    assert.equal(token.raw, timestamp);
    assert.deepEqual(token.range, [
      heading.length + keyword.length + 2,
      heading.length + keyword.length + 2 + timestamp.length,
    ]);
    assert.deepEqual(token.loc, {
      start: { line: 2, column: keyword.length + 2 },
      end: { line: 2, column: keyword.length + 2 + timestamp.length },
    });

    // Keep parsed timestamp metadata on the planning node.
    const section = parseOrg(source).children[0];
    assert.ok(section.type === "section");
    const original = section.children[1];
    assert.ok(original.type === "planning");
    assert.equal(original.timestamp === undefined, timestamp === "not-a-timestamp");
    assert.deepEqual(Reflect.get(planning, "timestamp"), original.timestamp);
    testAST(AST);
  });
}

test("multiple planning timestamps should exclude surrounding whitespace", () => {
  const source =
    "* TODO Task\nSCHEDULED:  <2026-01-05 Mon>  DEADLINE: <2026-01-09 Fri>  \n\nParagraph.\n";
  const AST = parse(source);
  const scheduled = AST.children[1].children[1];
  const deadline = AST.children[2].children[1];

  assert.equal(scheduled.value, "<2026-01-05 Mon>");
  assert.equal(deadline.value, "<2026-01-09 Fri>");
  assert.equal(scheduled.raw, "<2026-01-05 Mon>");
  assert.equal(deadline.raw, "<2026-01-09 Fri>");
  assert.equal(scheduled.raw, source.slice(...scheduled.range));
  assert.equal(deadline.raw, source.slice(...deadline.range));
  testAST(AST);
});
