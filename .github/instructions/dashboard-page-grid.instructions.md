---
description: "12-column dashboard page grid. Every workspace route template is a flat list of grid-item wrappers that fill a 12-column grid owned by DashboardLayout. Use when creating, editing or scaffolding any page under src/app/pages/dashboard."
applyTo: "src/app/pages/dashboard/**/*.html,src/app/pages/dashboard/**/*.ts"
---

# Dashboard Page Grid

The page grid lives in exactly one place: `src/app/layouts/dashboard/dashboard-layout.html`.

```html
<main
  class="grid flex-1 grid-cols-12 content-start gap-4 p-4
         [&>*:not(router-outlet)]:contents
         [&>router-outlet]:hidden
         [:where(&)>*>*]:col-span-12"
>
  <router-outlet />
</main>
```

What that means for every route template:

- `main` is a 12-column grid, `gap-4` (1rem) gutters, `p-4` page padding.
- The route host element (`<app-overview>`, `<app-matters>`, …) gets `display: contents` — it produces no box.
- Every **direct child** of the route template is a grid item and defaults to `col-span-12`.
- Nested elements are *not* grid items. Only the first level under the route host participates.

Never re-create the page grid. No `grid-cols-12`, `gap-*` or `p-*` on a page root, and no wrapper div around the whole template — it would collapse to one grid item and break placement.

## Required template shape

```html
<!-- Page Header -->
<div>
  <dashboard-page-header title="Page Title" subtitle="One line of context." />
</div>

<!-- Zone 1: KPI Cards -->
<div class="sm:col-span-6 lg:col-span-3">
  <app-kpi-one />
</div>

<div class="sm:col-span-6 lg:col-span-3">
  <app-kpi-two />
</div>

<!-- Zone 2: Primary Panel -->
<div class="lg:col-span-8">
  <app-primary-panel />
</div>

<div class="lg:col-span-4">
  <app-secondary-panel />
</div>

<!-- Zone 3: Full Width -->
<div>
  <app-detail-table />
</div>
```

Rules:

1. First zone is always the page header, in a bare `<div>` (full 12).
2. One wrapper `<div>` per grid item. The span class goes on that `<div>`, never on the `<app-*>` tag.
3. The wrapper carries span classes only (plus alignment helpers like `flex items-center` when needed). Never `grid` on a page-level wrapper.
4. Full-width items use a bare `<div>` — the default `col-span-12` already applies.
5. Keep the `<!-- Zone n: ... -->` comment above each wrapper. It marks the row structure.

## Span tokens

| Blocks per row | Wrapper class                     |
| -------------- | --------------------------------- |
| 1              | *(no class — default 12)*         |
| 2 at `lg`      | `lg:col-span-6`                   |
| 3 at any width | `sm:col-span-4`                   |
| 4 (KPI row)    | `sm:col-span-6 lg:col-span-3`     |
| 2/3 + 1/3      | `lg:col-span-8` / `lg:col-span-4` |
| 3/4 + 1/4      | `lg:col-span-9` / `lg:col-span-3` |
| 5/12 + 7/12    | `lg:col-span-5` / `lg:col-span-7` |
| 6/12 + 6/12    | `lg:col-span-6` / `lg:col-span-6` |

Breakpoint ladder: base = 12 (stacked), `sm` = 640px, `lg` = 1024px.

- Use only `sm:` and `lg:` — that is what every existing page uses.
- Do not introduce `md:`, `xl:` or `2xl:` spans.
- Spans must sum to 12 at every breakpoint in a row (`sm:col-span-6 + sm:col-span-6`, `lg:col-span-8 + lg:col-span-4`).
- No `col-start-*`, `row-span-*`, `order-*` unless the design explicitly requires it.
- Never stack `col-span-*` utilities of the same breakpoint on one wrapper.

## Component host contract

A grid item stretches to its row height, but the component inside only fills it when its host asks for it. In the component `.ts`:

```ts
// Card panel — must fill the grid row (equal-height row)
host: { class: 'block h-full' },
```

```ts
// Non-card panel or table — natural height
host: { class: 'block' },
```

- Any component that renders `app-card` at its root **must** use `block h-full`. Without it, cards in the same row get unequal heights.
- Components built on `p-splitter` / internal scroll panes use flex variants (`flex h-full min-h-0 flex-col`), as the review panes do.
- Do not put span classes in the host. Sizing belongs to the page template.

## Nested grids

Only when a full-width panel needs its own columns, give the *inner* container its own grid:

```html
<div class="lg:col-span-12">
  <p-card>
    <div class="grid grid-cols-12 items-center gap-2">
      <div class="col-span-12 lg:col-span-8"><!-- search --></div>
      <div class="col-span-6 lg:col-span-2"><!-- select --></div>
      <div class="col-span-6 lg:col-span-2"><!-- select --></div>
    </div>
  </p-card>
</div>
```

Inner `col-span-*` classes stay inside that container. They never apply to the page grid. See `document-review/components/review-toolbar/review-toolbar.html`.

## New route checklist

1. Page files: `src/app/pages/dashboard/workspace/<name>/<name>.html` + `<name>.ts`, `templateUrl: './<name>.html'`.
2. Register the route in `src/app/pages/dashboard/workspace/workspace.routes.ts` with lazy `loadComponent`.
3. Add the sidebar entry in `src/app/layouts/dashboard/menu-list.ts` (`icon`, `label`, `route`).
4. Page component owns state and wiring only; panels live in `<name>/components/<panel>/` and are re-exported from `<name>/components/index.ts`.
5. Template starts with the header wrapper, then zones. No page-level layout wrapper.

## Anti-patterns

```html
<!-- ✗ page root re-creates the grid -->
<div class="grid grid-cols-12 gap-4">

<!-- ✗ single wrapper swallows all zones -->
<div class="col-span-12">
  <app-kpi-one /> <app-kpi-two />
</div>

<!-- ✗ span on the component tag, wrapper does nothing -->
<div>
  <app-kpi-one class="lg:col-span-3" />
</div>

<!-- ✗ spans that do not add up to 12 -->
<div class="lg:col-span-7"><!-- ... --></div>
<div class="lg:col-span-4"><!-- ... --></div>

<!-- ✗ non-existent breakpoint for this codebase -->
<div class="md:col-span-6 xl:col-span-3">
```

```ts
// ✗ card component without h-full → ragged row heights
host: { class: 'block' },
```
