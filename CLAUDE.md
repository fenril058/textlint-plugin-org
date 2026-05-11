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
  └─► orga.parse()          (src/vendor/orga — vendored copy of orga@2.4.9)
        └─► traverse()       (src/org-to-ast.ts)
              ├─ map node types: orga names → TxtAST types  (src/mapping.ts)
              ├─ compensate columns: orga is 1-indexed, textlint is 0-indexed
              ├─ compute range/loc/raw via StructuredSource
              └─ expose url on Link nodes
  └─► TxtAST (textlint-compatible AST)
```

**Key files:**

- `src/index.ts` — plugin entry point, exports `{ Processor: OrgProcessor }`
- `src/OrgProcessor.ts` — implements the textlint Processor interface (`availableExtensions`, `preProcess`, `postProcess`)
- `src/org-to-ast.ts` — core conversion logic; traverses the orga AST in-place using `traverse`, mutating each node to conform to TxtAST. `position` is made non-enumerable after processing to prevent it from interfering with traversal.
- `src/mapping.ts` — lookup table mapping orga type strings to `@textlint/ast-node-types` constants; also defines the `OrgNode` interface
- `src/vendor/orga/` — vendored orga parser (do not edit)
- `lib/` — compiled output (committed, published to npm)

**Node type mapping** (`src/mapping.ts`):

| orga type | textlint TxtAST type |
|---|---|
| `document` | `Document` |
| `paragraph` | `Paragraph` |
| `list` | `List` |
| `list.item` | `ListItem` |
| `headline` | `Header` |
| `block` | `CodeBlock` |
| `hr` | `HorizontalRule` |
| `text.plain` | `Str` |
| `text.code` | `Code` |
| `text.bold` | `Emphasis` |
| `link` | `Link` |
| `footnote` | `FootnoteReference` |

Unmapped node types become `"UNKNOWN"`.

**Tests** use Node.js built-in test runner (`node:test`) executed via `tsx --test`, which auto-discovers files matching `*-test.ts`. Fixture `.org` files live in `test/fixtures/`.
