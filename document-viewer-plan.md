Copy-paste spec below straight into Antigravity. Zero fluff, exact constraints so agent does not break Angular v22 / PrimeNG v22 syntax.

---

# Implementation Plan: `/document-review` (Review & Search Workspace)

## 1. Strict Stack & Guardrails

* **Use existing project setup:** Angular v22+ (standalone, Signals, `ChangeDetectionStrategy.OnPush`, `@if`/`@for`), Tailwind CSS, PrimeNG v20–22 (`@primeuix/themes`).
* **PrimeNG v22 syntax only:**
* Import standalone components (`Splitter`, `Paginator`, `SelectButton`, `ToggleSwitch`, `Select`, `Tag`, `Button`, `InputText`, `Textarea`, `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`).
* Use `<ng-template #panel>` — **never** `pTemplate` or `styleClass`. Use standard `class="..."`.


* **Hard exclusions:**
* **NO** Supabase / backend API calls (static in-memory state only).
* **NO** CDK Virtual Scroll (use custom cards + `p-paginator`, 10 rows/page).
* **NO** `p-table` in left pane (crushes on laptop screens).
* **NO** `pdf.js` (HTML email threads + plain text viewer only).
* **NO** `[innerHTML]` for text highlights (slice canonical text into typed segments and render with `@for` + `<mark>`).



---

## 2. Data Contracts & Deterministic Mock Dataset

Create `src/app/features/document-review/models/review.models.ts` and `data/mock-documents.data.ts`.

```ts
export type SourceType = 'EMAIL' | 'PDF' | 'CHAT';
export type FindingType = 'PII' | 'PHI' | 'PRIVILEGE';
export type FindingStatus = 'PENDING' | 'CONFIRMED' | 'REVERSED';
export type Responsiveness = 'UNREVIEWED' | 'RESPONSIVE' | 'NON_RESPONSIVE' | 'FURTHER_REVIEW';
export type PrivilegeTag = 'NONE' | 'ATTORNEY_CLIENT' | 'WORK_PRODUCT';
export type SearchMode = 'semantic' | 'boolean';
export type FilterChip = 'all' | 'threads' | 'pii' | 'privileged' | 'unreviewed';

export interface MockEmailMessage {
  id: string;
  sender: string;
  recipients: string[];
  body: string; // canonical immutable string — never mutate
  sentAt: string;
}

export interface MockAIFinding {
  id: string;
  messageId: string;
  start: number; // exact char index in message.body
  end: number;   // exact char index in message.body
  type: FindingType;
  confidence: number; // 0-100
  status: FindingStatus;
  decisionReason?: string;
}

export interface DocumentCoding {
  responsiveness: Responsiveness;
  privilege: PrivilegeTag;
  notes: string;
}

export interface ReviewDocument {
  id: string; // e.g., DOC-44871
  matterId: string; // e.g., MTR-2026-01
  custodianId: string; // e.g., sarah-chen
  custodianName: string;
  sourceType: SourceType;
  subject: string;
  receivedAt: string;
  threadCount: number;
  checksum: string; // 64-char mock SHA-256
  messages: MockEmailMessage[];
  findings: MockAIFinding[];
  coding: DocumentCoding;
}

export interface ReviewAuditEvent {
  id: string;
  timestamp: string;
  actorRole: 'Matter Admin' | 'Lead Reviewer';
  action: 'AI_CONFIRMED' | 'AI_REVERSED' | 'CODING_SAVED' | 'PRIVILEGE_CODED';
  docId: string;
  detail: string;
  hash: string;
}

```

**Mock Dataset Rules (Deterministic — Never Randomize on Load):**

* Author **20 curated documents** under matter `MTR-2026-01` (`FinCorp Data Breach`), distributed across exact Overview custodians: `Sarah Chen`, `Marcus Webb`, `Priya Nair`, `David Okafor`, `Lena Fischer`.


* Include 8–10 multi-message email threads (2–4 messages each), plus single PDFs and chat logs.
* Include exact character `start`/`end` offsets for realistic `PII` (SSN, personal email, account number), `PHI` (medical leave/claim note), and `PRIVILEGE` ("seeking legal counsel", "privileged draft"). Verify every `body.slice(start, end)` matches intended phrase cleanly.

---

## 3. State Architecture (Root Store + URL Sync + `linkedSignal`)

**1. Shared Root Store (`providedIn: 'root'`)**

* Use `@ngrx/signals` `SignalStore` (or existing root signal service pattern if `@ngrx/signals` not installed).
* Store holds: `documents`, `auditEvents`, `activeMatterId`, `activeRole` (default `'Lead Reviewer'`).
* Expose mutations:
* `confirmFinding(docId, findingId)` -> sets status `'CONFIRMED'`, prepends new `ReviewAuditEvent`.
* `reverseFinding(docId, findingId, reason)` -> requires non-empty `reason`, sets status `'REVERSED'` + `decisionReason`, prepends new `ReviewAuditEvent` (never overwrite old audit entries).
* `saveCoding(docId, coding)` -> updates `doc.coding`, prepends `CODING_SAVED` or `PRIVILEGE_CODED` audit event.


* Expose read-only `auditEvents` and `reversedCount` signals so `/overview` Recent Audit Feed and `Human-Reversed` metric update live when user navigates back.
* Keep `/overview` aggregate doc totals (`12,480` / `7,610`) independent from 20-doc sample queue.



**2. URL Query Param Sync (`ReviewWorkspaceComponent`)**

* Sync route params: `/document-review?custodian=sarah-chen&q=breach&mode=boolean&filter=privileged&docId=DOC-44871`.
* Read via `ActivatedRoute.queryParamMap` (`toSignal`); update via `Router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl: true })`.
* **Validation rule:** If `docId` is missing or filtered out, auto-select first item in `filteredDocuments()`.
* **Pagination sync:** Compute `pageIndex = Math.floor(selectedIndex / pageSize)` and sync `first = pageIndex * pageSize` so opening a deep link to a Page 2 document immediately displays Page 2. Reset `first = 0` when search/filter/custodian changes.

**3. Viewer Reset via `linkedSignal()**`

* Reset per-document UI state whenever `selectedDocId()` changes:

```ts
readonly viewerState = linkedSignal({
  source: this.selectedDocId,
  computation: () => ({
    showRedactions: false,
    activeTab: 'findings' as 'findings' | 'coding',
    reversingFindingId: null as string | null,
  }),
});

```

---

## 4. UI Layout & Components (`src/app/features/document-review/`)

Keep smart/dumb split matching `/overview` architecture (`host: { class: 'block' }`, signal `input()` / `output()`).

### A. Top Toolbar (`review-toolbar`)

* Left: Search input (`pInputText`, debounced 200ms) + `p-selectbutton` toggling `Semantic Demo` vs `Boolean (AND/OR/NOT)`.
* **Boolean logic:** Support real `AND`, `OR`, `NOT` token matching on subject + message bodies.
* **Semantic Demo logic:** Token/synonym mock relevance scoring (honestly labeled `Semantic Demo`).


* Middle: Filter chips (`All`, `Email Threads`, `PII/PHI`, `Privileged`, `Unreviewed`) + active Custodian pill with `×` clear button when routed from `/overview`.
* Right: Honest scope badge: `Sample Queue · 20 of 7,610`.



### B. 3-Pane Split Workspace (`h-[calc(100vh-11rem)]`)

Use `<p-splitter [panelSizes]="[30, 45, 25]" [minSizes]="[20, 35, 20]" class="h-full">`.

**Pane 1 — Document List (`document-list-pane`, 30%)**

* Scrollable stack of compact cards for current 10-row `computed()` slice (`@for (doc of pagedDocuments(); track doc.id)`).
* Each card shows: `doc.id`, `doc.sourceType` tag, `doc.subject` (2-line clamp), `doc.custodianName`, `doc.receivedAt`, thread count pill (`3 msgs`), risk badges (`PII`, `PHI`, `Priv`), coding status dot.
* Highlight active card matching `selectedDocId()`.
* Sticky bottom `<p-paginator [rows]="10" [first]="first()" [totalRecords]="filteredDocuments().length" (onPageChange)="onPageChange($event)" />`.
* Empty state with `Reset Filters` button when 0 matches.

**Pane 2 — Evidence & Thread Reader (`evidence-reader-pane`, 45%)**

* Sticky metadata bar: `doc.id`, `Custodian`, `Date`, truncated `SHA-256` (full hash on hover), `Prev (K)` / `Next (J)` buttons, and `Redaction Preview` (`p-toggleswitch`) with subtle info hint ("Visual preview only — non-destructive").
* Scrollable thread body: stacked cards for each `MockEmailMessage` (`Sender`, `To`, `Timestamp`, highlighted body).
* **Deterministic Segment Highlighter:**
* Sort findings for `message.id` by `start` ascending.
* Split `message.body` into `{ text, finding? }[]` segments.
* Style `PII`/`PHI` in soft rose/red `<mark>`, `PRIVILEGE` in soft amber `<mark>`, `REVERSED` findings with subtle strike/muted border.
* When `viewerState().showRedactions` is `true`, render non-reversed `PII`/`PHI`/`PRIVILEGE` spans as solid black redaction blocks (`bg-slate-900 text-slate-900 select-none`) with `[REDACTED: PII]` label.



**Pane 3 — Reversible AI & Legal Coding Inspector (`review-inspector-pane`, 25%)**

* Header tabs (`Findings (N)` | `Coding`) or clean stacked scroll sections.
* **AI Findings Section:**
* Card per finding: `type` tag, `confidence%`, quoted snippet (`body.slice(start, end)`), current `status` pill.
* Buttons: **`Confirm`** and **`Reverse`**.
* Clicking **`Reverse`** reveals inline required reason input + `Submit Reversal` button (cannot submit empty reason).
* Show saved `decisionReason` under reversed findings.


* **Legal Coding Section:**
* Reactive or signal-bound form synced to `selectedDoc().coding`:
* `Responsiveness` (`p-select`: `Unreviewed`, `Responsive`, `Non-Responsive`, `Further Review`).
* `Privilege` (`p-select`: `None`, `Attorney-Client`, `Work Product`).
* `Reviewer Notes` (`pTextarea`).
* **`Save Coding`** button (disabled when pristine or if `activeRole === 'Compliance Auditor'`).





---

## 5. Keyboard Navigation Safeguard

* Listen for `keydown` (`j` -> next doc, `k` -> prev doc) on `ReviewWorkspaceComponent`.
* **Mandatory focus guard:** Immediately return if `event.target` matches `input, textarea, select, [contenteditable="true"]` or if `ctrlKey`/`metaKey`/`altKey` is pressed.
* Crossing page boundary with `J`/`K` auto-advances paginator page.

---

## 6. Execution Order for Antigravity

1. **Step 1:** Create models (`review.models.ts`), 20 curated documents (`mock-documents.data.ts`), and pure text-segment highlighter helper + unit check that offsets slice cleanly.
2. **Step 2:** Create root `ReviewStore` (`documents` + `auditEvents` + mutations) and wire `/overview` Recent Audit Feed + Custodian `Inspect` button (`/document-review?custodian=...`) to share it.
3. **Step 3:** Build `ReviewWorkspaceComponent` shell with `review-toolbar`, URL query param sync, `p-splitter`, and `document-list-pane` with `p-paginator`.
4. **Step 4:** Build `evidence-reader-pane` (thread cards, offset highlights, `Redaction Preview`, `J`/`K` keyboard shortcuts with focus guard, `linkedSignal` reset).
5. **Step 5:** Build `review-inspector-pane` (`Confirm` / `Reverse` with mandatory reason + Legal Coding form) and verify every mutation appends to shared audit trail and persists across `/overview` <-> `/document-review` navigation.