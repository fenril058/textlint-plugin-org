import { ASTNodeTypes } from "@textlint/ast-node-types";

export const nodeTypes: Record<string, string> = {
  document: ASTNodeTypes.Document,
  paragraph: ASTNodeTypes.Paragraph,
  list: ASTNodeTypes.List,
  "list.item": ASTNodeTypes.ListItem,
  headline: ASTNodeTypes.Header,
  block: ASTNodeTypes.CodeBlock,
  hr: ASTNodeTypes.HorizontalRule,
  text: ASTNodeTypes.Str,
  link: ASTNodeTypes.Link,
  footnote: "FootnoteReference",
  "footnote.reference": "FootnoteReference",
};

export const textStyleNodeTypes: Record<string, string> = {
  bold: ASTNodeTypes.Emphasis,
  italic: ASTNodeTypes.Emphasis,
  code: ASTNodeTypes.Code,
  verbatim: ASTNodeTypes.Code,
  strikeThrough: ASTNodeTypes.Delete,
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
  style?: string;
  path?: { value: string; protocol?: string };
  children?: OrgNode[];
}
