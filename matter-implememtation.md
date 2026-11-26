Implementation Plan: /matters (Matters & Legal Holds)
1. Strict Stack & Guardrails
Stack: Angular v22+ (standalone, Signals, ChangeDetectionStrategy.OnPush, @if/@for, input()/output(), host: { class: 'block' }), Tailwind CSS, PrimeNG v20–22 (@primeuix/themes).

PrimeNG v22 syntax only:

Import standalone components (TableModule or Table, Tag, Button, Tooltip, SelectButton).

Use <ng-template #header> and <ng-template #body let-row> — never pTemplate or styleClass. Use standard class="...".

Visual match: Match /overview light enterprise UI (bg-slate-50 page canvas, white bordered cards, slate typography, compact density).

Hard exclusions:

NO Supabase / backend API calls (static in-memory state only).

NO Create/Edit/Delete Matter CRUD modals or forms.

NO RBAC guards/locks yet (keep UI unlocked; RBAC comes in a dedicated pass later).

2. Data Contracts & Deterministic Mock Dataset
Create src/app/features/matters/models/matters.models.ts and data/mock-matters.data.ts.

TypeScript
export type MatterStatus = 'HOLD_ACTIVE' | 'ACTIVE' | 'CLOSED';
export type HoldAckStatus = 'ACKNOWLEDGED' | 'PENDING' | 'OVERDUE';
export type PreservationSource = 'Email' | 'Slack' | 'Drive' | 'Teams';

export interface MatterRecord {
  id: string; // e.g., MTR-2026-01
  name: string;
  status: MatterStatus;
  leadCounsel: string;
  openedAt: string;
  corpusSizeGb: number;
  docCount: number;
}

export interface LegalHoldCustodian {
  id: string; // e.g., sarah-chen (must match /overview & /document-review IDs)
  matterId: string;
  name: string;
  department: string;
  sources: PreservationSource[];
  issuedAt: string;
  holdActive: boolean;
  ackStatus: HoldAckStatus;
  noticeSnippet: string; // shown in pTooltip on hover
  lastRemindedAt?: string;
}
Deterministic Mock Data (3 Matters, 12 Custodians Total):

MTR-2026-01 — FinCorp Data Breach (HOLD_ACTIVE, 42.6 GB, 12,480 docs)

Must use exact /overview custodians: Sarah Chen (sarah-chen), Marcus Webb (marcus-webb), Priya Nair (priya-nair), David Okafor (david-okafor), Lena Fischer (lena-fischer).

Mix ack states: 3 ACKNOWLEDGED, 1 PENDING, 1 OVERDUE.

MTR-2026-02 — Apex Antitrust Inquiry (ACTIVE, 18.4 GB, 5,320 docs)

4 custodians (mix of ACKNOWLEDGED, PENDING, 1 OVERDUE).

MTR-2026-03 — Vendor Kickback Review (CLOSED, 9.2 GB, 2,840 docs)

3 custodians (all ACKNOWLEDGED, holdActive: false).

3. Shared Root Store Wiring (providedIn: 'root')
Connect /matters to existing root ReviewStore / shared audit store (or create root MattersStore that injects shared audit store):

Shared activeMatterId signal: Default 'MTR-2026-01'. Switching active matter here must update /overview and /document-review live.

Local inspectedMatterId signal: Defaults to activeMatterId(). Clicking any row in Matters Table updates Zone 3 custodian list without forcing global switch unless user clicks Switch Active.

Mutations (immutable updates + append-only audit events):

switchActiveMatter(matterId) -> updates root activeMatterId, sets inspectedMatterId = matterId.

sendReminder(custodianId) -> sets lastRemindedAt = 'Just now', changes OVERDUE -> PENDING, appends audit event (action: 'LEGAL_HOLD_REMINDER', docId: matterId, detail: 'Preservation reminder sent to <Name>') to shared audit trail.

toggleLegalHold(custodianId) -> flips holdActive, appends LEGAL_HOLD_ISSUED or LEGAL_HOLD_RELEASED to shared audit trail.

Computed KPIs: Derive all 3 Zone 1 counts via computed() from live store state (zero hardcoded stat numbers).

4. UI Layout & Components (src/app/features/matters/)
Keep smart container (matters-page.component.ts) + dumb presentational children.

Header
Compact header: Matters & Legal Holds + subtitle Active litigation matters and custodian preservation tracking.

Zone 1 — 3 Mini Stat Cards (grid grid-cols-1 sm:grid-cols-3 gap-4)
Active Matters: computed() count of matters where status !== 'CLOSED'.

Custodians on Legal Hold: computed() count of custodians where holdActive === true.

Overdue Acknowledgments: computed() count where ackStatus === 'OVERDUE' (amber/red accent when > 0, green when 0).

Zone 2 — Matters Table (p-table)
Columns: Matter ID (mono font), Case Name + Lead Counsel subtext, Status (p-tag: Hold Active amber, Active green, Closed secondary), Custodians (count), Corpus Size (42.6 GB · 12,480 docs), Action.

Row click selects matter for Zone 3 inspection (subtle border/bg highlight on selected row).

Action column:

If row.id === activeMatterId() -> green Active Workspace p-tag.

Else -> Switch Active p-button (outlined, stops row click propagation).

Zone 3 — Legal Hold Preservation Tracker (p-table)
Card header: Selected matter ID + name on left; compact status filter (All | Acknowledged | Pending | Overdue) on right.

Columns:

Custodian: Name + Department subtext.

Sources Preserved: Compact pill badges (Email, Slack, Drive, Teams).

Hold Issued: Date + lastRemindedAt muted subtext when reminded.

Ack Status: p-tag (Acknowledged green, Pending info/amber, Overdue danger) + pTooltip showing noticeSnippet on hover.

Hold State: Preserved / Released p-tag.

Actions:

Send Reminder p-button ([text]="true", disabled when ackStatus === 'ACKNOWLEDGED' or !holdActive).

Release Hold / Re-Issue p-button ([text]="true").

Docs link button routing to /document-review?custodian=<id> (only enabled for active matter custodians).

5. Execution Order for Antigravity
Step 1: Create matters.models.ts and mock-matters.data.ts (3 matters, 12 custodians matching /overview custodian IDs).

Step 2: Wire root store signals (activeMatterId, matters, custodians) + sendReminder / toggleLegalHold appending directly to shared auditEvents.

Step 3: Build matters-page + Zone 1/2/3 presentational components using PrimeNG v22 #header/#body syntax and Tailwind grid.

Step 4: Verify end-to-end:

Clicking Send Reminder decrements Overdue Acknowledgments live and adds LEGAL_HOLD_REMINDER to /overview Recent Audit Feed.

Clicking Switch Active updates active matter across /overview and /matters.

Zero console errors, zero pTemplate / styleClass usage.