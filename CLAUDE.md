# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run build   # compile TypeScript → lib/
npm run watch   # compile in watch mode
npm run test    # run all tests (Node built-in runner via tsx --test)
npm run lint    # ESLint on src/**/*.ts
```

To run a single test file:
```sh
npx tsx --test test/ast-test.ts
```

Release:
```sh
npm run build
npm version patch
npm login
npm publish
```

## Architecture

This is a [textlint](https://github.com/textlint/textlint) plugin that enables linting of Org mode (`.org`) files.

**Data flow:**

```
.org text
  └─► orga.parse()          (npm package orga@4.7.1)
        └─► visit()          (src/org-to-ast.ts, via unist-util-visit)
              ├─ map node types: orga names → TxtAST types  (src/mapping.ts)
              ├─ compensate columns: orga is 1-indexed, textlint is 0-indexed
              ├─ compute range/loc/raw via StructuredSource
              ├─ flatten section nodes into their parent (orga v4 wraps headline+content)
              └─ expose url on Link nodes (orga v4: url is in node.path.value)
  └─► TxtAST (textlint-compatible AST)
```

**Key files:**

- `src/index.ts` — plugin entry point, exports `{ Processor: OrgProcessor }`
- `src/OrgProcessor.ts` — implements the textlint Processor interface (`availableExtensions`, `preProcess`, `postProcess`)
- `src/org-to-ast.ts` — core conversion logic; traverses the orga AST using `visit` from `unist-util-visit`, mutating each node to conform to TxtAST. `position` is made non-enumerable after processing to prevent it from interfering with traversal.
- `src/mapping.ts` — lookup tables mapping orga type strings to `@textlint/ast-node-types` constants (`nodeTypes` for element types, `textStyleNodeTypes` for inline text styles); also defines the `OrgNode` interface
- `lib/` — compiled output (committed, published to npm)

**Node type mapping** (`src/mapping.ts`):

Element types (`nodeTypes`):

| orga type | textlint TxtAST type |
|---|---|
| `document` | `Document` |
| `paragraph` | `Paragraph` |
| `list` | `List` |
| `list.item` | `ListItem` |
| `headline` | `Header` |
| `block` | `CodeBlock` |
| `hr` | `HorizontalRule` |
| `text` (no style) | `Str` |
| `link` | `Link` |
| `footnote` | `FootnoteReference` |
| `footnote.reference` | `FootnoteReference` |

Inline text styles (`textStyleNodeTypes`, matched on `text` nodes with a `style` property):

| orga `text` style | textlint TxtAST type |
|---|---|
| `bold` | `Emphasis` |
| `italic` | `Emphasis` |
| `code` | `Code` |
| `verbatim` | `Code` |
| `strikeThrough` | `Delete` |

Unmapped node types become `"UNKNOWN"`.

**Tests** use Node.js built-in test runner (`node:test`) executed via `tsx --test`, which auto-discovers files matching `*-test.ts`. Fixture `.org` files live in `test/fixtures/`.
