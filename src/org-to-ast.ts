import { parse as orga } from 'orga';
import traverse from 'traverse';
import { StructuredSource } from 'structured-source';
import { nodeTypes, textStyleNodeTypes, OrgNode } from './mapping';

export function parse(org: string): OrgNode {
  const ast = orga(org);
  const src = new StructuredSource(org);
  traverse(ast).forEach(function (node: OrgNode) {
    if (this.notLeaf) {
      delete node.parent;

      // orga v4 emits emptyLine/newline tokens throughout the tree; strip them
      if (node.type === 'emptyLine' || node.type === 'newline') {
        this.remove();
        return;
      }

      // AST node has type and position
      if (node.type && node.position) {
        if (node.type === 'text') {
          // orga v4: inline text uses a single 'text' type with an optional style
          node.type = (node.style !== undefined ? textStyleNodeTypes[node.style] : undefined) ?? nodeTypes.text;
        } else {
          node.type = nodeTypes[node.type];
        }
      }

      // Only tag nodes that carry a position — bare sub-objects (planning.timestamp,
      // data hashes, etc.) must not get a type string or @textlint/ast-traverse
      // will try to traverse them and fail on duplicate `parent` defineProperty.
      if (typeof node.type === 'undefined' && node.position !== undefined) {
        node.type = 'UNKNOWN';
      }

      // map `range`, `loc` and `raw` to node
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
        Object.defineProperty(node, "position", {
          enumerable: false,
          configurable: false,
          writable: false,
          value: position
        });
      }

      // map `url` to Link node (orga v4: URL is in node.path.value)
      if (node.type === 'Link' && node.path !== undefined) {
        node.url = node.path.value;
      }
    }
  });
  return ast;
}
