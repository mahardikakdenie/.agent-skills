# Per-App Baseline Summary - gen-ai-portal (Batch 1)

## 1) App Overview
- Framework: Next.js 16.1.6 (App Router, `src/app`)
- Runtime stack: React 19 + TypeScript 5.9.2
- State/data: Redux Toolkit + Redux Saga + TanStack Query
- Styling: Tailwind CSS v4, app-local shadcn-style components
- Shared UI baseline available now: `@repo/ui` exports `Box` only

## 2) Component Count Summary
- Total components audited: **23**
- `MIGRATE_AFTER_SPLIT`: **10**
- `NEW_SHARED_COMPONENT`: **5**
- `KEEP_APP_LOCAL`: **8**
- `ADOPT_NOW`: 0
- `ADOPT_WITH_ADAPTER`: 0
- `EXTEND_EXISTING`: 0

## 3) P0 Critical Needs
1. Batch 1.5 container/shell split for core task/workflow routes (generate-image/video/audio/text, article, youtube-shorts, sidebar shell).
2. Shared overlay primitive equivalent to current `UIModal` with open/close animation + body scroll-lock parity.
3. Shared primitives (`Button`, `Input`, `Label`, `Tabs`) to unblock consistent migration away from app-local copies.
4. Stable parity guardrails for polling-heavy callback flows and media download actions.

## 4) New Shared Components Needed
### UIButton (Story group: Buttons)
- API intent: `variant`, `size`, `asChild`, native button props
- Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- States: default, hover, focus-visible, disabled, aria-invalid
- Accessibility: keyboard focus ring, disabled semantics, button role

### UIInput (Story group: Inputs)
- API intent: native input props + class merge
- Variants: base input style (tokenized)
- States: default, focus-visible, disabled, invalid, placeholder
- Accessibility: native input semantics + invalid state visuals

### UILabel (Story group: Inputs)
- API intent: Radix label wrapper + class merge
- Variants: base label style
- States: default, peer-disabled/group-disabled
- Accessibility: label association and readable typography

### UITabs (Story group: Navigation)
- API intent: compound exports (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`)
- Variants: active/inactive trigger presentation
- States: default, active, focus-visible, disabled
- Accessibility: full keyboard tab navigation via Radix

### UIModal (Story group: Overlays)
- API intent: controlled `isOpen`, `onClose`, positional variants, content slots
- Variants: centered + edge (`top|bottom|left|right`) positioning
- States: open, closing animation, backdrop click, body lock
- Accessibility: escape/close affordances, focus strategy, background inertness

## 5) Extend Existing Needed
- None in this app baseline (`@repo/ui` currently has no equivalent exports beyond `Box`).

## 6) Normalization Deltas (High-Impact)
1. Heavy use of hardcoded gray utility palettes in route pages instead of shared semantic primitives.
2. Reusable navigation shells import `next/link` directly and embed app route config (framework coupling in UI layer).
3. Modal behavior depends on recursive child cloning and `close-button` classname convention.
4. Route components combine domain orchestration (dispatch, polling, API calls) with dense display JSX.
5. Primitive naming mostly aligns with shadcn conventions, but no shared-source-of-truth in `@repo/ui` yet.

## 7) Top 5 Highest-Parity-Risk Items
1. `WorkflowYoutubeShortsPage` - scene generation + preview/approval + short render + download chain.
2. `WorkflowArticlePage` - article generation, callback polling, and send workflow orchestration.
3. `GenerateTextPage` - URL/file mode switching, callback polling, subtitle/localization pipeline.
4. `GenerateVideoPage` - upload, callback polling, preview/download interactions.
5. `GenerateImagePage` - parameterized generation and downstream action pathways.

## 8) Backlog CSV Row Count
- `_component-backlog.csv` rows (excluding header): **23**

## 9) SoC Evaluation Summary
- Monolith components: **12 / 23**
- Batch 1.5 candidates (`HIGH` + `MEDIUM`): **10**
- SoC potential breakdown:
  - `HIGH`: 7
  - `MEDIUM`: 3
  - `LOW`: 4
  - `NONE`: 9
- Projected NEW_SHARED_COMPONENT candidates surfaced by Batch 1.5 splits: **4**
  - `TaskGeneratorShell`
  - `WorkflowComposerShell`
  - `PromptResultShell`
  - `SidebarNavShell`

## 10) KEEP_APP_LOCAL Refactor Candidates
- Total `KEEP_APP_LOCAL`: **8**
- `KEEP_APP_LOCAL` with SoC potential `HIGH|MEDIUM`: **0**
- Top 3 KEEP_APP_LOCAL refactor notes:
  1. `UISidebarLegacy` (`LOW`, `container-shell`) - only if revived; currently unused.
  2. `LogoutPage` (`LOW`, `hook-extraction`) - optional side-effect extraction.
  3. `DashboardLayout` (`LOW`, `none`) - keep app-owned route shell.
- Shell candidates from KEEP set for `packages/ui`: **none currently**.


## Batch 1.5 Amendment
- Components split: **10**
- NEW_SHARED_COMPONENT candidates from splits: **1**
  - `DashboardSidebarShell`
- KEEP_APP_LOCAL-only Shells: **9**
  - `LoginPageShell`
  - `GenerateImagePageShell`
  - `GenerateVideoPageShell`
  - `GenerateAudioPageShell`
  - `GenerateTextPageShell`
  - `LLMPageShell`
  - `OCRPageShell`
  - `WorkflowArticlePageShell`
  - `WorkflowYoutubeShortsPageShell`
- Notes:
  - All original Batch 1.5 candidates were reclassified to `SPLIT` in audit/backlog and decomposed into Container + Shell.
  - Container exports, file paths, and caller imports were kept unchanged.
