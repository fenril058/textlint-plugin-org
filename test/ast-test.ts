import assert from "node:assert/strict";
import test from "node:test";

import { test as testAST, isTxtAST } from "@textlint/ast-tester";

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
