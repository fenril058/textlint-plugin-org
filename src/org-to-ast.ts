import { parse as orga } from 'orga';
import { visit } from 'unist-util-visit';
import { StructuredSource } from 'structured-source';
import { nodeTypes, textStyleNodeTypes, OrgNode } from './mapping.js';
import type { Node } from 'unist';

export function parse(org: string): OrgNode {
  const ast = orga(org);
  const src = new StructuredSource(org);

  visit(ast as unknown as Node, (n: Node) => {
    const node = n as OrgNode;
    delete node.parent;

    if (node.type === 'emptyLine' || node.type === 'newline' || node.type === 'section') {
      return;
    }

    if (node.type && node.position) {
      if (node.type === 'text') {
        node.type = (node.style !== undefined ? textStyleNodeTypes[node.style] : undefined) ?? nodeTypes.text;
      } else {
        node.type = nodeTypes[node.type];
      }
    }

    if (typeof node.type === 'undefined' && node.position !== undefined) {
      node.type = 'UNKNOWN';
    }

    if (typeof node.position === 'object') {
      const position = node.position;

      // TxtNode's line start with 1
      // TxtNode's column start with 0
      const positionCompensated = {
        start: { line: position.start.line, column: position.start.column - 1 },
        end: { line: position.end.line, column: position.end.column - 1 },
      };
      const range = src.locationToRange(positionCompensated);
      node.loc = positionCompensated;
      node.range = range;
      node.raw = org.slice(range[0], range[1]);
      Object.defineProperty(node, 'position', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: position,
      });
    }

    // map `url` to Link node (orga v4: URL is in node.path.value)
    if (node.type === 'Link' && node.path !== undefined) {
      node.url = node.path.value;
    }
  });

  // Filter emptyLine/newline and flatten section nodes skipped above.
  // section wraps headline + content in orga v4 but has no TxtAST equivalent;
  // promote its children directly into the parent.
  function stripTokens(node: OrgNode): void {
    if (node.children) {
      const result: OrgNode[] = [];
      for (const child of node.children) {
        if (child === undefined || child.type === 'emptyLine' || child.type === 'newline') {
          continue;
        }
        if (child.type === 'section') {
          stripTokens(child);
          result.push(...(child.children ?? []));
        } else {
          stripTokens(child);
          result.push(child);
        }
      }
      node.children = result;
    }
  }
  stripTokens(ast);

  return ast;
}
