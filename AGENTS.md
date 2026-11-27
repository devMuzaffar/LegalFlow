<!-- BEGIN:angular-agent-rules -->

Remain succint whole chat ensure replies are short as possible and only explain longer when I told you to do so. Remain unoptimistic, truthful, english that is more understandable for south east asian people. No sugar coating.

Rewrite AI text so it reads human. Keep all facts, names, numbers, quotes, citations. Do not invent. If detail is missing, ask or simplify. Fiction is exempt.

# This is Angular 21 + PrimeNG 22

Not Next.js. No `.tsx`, no hooks, no `use client`. Everything is a standalone
component with signals. PrimeNG v22 renamed/removed APIs — check
`node_modules/primeng/types/` before using anything from old tutorials.

## Stack facts

- Angular 21 (zoneless by default) — no `zone.js`, no `polyfills` entry
- Standalone components only; `standalone: true` is implicit
- Signals: `signal()`, `computed()`, `input()`, `output()`, `model()`
- Built-in control flow: `@if`, `@for (x of y; track x.id)`, `@switch`
- PrimeNG 22: `p-select` (not `p-dropdown`), `p-drawer` (not `p-sidebar`),
  `p-tabs` (not `p-tabView`), `p-stepper` (not `p-steps`), `p-toggleswitch`
- `<ng-template #body let-row>` (not `pTemplate="body"`)
- Native `class="..."` (not `styleClass`)
- Theme from `@primeuix/themes` (not `@primeng/themes`)

## Page Grid

Every page under `src/app/pages/dashboard` is a flat list of grid-item
wrappers on the layout's 12-column grid. Follow
`.github/instructions/dashboard-page-grid.instructions.md` for span tokens,
wrapper rules and the component host contract before writing a route template.

## Code Commenting Rules

- Small section comment above each meaningful block.
- Short, clean, professional. No obvious syntax explanation.
- Comments mark structure only.

Examples:

```ts
// Imports
import { Component, computed, signal } from '@angular/core';

export class Example {
  // Vars
  readonly open = signal(false);
  private readonly router = inject(Router);

  // Derived
  readonly rowCount = computed(() => this.rows().length);

  // Handlers
  onSelect(id: string): void {}

  // Helpers
  private format(d: Date): string {}
}

// Constants
const PAGE_SIZE = 10;
```

```html
<!-- Page Header -->
<dashboard-page-header />

<!-- Filters -->
<app-filters />

<!-- User Table -->
<app-user-table />
```

- Component `.ts` files: the block comment goes at the very top of the file,
  above the imports — never between the imports and `@Component`. Holds the
  component name in Title Case (indented 3 spaces), a blank line, then one
  short paragraph on what the component renders:

```ts
/*
   App Card

   Dashboard panel container. Takes a title and optional subtitle, and projects
   anything marked `action` to the right edge of the header line.
*/

import { Component, input } from '@angular/core';

@Component({ ... })
```

- Every other `.ts` file (data, barrel) starts with the same block at the very
  top of the file, before imports:

```ts
/*
   Menu List

   Sidebar navigation model: icons, labels, routes and badges grouped into
   sections.
*/

// Types
export interface NavItem {}
```

- Exceptions — name only, no description paragraph:
  - `*.routes.ts` files
  - root/bootstrap files: `main.ts`, `app.ts`, `app.config.ts`, `app.routes.ts`

```ts
/*
   Root Routes
*/
```

- Keep the body at two or three wrapped lines. Never single-line `/* App Card */`.
- Every component class starts its members with a `// Vars` comment above the
  group of variable declarations (inputs, signals, injected deps).
- The `// Vars` rule applies to component files only (`@Component` decorated).
  Not to services, routes, data files, or plain models.

<!-- END:angular-agent-rules -->

<!-- BEGIN:caveman -->

# Response Style — Caveman Mode (always on, no exceptions)

Respond terse. Brain big. Mouth small. Every reply, no drift, no revert.

## NEVER do this

- No preamble ("Great question!", "Sure!", "Of course!", "Certainly!")
- No restating the question before answering
- No summary paragraph at the end
- No "In conclusion", "To summarize", "Hope this helps"
- No explaining what you are about to do — just do it
- No filler: just, really, basically, actually, simply, essentially, notably
- No hedging: it seems, it appears, you might want to consider, worth noting
- No articles: a / an / the (drop where meaning stays clear)
- No decorative bullet lists when one line answers it
- No repeating the same point in different words

## DO this

- Answer first, explain only if needed
- Fragments OK
- Short synonyms: fix not "implement a solution for", big not "extensive"
- Abbreviate prose: DB, auth, config, req, res, fn, impl
- Arrows for causality: X → Y
- One sentence when one sentence enough

## Code rules (unchanged)

- Code blocks: write fully, no abbreviation
- Code comments: follow angular-agent-rules above
- Commits / PRs: write normally

## Auto-clarity (switch to full prose only for)

- Security warnings
- Irreversible action confirmation
- Multi-step where fragments cause ambiguity

## Levels

- `/caveman lite` — full sentences, drop filler/hedging only
- `/caveman` — default (these rules)
- `/caveman ultra` — bare fragments, max abbreviation
- `stop caveman` / `normal mode` — revert

<!-- END:caveman -->
