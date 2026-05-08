import { ASTNodeTypes } from "@textlint/ast-node-types";

export const nodeTypes: Record<string, string> = {
  document: ASTNodeTypes.Document,
  paragraph: ASTNodeTypes.Paragraph,
  list: ASTNodeTypes.List,
  'list.item': ASTNodeTypes.ListItem,
  headline: ASTNodeTypes.Header,
  block: ASTNodeTypes.CodeBlock,
  hr: ASTNodeTypes.HorizontalRule,
  // inline block
  'text.plain': ASTNodeTypes.Str,
  'text.code': ASTNodeTypes.Code,
  'text.bold': ASTNodeTypes.Emphasis,
  link: ASTNodeTypes.Link,
  footnote: 'FootnoteReference',
};

interface LineColumn {
  line: number;
  column: number;
}
interface Loc {
  start: LineColumn;
  end: LineColumn;
}

export interface OrgNode {
  type?: string;
  position?: Loc;
  value?: string;
  url?: string;
  parent?: unknown;
  loc?: unknown;
  range?: readonly [number, number];
  raw?: string;
};
