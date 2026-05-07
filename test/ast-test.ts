import assert from 'node:assert/strict';
import test from 'node:test';

import {
  test as testAST,
  isTxtAST,
} from '@textlint/ast-tester';

import { parse } from '../src/org-to-ast';

test('compatible for Unist should have position', () => {
  const AST = parse('text');

  // if the AST is invalid, then throw Error
  testAST(AST);

  assert.equal(isTxtAST(AST), true);

  assert.equal(typeof AST.position, 'object');

  assert.equal(typeof AST.position.start, 'object');
  assert.equal(typeof AST.position.start.line, 'number');
  assert.equal(typeof AST.position.start.column, 'number');

  assert.equal(typeof AST.position.end, 'object');
  assert.equal(typeof AST.position.end.line, 'number');
  assert.equal(typeof AST.position.end.column, 'number');
});
