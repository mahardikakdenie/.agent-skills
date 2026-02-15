# Service Documentation Generation Templates (Batch 7)

This file contains templates for generating permanent service documentation in Batch 7.

---

## Template 1: SERVICE_ARCHITECTURE.md

### Structure

```markdown
# Service Layer Architecture

> **Purpose:** Documentation of the colocated service layer architecture for \u003cAPP_NAME\u003e. This describes how API integrations are structured, organized, and maintained.

---

## Related Documentation

- [`SERVICE_IMPLEMENTATION_GUIDE.md`](#) - Step-by-step implementation guide
- [`SERVICE_REACTQUERY_PATTERNS.md`](#) - TanStack Query best practices

---

## Architecture Overview

[Colocated service-first architecture overview]

### Core Principles

1. **Colocation** - Everything for one domain lives together
2. **Service Boundaries** - One service per base URL/API domain
3. **Separation of Concerns** - Clear layers: API → Hooks → Components
4. **Type Safety** - Strongly typed TypeScript throughout
5. **Declarative Data Fetching** - TanStack Query for all data operations

---

## Directory Structure

[Complete directory tree showing lib/ and services/ structure]

---

## Service Boundaries

### Definition

A **service** is defined by its **API base URL**, not by feature names or current folder structure.

### Rule: One Service Per Base URL

[Examples showing correct vs incorrect service boundaries]

### Service Discovery Process

[Mermaid flowchart showing how to determine if new service or extension needed]

### Examples

[2-3 concrete examples from the codebase]

---

## Architecture Layers

### Layer 1: Shared Infrastructure (`lib/`)

### Layer 2: API Layer (`services/[service]/api/`)

### Layer 3: Query Keys (`query-keys.ts`)

### Layer 4: Hooks Layer (`services/[service]/hooks/`)

### Layer 5: Components (Consumers)

[Each layer with purpose, code examples, and explanation]

---

## Data Flow

[Mermaid sequence diagram showing query and mutation flow]

---

## Why Colocated Architecture?

### Benefits

[List of 6-8 key benefits]

---

## Architectural Decisions (ADRs)

### ADR-001: Service Boundaries Defined by Base URL

### ADR-002: Colocated Architecture

### ADR-003: TanStack Query for All Data Fetching

### ADR-004: Hook Signature Standardization

[Each ADR with Decision, Rationale, Consequences]

---

## Anti-Patterns

[3 common anti-patterns with examples]

---

## Comparison Table

[Table comparing layer-based vs colocated approach]

---

## Best Practices

### 1. Service Naming

### 2. File Naming

### 3. API Client Usage

### 4. Query Key Design

### 5. Cache Invalidation

[Each with concrete examples]
```

---

## Template 2: SERVICE_IMPLEMENTATION_GUIDE.md

### Structure

```markdown
# Service Implementation Guide

> **Purpose:** Comprehensive guide for implementing new API service integrations in \u003cAPP_NAME\u003e using the colocated service architecture with TanStack Query.

---

## Related Documentation

- [`SERVICE_ARCHITECTURE.md`](#) - Service layer architecture overview
- [`SERVICE_REACTQUERY_PATTERNS.md`](#) - TanStack Query patterns and best practices

---

## When to Create a New Service

[Mermaid decision tree diagram]

### Key Principles

**One Service = One Base URL**

[Explanation and examples]

---

## Implementation Checklist

### 1. Map the Service Boundary

### 2. Create Service Directory Structure

### 3. Implement API Layer

- 3.1 Define Endpoints (`*.endpoints.ts`)
- 3.2 Define Types (`*.types.ts`)
- 3.3 Implement Service Functions (`*.service.ts`)

### 4. Implement Query Keys

### 5. Implement Hooks

- 5.1 Query Hooks (GET operations)
- 5.2 Mutation Hooks (POST/PUT/DELETE operations)

### 6. Consume in UI Components

### 7. Verification

[Each step with detailed instructions, code examples, and tips]

---

## Troubleshooting

[4-5 common issues with solutions]

---

## Anti-Patterns to Avoid

[3 anti-patterns with wrong/correct comparisons]

---

## Quick Reference

### Service checklist

### Hook signature templates

[Copy-paste templates]
```

---

## Template 3: SERVICE_REACTQUERY_PATTERNS.md

### Structure

```markdown
# Service-Layer TanStack Query Patterns

> **Purpose:** Best practices, patterns, and advanced techniques for using TanStack Query (React Query) in service hooks within \u003cAPP_NAME\u003e.

---

## Related Documentation

- [`SERVICE_IMPLEMENTATION_GUIDE.md`](#) - Implementation guide for services
- [`SERVICE_ARCHITECTURE.md`](#) - Service layer architecture
- [TanStack Query Official Docs](https://tanstack.com/query/latest/docs/react/overview)

---

## Table of Contents

1. [Query Keys](#query-keys)
2. [Query Hooks](#query-hooks)
3. [Mutation Hooks](#mutation-hooks)
4. [Cache Invalidation](#cache-invalidation)
5. [Advanced Patterns](#advanced-patterns)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Testing](#testing)
9. [Common Pitfalls](#common-pitfalls)

---

## Query Keys

### Hierarchical Key Structure

### Benefits of Hierarchical Keys

### Key Design Best Practices

[With code examples]

---

## Query Hooks

### Basic Query Hook Pattern

### Conditional Queries

### Dependent Queries

### Queries with Transformations

### Prefetching

[Each with complete working examples]

---

## Mutation Hooks

### Basic Mutation Hook Pattern

### Mutation with Multiple Cache Updates

### Optimistic Updates

### Delete Mutation

[Each with complete working examples]

---

## Cache Invalidation

### Invalidation Strategies

1. Broad Invalidation (Safest)
2. Targeted Invalidation (Efficient)
3. Surgical Update (Optimal)

### Invalidation Decision Matrix

[Table showing mutation type vs invalidation strategy]

---

## Advanced Patterns

### Pagination

### Infinite Queries

### Polling

### Background Sync

[Each with working code examples]

---

## Error Handling

### Hook-Level Error Handling

### Component-Level Error Handling

### Global Error Handler

[Examples for each level]

---

## Performance Optimization

### Reduce Unnecessary Refetches

### Structural Sharing

### Select for Partial Data

[Optimization techniques with examples]

---

## Testing

### Testing Query Hooks

### Testing Mutation Hooks

[Complete test examples]

---

## Common Pitfalls

[5 common pitfalls with wrong/correct comparisons]

---

## Summary

### Query Hook Template

### Mutation Hook Template

[Copy-paste templates]
```

---

## Generation Instructions for Batch 7

When generating these docs in Batch 7:

1. **Read the codebase** to extract real service names, base URLs, and patterns
2. **Use actual examples** from the refactored services, not generic ones
3. **Include mermaid diagrams** for decision trees, data flow, and processes
4. **Create ADRs** documenting the key architectural decisions made
5. **Document anti-patterns** seen in the old code
6. **Add comparison tables** showing old vs new patterns
7. **Include troubleshooting** based on common issues encountered during refactor
8. **Generate comprehensive examples** covering all patterns used
9. **DO NOT reference migration docs** - these are permanent, standalone docs
10. **DO NOT mention migration process** - focus on how to use the architecture going forward
