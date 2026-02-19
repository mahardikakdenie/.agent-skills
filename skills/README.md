# AI Agent Skills — Setup Guide

> **What are skills?**
> Skills are curated, structured knowledge files that teach an AI agent the conventions,
> patterns, and rules of this codebase. When an agent reads a skill before working on a task,
> it produces code that is consistent, correct, and idiomatic — without needing to reverse-engineer
> conventions from the codebase on every request.
>
> Each skill lives in its own subdirectory and exposes a `SKILL.md` as its entry point.
> Some skills include supporting `references/`, `rules/`, and `templates/` subdirectories
> for deeper content.

---

## Table of Contents

1. [Skill Catalogue](#skill-catalogue)
2. [Setup by Agent](#setup-by-agent)
   - [Claude Code](#claude-code-anthropic)
   - [Gemini CLI / Antigravity](#gemini-cli--antigravity-google)
   - [GitHub Copilot / Codex](#github-copilot--codex-openai)
   - [Cursor](#cursor)
   - [Windsurf (Codeium)](#windsurf-codeium)
   - [Continue.dev](#continuedev)
   - [Universal — AGENTS.md / CLAUDE.md / system prompt injection](#universal-agentsmd--claudemd--system-prompt-injection)
3. [Skill Loading Best Practices](#skill-loading-best-practices)
4. [Adding a New Skill](#adding-a-new-skill)
5. [Updating an Existing Skill](#updating-an-existing-skill)

---

## Skill Catalogue

There are **13 skills** in this directory. Load each based on task context.

| Skill                                                         | Directory                             | Load when you are…                                                                                                                                                                        |
| ------------------------------------------------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`monorepo-workspace`](#monorepo-workspace)                   | `skills/monorepo-workspace/`          | Touching any package boundary, writing imports, using turbo CLI, adding a new package/app, or uncertain where a file belongs                                                              |
| [`react-query`](#react-query)                                 | `skills/react-query/`                 | Writing or reviewing any `useQuery`, `useMutation`, service hook, API client, query key, or `QueryClient` setup                                                                           |
| [`forms-validation`](#forms-validation)                       | `skills/forms-validation/`            | Working on any form: `react-hook-form`, `zod`, `Controller`, `useFieldArray`, or form submission with TanStack Query                                                                      |
| [`design-system`](#design-system)                             | `skills/design-system/`               | Building or editing components in `packages/ui`, defining tokens, writing CVA variants, or reviewing shared-vs-local boundary                                                             |
| [`systematic-debugging`](#systematic-debugging)               | `skills/systematic-debugging/`        | Encountering any bug, test failure, or unexpected behavior — **skip if the root cause is already obvious**                                                                                |
| [`turborepo`](#turborepo)                                     | `skills/turborepo/`                   | Configuring `turbo.json`, writing pipeline tasks, using `--filter`, optimizing CI caching, or debugging turbo cache                                                                       |
| [`next-best-practices`](#next-best-practices)                 | `skills/next-best-practices/`         | Writing or reviewing any Next.js App Router code: RSC boundaries, async APIs, data fetching, metadata, images, error handling                                                             |
| [`next-cache-components`](#next-cache-components)             | `skills/next-cache-components/`       | Working with Next.js 16+ `use cache` directive, Cache Components (PPR), `cacheLife`, `cacheTag`, or `updateTag`                                                                           |
| [`next-upgrade`](#next-upgrade)                               | `skills/next-upgrade/`                | Upgrading Next.js to a new major version, running codemods, or reviewing breaking changes                                                                                                 |
| [`vercel-react-best-practices`](#vercel-react-best-practices) | `skills/vercel-react-best-practices/` | Writing or refactoring React/Next.js components and applying the 45 Vercel Engineering rules: async waterfalls, bundle size, re-renders, server-side data fetching, rendering performance |
| [`vercel-composition-patterns`](#vercel-composition-patterns) | `skills/vercel-composition-patterns/` | Designing or reviewing component APIs, refactoring boolean-prop-heavy components, building compound components or context providers                                                       |
| [`agent-browser`](#agent-browser)                             | `skills/agent-browser/`               | Automating browser tasks: smoke testing routes, visual parity verification, form automation, session management, or data extraction                                                       |
| [`web-design-guidelines`](#web-design-guidelines)             | `skills/web-design-guidelines/`       | Explicitly auditing UI for accessibility and UX compliance against Vercel's Web Interface Guidelines                                                                                      |

---

### Skill Descriptions

#### `monorepo-workspace`

Ground truth for the `frontend-workspace` monorepo topology. Documents package boundaries
(`@repo/ui`, `@repo/config`, `@repo/interface`, `@repo/helper`, `@repo/typescript-config`,
`@repo/eslint-config`), dependency direction rules, turbo task names, pnpm commands,
env variable scoping, and adding new packages or apps.

#### `react-query`

TanStack Query v5 patterns aligned to the project's colocated service architecture
(`src/lib/api-client/`, `src/lib/react-query/`, `src/services/[domain]/`). Covers
query key factories, `useQuery` / `useMutation` hook authoring, cache invalidation strategy,
optimistic updates, pagination, infinite queries, Next.js App Router hydration, and error handling.

#### `forms-validation`

`react-hook-form` v7 + `zod` + `@hookform/resolvers` patterns. Covers schema-first design,
`Controller` integration for `@repo/ui` components, `useFieldArray`, mutation-integrated
submissions, accessible error display (`aria-invalid`, `aria-describedby`, `role="alert"`),
multi-step forms, and performance optimizations.

#### `design-system`

Enterprise design system for `packages/ui`. Token-driven, AI-friendly, app-agnostic.
Covers the **SDD lifecycle** (spec → story → build → gate), **Tier 1/2/3 component directory
structures** (with `.types.ts`, `.hooks.ts`, `.utils.ts`, `parts/` naming), **mandatory prop
naming contract** (size/variant/state/event conventions and forbidden patterns), CVA variant
system, `cn()` context-aware import rules, **CSS variable contract** for consuming apps,
**shared-vs-local boundary decision tree**, Radix UI integration, accessibility standards,
and behavioral parity rules for migration work.

#### `systematic-debugging`

Structured four-phase debugging process: Root Cause Investigation → Pattern Analysis →
Hypothesis & Testing → Implementation. Enforces the iron law: no fix without root cause.
Includes multi-component evidence gathering, data-flow tracing, and architectural escalation
when 3+ fixes fail. **Skip when the root cause is already obvious; load otherwise.**

#### `turborepo`

Turborepo build system guidance. Covers task pipeline configuration (`turbo.json`),
`dependsOn` rules, caching, remote cache, `--filter` / `--affected` flags, environment
variables in CI, package task vs root task distinction. Includes a project-specific section
for `frontend-workspace` task names, package names, and known gotchas.

#### `next-best-practices`

Next.js App Router best practices spanning 15 topics: file conventions, RSC boundary
detection, async `params` / `searchParams` / `cookies()` / `headers()`, runtime selection,
directives (`'use client'`, `'use server'`, `'use cache'`), error handling (`error.tsx`,
`global-error.tsx`, `not-found.tsx`), image/font optimization, hydration error diagnosis,
Suspense boundaries, parallel & intercepting routes, and self-hosting.

#### `next-cache-components`

Next.js 16+ Cache Components (PPR). Covers `cacheComponents: true` config, `use cache`
directive at file/component/function level, `cacheLife` profiles, `cacheTag` tagging,
`updateTag` (same-request invalidation) vs `revalidateTag` (background), runtime data
constraints, and migration from `unstable_cache`.

#### `next-upgrade`

Step-by-step Next.js upgrade workflow: detect current version, fetch official upgrade guide,
determine incremental upgrade path (e.g., 13 → 14 → 15 → 16), run codemods
(`@next/codemod@latest`), update peer deps, review breaking changes, update TypeScript types.

#### `vercel-react-best-practices`

45 React and Next.js performance rules in 8 priority tiers: eliminating async waterfalls
(CRITICAL), bundle size optimization (CRITICAL), server-side performance (HIGH), client-side
data fetching (MEDIUM-HIGH), re-render optimization (MEDIUM), rendering performance (MEDIUM),
JavaScript performance (LOW-MEDIUM), advanced patterns (LOW). Maintained by Vercel Engineering.

#### `vercel-composition-patterns`

React composition patterns to avoid boolean prop proliferation: compound components,
context-based state decoupling, explicit variant components, children over render props,
and React 19 API changes (`forwardRef` removal, `use()` hook). From Vercel Engineering.

#### `agent-browser`

Browser automation CLI for AI agents using `agent-browser`. Covers the core snapshot → ref →
interact → re-snapshot workflow, form submission, authenticated sessions with state persistence,
data extraction, parallel sessions, iOS Simulator support, JavaScript evaluation, and
semantic locators. Used for smoke testing, visual parity verification, and E2E automation.

#### `web-design-guidelines`

UI review workflow against Vercel's Web Interface Guidelines. Fetches the latest rules from
the canonical GitHub source URL, reads specified files, and outputs findings in `file:line`
format covering accessibility, UX, and interface best practices. Load when explicitly
auditing UI code for a11y or UX compliance.

---

## Setup by Agent

> [!IMPORTANT]
> Skills are passive reference documents. They only affect AI output if you explicitly load them
> into the agent's context window before the task. Read the agent-specific instructions below
> to understand how each agent discovers and loads skills.

---

### Claude Code (Anthropic)

Claude Code reads `CLAUDE.md` files automatically at startup and supports slash commands
(`/skill`) for on-demand skill loading.

#### Option A — Automatic loading via `CLAUDE.md` (recommended)

Place a `CLAUDE.md` in the repo root (or any subdirectory) and reference skills there:

```markdown
# CLAUDE.md

## Agent Skills

Before starting any task, read the relevant skills from the `skills/` directory.

### Always load

- `skills/monorepo-workspace/SKILL.md` — workspace topology and boundaries

### Load when relevant

- `skills/react-query/SKILL.md` — when writing useQuery/useMutation/service hooks
- `skills/forms-validation/SKILL.md` — when working on any form
- `skills/systematic-debugging/SKILL.md` — when debugging any bug before proposing a fix
- `skills/design-system/SKILL.md` — when editing packages/ui
- `skills/turborepo/SKILL.md` — when configuring turbo.json or using the turbo CLI
- `skills/next-best-practices/SKILL.md` — when writing Next.js App Router code
- `skills/vercel-react-best-practices/SKILL.md` — when writing or refactoring React/Next.js components (waterfalls, bundle size, re-renders)
- `skills/vercel-composition-patterns/SKILL.md` — when designing component APIs
- `skills/agent-browser/SKILL.md` — when running browser automation or smoke tests
- `skills/web-design-guidelines/SKILL.md` — when auditing UI for a11y and UX compliance
```

#### Option B — On-demand via slash command

```bash
# In your Claude Code session
/skill skills/react-query/SKILL.md
```

#### Option C — Project-level `settings.json`

```json
// .claude/settings.json
{
  "permissions": {
    "allow": ["Read(skills/**/SKILL.md)"]
  }
}
```

Then instruct Claude explicitly in your prompt:

```
Read skills/react-query/SKILL.md before writing any service hooks.
```

---

### Gemini CLI / Antigravity (Google)

Antigravity discovers skills automatically from a `skills/` directory at the repository root.
Each `SKILL.md` frontmatter `description` field controls when the skill is triggered.

#### How it works

1. Antigravity scans `skills/*/SKILL.md` on every task
2. It matches the frontmatter `description` against the current task context
3. It reads the matched `SKILL.md` automatically before responding

#### No setup required — but verify

Confirm Antigravity can see the skills directory:

```bash
ls skills/*/SKILL.md
```

All entries must be readable files. Skills with `user-invocable: false` in frontmatter
are auto-triggered but cannot be invoked by the user directly.

#### Explicit invocation (when auto-trigger doesn't fire)

Mention the skill name with a `$` prefix in your prompt:

```
$react-query — write a query hook for the claims service
$systematic-debugging — investigate why the build is failing
$monorepo-workspace — where should I put this shared utility?
```

---

### GitHub Copilot / Codex (OpenAI)

GitHub Copilot reads `AGENTS.md` (Codex) and `.github/copilot-instructions.md` (Copilot Chat).
Several skills include a pre-compiled `AGENTS.md` for direct inclusion.

#### Option A — `AGENTS.md` at repo root (Codex)

```markdown
# AGENTS.md

## Development Skills

Before coding, read the applicable skill files from the `skills/` directory.

### Mandatory context

- Always read: `skills/monorepo-workspace/SKILL.md`

### Task-conditional context

- Forms work: `skills/forms-validation/SKILL.md`
- Data fetching: `skills/react-query/SKILL.md`
- Debugging: `skills/systematic-debugging/SKILL.md`
- UI components in packages/ui: `skills/design-system/SKILL.md`
- Next.js work: `skills/next-best-practices/SKILL.md`
- React/Next.js component authoring or refactoring (waterfalls, bundle, re-renders): `skills/vercel-react-best-practices/SKILL.md`
- Component architecture: `skills/vercel-composition-patterns/SKILL.md`
- Browser automation: `skills/agent-browser/SKILL.md`
- Turbo / monorepo tooling: `skills/turborepo/SKILL.md`
- UI accessibility/UX audit: `skills/web-design-guidelines/SKILL.md`
```

#### Option B — `.github/copilot-instructions.md` (GitHub Copilot Chat)

```markdown
# Copilot Instructions

This repository uses structured AI skills. When relevant to the task,
read the corresponding `SKILL.md` from the `skills/` directory before
generating code. Key skills:

- `skills/monorepo-workspace/SKILL.md` — package boundaries, imports, turbo commands
- `skills/react-query/SKILL.md` — TanStack Query v5 service layer patterns
- `skills/forms-validation/SKILL.md` — react-hook-form + zod patterns
- `skills/design-system/SKILL.md` — @repo/ui component authoring
- `skills/systematic-debugging/SKILL.md` — debugging before fixing
- `skills/next-best-practices/SKILL.md` — Next.js App Router rules
- `skills/vercel-react-best-practices/SKILL.md` — writing/refactoring React components: async waterfalls, bundle size, re-render optimization
- `skills/web-design-guidelines/SKILL.md` — UI accessibility and UX audit
```

#### Option C — Include compiled `AGENTS.md` from skill directories

Some skills ship a pre-compiled `AGENTS.md`:

```
skills/vercel-react-best-practices/AGENTS.md
skills/vercel-composition-patterns/AGENTS.md
```

Reference these directly in your root `AGENTS.md`:

```markdown
# Include compiled skills

See: skills/vercel-react-best-practices/AGENTS.md
See: skills/vercel-composition-patterns/AGENTS.md
```

---

### Cursor

Cursor reads `.cursorrules` (legacy) and `.cursor/rules/*.mdc` (current).

#### Option A — `.cursor/rules/` directory (recommended, Cursor 0.43+)

Create one `.mdc` rule file per skill group:

```markdown
## <!-- .cursor/rules/monorepo-workspace.mdc -->

description: Read before any task involving package imports, turbo CLI, or file placement
globs: ["**/*.ts", "**/*.tsx", "**/package.json", "**/turbo.json"]
alwaysApply: false

---

Read `skills/monorepo-workspace/SKILL.md` before responding.
```

```markdown
## <!-- .cursor/rules/react-query.mdc -->

description: Read before any data fetching, service hook, or React Query code
globs: ["**/services/**", "**/hooks/**", "**/*.query.ts", "**/*.service.ts"]
alwaysApply: false

---

Read `skills/react-query/SKILL.md` before responding.
```

```markdown
## <!-- .cursor/rules/forms-validation.mdc -->

description: Read before working on any form component
globs: ["**/*Form*", "**/*form*", "**/forms/**"]
alwaysApply: false

---

Read `skills/forms-validation/SKILL.md` before responding.
```

```markdown
## <!-- .cursor/rules/debugging.mdc -->

description: Read before debugging, fixing bugs, or investigating unexpected behavior
alwaysApply: false

---

Read `skills/systematic-debugging/SKILL.md` before proposing any fix.
```

#### Option B — `.cursorrules` (legacy, simpler)

```
# .cursorrules

## Skills

This project has AI skills in the `skills/` directory. Read the relevant SKILL.md
before every task:

- Monorepo / imports / packages → skills/monorepo-workspace/SKILL.md
- React Query / service hooks  → skills/react-query/SKILL.md
- Forms / zod / rhf            → skills/forms-validation/SKILL.md
- Design system / @repo/ui     → skills/design-system/SKILL.md
- Debugging                    → skills/systematic-debugging/SKILL.md
- Next.js                      → skills/next-best-practices/SKILL.md
- React / Next.js components (waterfalls, bundle, re-renders) → skills/vercel-react-best-practices/SKILL.md
- Turbo / monorepo tasks       → skills/turborepo/SKILL.md
- Component API design         → skills/vercel-composition-patterns/SKILL.md
- Browser automation           → skills/agent-browser/SKILL.md
- UI accessibility / UX audit  → skills/web-design-guidelines/SKILL.md
```

---

### Windsurf (Codeium)

Windsurf reads `.windsurfrules` and also supports memories via `@remember`.

#### `.windsurfrules`

```
# .windsurfrules

## AI Skills

Read skills from the `skills/` directory based on task context:

| Task type | Skill file |
|-----------|-----------|
| Any file placement, import, turbo command | skills/monorepo-workspace/SKILL.md |
| useQuery, useMutation, service layer | skills/react-query/SKILL.md |
| Forms, react-hook-form, zod | skills/forms-validation/SKILL.md |
| packages/ui components, design tokens | skills/design-system/SKILL.md |
| Bug, test failure, unexpected behavior | skills/systematic-debugging/SKILL.md |
| Next.js App Router code | skills/next-best-practices/SKILL.md |
| Writing/refactoring React components: waterfalls, bundle size, re-renders | skills/vercel-react-best-practices/SKILL.md |
| turbo.json, --filter, CI caching | skills/turborepo/SKILL.md |
| Component API design | skills/vercel-composition-patterns/SKILL.md |
| Browser automation, smoke tests | skills/agent-browser/SKILL.md |
| UI accessibility / UX audit | skills/web-design-guidelines/SKILL.md |
```

#### Windsurf Memories (persistent)

```
@remember For this project, always read skills/monorepo-workspace/SKILL.md before
touching any package boundary or import path.
```

---

### Continue.dev

Continue reads `.continuerc.json` and supports `@file` context providers.

#### `.continuerc.json`

```json
{
  "customCommands": [
    {
      "name": "skill",
      "description": "Load a skill before the next task",
      "prompt": "Read the skill file at {input} and apply its conventions to the next task."
    }
  ],
  "contextProviders": [
    {
      "name": "file",
      "params": {}
    }
  ],
  "systemMessage": "This project uses AI skills in the `skills/` directory. When relevant, read the SKILL.md for: monorepo-workspace (imports/packages), react-query (data fetching/service hooks), forms-validation (forms), design-system (UI components in packages/ui), systematic-debugging (before fixing any bug), next-best-practices (Next.js App Router), vercel-react-best-practices (writing/refactoring React components: waterfalls, bundle size, re-renders), web-design-guidelines (UI a11y and UX audit)."
}
```

#### Inline skill loading in Continue

```
@file skills/react-query/SKILL.md

Now write a mutation hook for updating a user's profile.
```

---

### Universal — `AGENTS.md` / `CLAUDE.md` / System Prompt Injection

For any AI agent that reads a root-level instruction file, use this template:

```markdown
# AI Agent Instructions

## Skills System

This project has structured knowledge files called "skills" in the `skills/` directory.
Each skill is a `SKILL.md` file that documents conventions, patterns, and rules for a
specific concern.

### Always read before any task

- `skills/monorepo-workspace/SKILL.md`

### Read when the task involves…

| Task involves                                                                         | Skill to read                                 |
| ------------------------------------------------------------------------------------- | --------------------------------------------- |
| `useQuery`, `useMutation`, API service hooks, `QueryClient`                           | `skills/react-query/SKILL.md`                 |
| Forms, `react-hook-form`, `zod`, form submission                                      | `skills/forms-validation/SKILL.md`            |
| `packages/ui`, design tokens, CVA variants, accessibility                             | `skills/design-system/SKILL.md`               |
| Any bug, test failure, or unexpected behavior                                         | `skills/systematic-debugging/SKILL.md`        |
| `turbo.json`, `--filter`, turbo CLI, CI pipeline                                      | `skills/turborepo/SKILL.md`                   |
| Next.js App Router, RSC, `use client`, data patterns                                  | `skills/next-best-practices/SKILL.md`         |
| Next.js 16+ `use cache`, PPR, Cache Components                                        | `skills/next-cache-components/SKILL.md`       |
| Writing or refactoring React/Next.js components (waterfalls, bundle size, re-renders) | `skills/vercel-react-best-practices/SKILL.md` |
| Component API design, compound components, context                                    | `skills/vercel-composition-patterns/SKILL.md` |
| Browser automation, smoke testing, visual parity                                      | `skills/agent-browser/SKILL.md`               |
| Upgrading Next.js version                                                             | `skills/next-upgrade/SKILL.md`                |
| UI accessibility / UX audit against external guidelines                               | `skills/web-design-guidelines/SKILL.md`       |
```

---

## Skill Loading Best Practices

### Do

- ✅ **Read the skill at the start of the task** — not mid-way through. Skills set conventions
  that affect the entire code you produce.
- ✅ **Load multiple skills** when a task spans concerns (e.g., a form that submits via mutation
  → load both `forms-validation` and `react-query`).
- ✅ **Re-read a skill** when you return to a concern after a long digression.
- ✅ **Trust the skill over your training defaults** — skills document project-specific conventions
  that override general best practices.

### Don't

- ❌ **Don't load all skills at once** — read only what is relevant. Loading irrelevant skills adds
  noise and can produce contradictions.
- ❌ **Don't skip `systematic-debugging`** when hitting any unexpected behavior, even if the fix
  seems "obvious". The skill exists to prevent wasted rework.
- ❌ **Don't assume conventions** if you haven't read the relevant skill. Even experienced TypeScript
  developers assume incorrectly about monorepo-specific contract details.

---

## Adding a New Skill

1. **Create the directory:**

   ```bash
   mkdir skills/<skill-name>
   ```

2. **Create `SKILL.md` with standard frontmatter:**

   ```markdown
   ---
   name: <skill-name>
   version: 1.0.0
   description: >
     One-paragraph description of when to use this skill.
     Used by AI agents to decide whether to load it.
   tags: [tag1, tag2]
   ---

   # <Skill Title>

   Brief intro sentence.

   ---

   ## [Content sections…]
   ```

3. **Frontmatter rules:**
   - `name` — matches the directory name exactly
   - `description` — written in second person: _"Use when…"_ or _"Covers…"_. This is the
     auto-trigger clause agents use to decide relevance.
   - `tags` — flat array of lowercase strings; used for search/categorization
   - `version` — semver; bump on every content change
   - `user-invocable: false` — (optional) prevents direct `$skill-name` invocation

4. **Add a row to the [Skill Catalogue](#skill-catalogue) table** in this README.

5. **Add the skill to agent config files** (`.cursorrules`, `CLAUDE.md`, `.windsurfrules`, etc.)
   with its trigger condition.

---

## Updating an Existing Skill

1. Edit `SKILL.md` directly in the skill's directory.
2. Bump the `version` field in frontmatter (patch for clarifications, minor for new sections,
   major for complete rewrites).
3. Update this README's description if the scope changed.
4. If agent config files reference the skill's trigger condition and that condition changed,
   update those files too.

> [!NOTE]
> Skills are living documents. They should be updated whenever the project's actual
> conventions change (new library version, new architectural decision, new pattern
> established). An outdated skill is worse than no skill — always keep them current.

---

## Directory Structure Reference

```
skills/
├── README.md                        ← this file
│
├── agent-browser/
│   ├── SKILL.md                     ← entry point (always present)
│   ├── references/                  ← deep-dive reference docs
│   └── templates/                   ← ready-to-run shell scripts
│
├── design-system/
│   └── SKILL.md
│
├── forms-validation/
│   └── SKILL.md
│
├── monorepo-workspace/
│   └── SKILL.md
│
├── next-best-practices/
│   ├── SKILL.md
│   └── [topic].md                   ← per-topic deep dives
│
├── next-cache-components/
│   └── SKILL.md
│
├── next-upgrade/
│   └── SKILL.md
│
├── react-query/
│   └── SKILL.md
│
├── systematic-debugging/
│   ├── SKILL.md
│   └── [technique].md              ← root-cause-tracing, defense-in-depth, etc.
│
├── turborepo/
│   └── SKILL.md
│
├── vercel-composition-patterns/
│   ├── SKILL.md
│   ├── AGENTS.md                   ← compiled full guide
│   └── rules/                      ← individual rule files
│
├── vercel-react-best-practices/
│   ├── SKILL.md
│   ├── AGENTS.md                   ← compiled full guide (45 rules)
│   └── rules/                      ← individual rule files
│
└── web-design-guidelines/
    └── SKILL.md
```
