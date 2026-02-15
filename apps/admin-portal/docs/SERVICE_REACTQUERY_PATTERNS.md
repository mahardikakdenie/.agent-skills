# Service-Layer TanStack Query Patterns

> **Purpose:** Best practices, patterns, and advanced techniques for using TanStack Query (React Query) in service hooks within admin-portal.

---

## Related Documentation

- [`SERVICE_IMPLEMENTATION_GUIDE.md`](file:///c:/Users/user/friendsuretech/projects/frontend-workspace/apps/admin-portal/docs/SERVICE_IMPLEMENTATION_GUIDE.md) - Implementation guide for services
- [`SERVICE_ARCHITECTURE.md`](file:///c:/Users/user/friendsuretech/projects/frontend-workspace/apps/admin-portal/docs/SERVICE_ARCHITECTURE.md) - Service layer architecture
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

Query keys are the foundation of TanStack Query's caching system.

### Hierarchical Key Structure

Use a hierarchical factory pattern for organized cache management:

```typescript
// src/services/claims/query-keys.ts
import type { ClaimFilters } from './api/claims.types';

export const claimKeys = {
  // Level 1: Base key
  all: ['claims'] as const,

  // Level 2: Query type
  lists: () => [...claimKeys.all, 'list'] as const,
  details: () => [...claimKeys.all, 'detail'] as const,

  // Level 3: Specific queries
  list: (filters: ClaimFilters = {}) => [...claimKeys.lists(), filters] as const,
  detail: (id: string) => [...claimKeys.details(), id] as const,

  // Level 4: Related data
  history: (id: string) => [...claimKeys.detail(id), 'history'] as const,
  documents: (id: string) => [...claimKeys.detail(id), 'documents'] as const,

  // Custom queries
  analytics: (filters: ClaimFilters = {}) => [...claimKeys.all, 'analytics', filters] as const,
  stats: () => [...claimKeys.all, 'stats'] as const,
};
```

### Benefits of Hierarchical Keys

```typescript
// Invalidate ALL claim-related queries
queryClient.invalidateQueries({ queryKey: claimKeys.all });

// Invalidate ALL list queries (regardless of filters)
queryClient.invalidateQueries({ queryKey: claimKeys.lists() });

// Invalidate specific filtered list
queryClient.invalidateQueries({ queryKey: claimKeys.list({ status: 'pending' }) });

// Invalidate specific detail and all its related data
queryClient.invalidateQueries({ queryKey: claimKeys.detail('claim-123') });
```

### Key Design Best Practices

✅ **Do:**

- Use `as const` for type inference
- Keep keys serializable (no functions/dates as values)
- Use hierarchical structure
- Include all variables that affect the query result

❌ **Don't:**

- Don't build keys manually in components
- Don't use non-serializable values (Functions, Dates, etc.)
- Don't make keys too specific (affects invalidation)

---

## Query Hooks

Query hooks handle **read operations** (GET requests).

### Basic Query Hook Pattern

```typescript
// src/services/claims/hooks/queries/useClaims.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { claimsService } from '../../api/claims.service';
import type { ClaimFilters, Claim } from '../../api/claims.types';
import { claimKeys } from '../../query-keys';

// Extract result type from service function
type ClaimsResult = Awaited<ReturnType<typeof claimsService.getClaims>>;

export function useClaims(
  filters: ClaimFilters = {},
  options?: Omit<UseQueryOptions<ClaimsResult, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    ...options,
  });
}
```

### Conditional Queries

Enable/disable queries based on conditions:

```typescript
export function useClaimById(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Claim, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: claimKeys.detail(id!),
    queryFn: () => claimsService.getClaimById(id!),
    enabled: !!id, // Only fetch if ID exists
    ...options,
  });
}
```

### Dependent Queries

Query that depends on data from another query:

```typescript
export function useClaimDocuments(claimId: string | undefined) {
  return useQuery({
    queryKey: claimKeys.documents(claimId!),
    queryFn: () => claimsService.getClaimDocuments(claimId!),
    enabled: !!claimId,
  });
}

// Usage in component
function ClaimDetail({ id }: { id: string }) {
  const { data: claim } = useClaimById(id);
  const { data: documents } = useClaimDocuments(claim?.id); // Waits for claim to load
}
```

### Queries with Transformations

Transform data in the hook:

```typescript
export function useClaimStats(filters: ClaimFilters = {}) {
  return useQuery({
    queryKey: claimKeys.analytics(filters),
    queryFn: () => claimsService.getClaimAnalytics(filters),
    select: (data) => ({
      // Transform data
      totalAmount: data.reduce((sum, claim) => sum + claim.amount, 0),
      averageAmount: data.length > 0 ? data.reduce((sum, c) => sum + c.amount, 0) / data.length : 0,
      byStatus: groupByStatus(data),
    }),
  });
}
```

### Prefetching

Prefetch data before it's needed:

```typescript
export function usePrefetchClaim() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: claimKeys.detail(id),
      queryFn: () => claimsService.getClaimById(id),
      staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
    });
  };
}

// Usage
function ClaimsList() {
  const prefetchClaim = usePrefetchClaim();

  return (
    <div>
      {claims.map(claim => (
        <div
          key={claim.id}
          onMouseEnter={() => prefetchClaim(claim.id)} // Prefetch on hover
        >
          {claim.title}
        </div>
      ))}
    </div>
  );
}
```

---

## Mutation Hooks

Mutation hooks handle **write operations** (POST, PUT, PATCH, DELETE).

### Basic Mutation Hook Pattern

```typescript
// src/services/claims/hooks/mutations/useCreateClaim.ts
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { claimsService } from '../../api/claims.service';
import type { Claim, CreateClaimRequest } from '../../api/claims.types';
import { claimKeys } from '../../query-keys';

type CreateClaimResult = Awaited<ReturnType<typeof claimsService.createClaim>>;

export function useCreateClaim(
  options?: UseMutationOptions<CreateClaimResult, Error, CreateClaimRequest>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.createClaim,
    ...options,
    onSuccess: (data, variables, context) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });

      // Call consumer's onSuccess
      options?.onSuccess?.(data, variables, context);
    },
  });
}
```

### Mutation with Multiple Cache Updates

```typescript
export function useUpdateClaimStatus(
  options?: UseMutationOptions<Claim, Error, { id: string; status: ClaimStatus }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => claimsService.updateClaimStatus(id, { status }),
    ...options,
    onSuccess: (data, variables, context) => {
      // Update specific claim detail cache
      queryClient.setQueryData(claimKeys.detail(variables.id), data);

      // Invalidate lists (claim might move between filtered lists)
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });

      // Invalidate stats (status change affects stats)
      queryClient.invalidateQueries({ queryKey: claimKeys.stats() });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
```

### Optimistic Updates

Update UI immediately before server responds:

```typescript
export function useUpdateClaim(
  options?: UseMutationOptions<Claim, Error, { id: string; data: Partial<Claim> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => claimsService.updateClaim(id, data),
    ...options,

    // Before mutation
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: claimKeys.detail(variables.id) });

      // Snapshot previous value
      const previousClaim = queryClient.getQueryData(claimKeys.detail(variables.id));

      // Optimistically update
      queryClient.setQueryData(claimKeys.detail(variables.id), (old: Claim | undefined) => {
        if (!old) return old;
        return { ...old, ...variables.data };
      });

      // Return context for rollback
      return { previousClaim };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previousClaim) {
        queryClient.setQueryData(claimKeys.detail(variables.id), context.previousClaim);
      }
      options?.onError?.(err, variables, context);
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.detail(variables.id) });
      options?.onSettled?.(data, error, variables, undefined);
    },
  });
}
```

### Delete Mutation

```typescript
export function useDeleteClaim(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimsService.deleteClaim,
    ...options,
    onSuccess: (data, id, context) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: claimKeys.detail(id) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });

      options?.onSuccess?.(data, id, context);
    },
  });
}
```

---

## Cache Invalidation

### Invalidation Strategies

#### 1. Broad Invalidation (Safest)

Invalidate all related queries:

```typescript
// Invalidate ALL claims queries
queryClient.invalidateQueries({ queryKey: claimKeys.all });
```

**Use when:**

- Multiple parts of the cache might be affected
- Unsure which specific queries to invalidate
- Safety is more important than network efficiency

---

#### 2. Targeted Invalidation (Efficient)

Invalidate specific query types:

```typescript
// Invalidate only list queries
queryClient.invalidateQueries({ queryKey: claimKeys.lists() });

// Invalidate specific detail
queryClient.invalidateQueries({ queryKey: claimKeys.detail(id) });
```

**Use when:**

- You know exactly which queries are affected
- Want to minimize unnecessary refetches
- Performance is important

---

#### 3. Surgical Update (Optimal)

Directly update cache without refetch:

```typescript
// Update specific claim in cache
queryClient.setQueryData(claimKeys.detail(id), updatedClaim);
```

**Use when:**

- Server response contains updated data
- Want instant UI update without refetch
- Combined with invalidation for related queries

---

### Invalidation Decision Matrix

| Mutation Type | Invalidate   | Update Directly      | Reason                                 |
| ------------- | ------------ | -------------------- | -------------------------------------- |
| Create Item   | Lists        | -                    | New item affects all lists             |
| Update Item   | Lists, Stats | Detail (if returned) | Item might move between filtered lists |
| Delete Item   | Lists        | Remove detail        | Item removed from all lists            |
| Bulk Update   | All          | -                    | Unknown which items affected           |
| Status Change | Lists, Stats | Detail               | Affects filtering and statistics       |

---

## Advanced Patterns

### Pagination

```typescript
export function useClaimsPaginated(page: number, pageSize: number, filters: ClaimFilters = {}) {
  return useQuery({
    queryKey: [...claimKeys.list(filters), { page, pageSize }],
    queryFn: () => claimsService.getClaims({ ...filters, page, pageSize }),
    keepPreviousData: true, // Keep showing old data while loading next page
  });
}
```

### Infinite Queries

```typescript
export function useClaimsInfinite(filters: ClaimFilters = {}) {
  return useInfiniteQuery({
    queryKey: [...claimKeys.lists(), 'infinite', filters],
    queryFn: ({ pageParam = 1 }) =>
      claimsService.getClaims({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore) return allPages.length + 1;
      return undefined;
    },
  });
}

// Usage
function ClaimsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClaimsInfinite();

  return (
    <>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.map(claim => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </>
  );
}
```

### Polling

```typescript
export function useClaimStatus(id: string) {
  return useQuery({
    queryKey: claimKeys.detail(id),
    queryFn: () => claimsService.getClaimById(id),
    refetchInterval: 5000, // Poll every 5 seconds
    refetchIntervalInBackground: false, // Stop when tab inactive
  });
}
```

### Background Sync

```typescript
export function useClaims(filters: ClaimFilters = {}) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
    refetchOnMount: true, // Refetch on component mount
    refetchOnWindowFocus: true, // Refetch when tab becomes active
    refetchOnReconnect: true, // Refetch when reconnecting to internet
  });
}
```

---

## Error Handling

### Hook-Level Error Handling

```typescript
export function useClaims(filters: ClaimFilters = {}) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    retry: 1, // Retry once on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onError: (error) => {
      console.error('Failed to fetch claims:', error);
    },
  });
}
```

### Component-Level Error Handling

```typescript
function ClaimsList() {
  const { data, isLoading, error } = useClaims();

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <ErrorAlert>
        Failed to load claims: {error.message}
      </ErrorAlert>
    );
  }

  return <ClaimsTable data={data} />;
}
```

### Global Error Handler

```typescript
// lib/react-query/query-client.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        // Global error logging
        if (error instanceof ApiError) {
          toast.error(`API Error: ${error.message}`);
        }
      },
    },
    mutations: {
      onError: (error) => {
        toast.error(`Operation failed: ${error.message}`);
      },
    },
  },
});
```

---

## Performance Optimization

### Reduce Unnecessary Refetches

```typescript
export function useClaims(filters: ClaimFilters = {}) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    staleTime: 1000 * 60 * 5, // Don't refetch for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on tab focus
  });
}
```

### Structural Sharing

TanStack Query automatically uses structural sharing to minimize re-renders:

```typescript
// No extra config needed - automatic!
const { data } = useClaims();
// Even if refetch returns same data, components won't re-render
```

### Select for Partial Data

Only subscribe to needed data:

```typescript
function ClaimStatusBadge({ id }: { id: string }) {
  // Only re-render when status changes, even if other claim fields update
  const status = useClaimById(id, {
    select: (claim) => claim.status,
  });

  return <Badge>{status}</Badge>;
}
```

---

## Testing

### Testing Query Hooks

```typescript
// useClaims.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClaims } from './useClaims';
import { claimsService } from '../../api/claims.service';

jest.mock('../../api/claims.service');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('useClaims fetches claims successfully', async () => {
  const mockClaims = [{ id: '1', status: 'pending' }];
  (claimsService.getClaims as jest.Mock).mockResolvedValue({ data: mockClaims });

  const { result } = renderHook(() => useClaims(), { wrapper: createWrapper() });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual({ data: mockClaims });
});
```

### Testing Mutation Hooks

```typescript
test('useCreateClaim creates claim and invalidates cache', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockClaim = { id: '1', status: 'pending' };
  (claimsService.createClaim as jest.Mock).mockResolvedValue(mockClaim);

  const { result } = renderHook(() => useCreateClaim(), { wrapper });

  act(() => {
    result.current.mutate({ amount: 1000, description: 'Test' });
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(mockClaim);
});
```

---

## Common Pitfalls

### ❌ Pitfall 1: Forgetting `...options` spread

```typescript
// Wrong - options not passed through
export function useClaims(filters: ClaimFilters, options?: ...) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    // Missing: ...options
  });
}

// Correct
export function useClaims(filters: ClaimFilters, options?: ...) {
  return useQuery({
    queryKey: claimKeys.list(filters),
    queryFn: () => claimsService.getClaims(filters),
    ...options, // ✅ Spread options
  });
}
```

---

### ❌ Pitfall 2: Not calling `options?.onSuccess`

```typescript
// Wrong - consumer's onSuccess ignored
export function useCreateClaim(options?: ...) {
  return useMutation({
    mutationFn: claimsService.createClaim,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      // Missing: options?.onSuccess?.(data, variables, context)
    },
  });
}

// Correct
export function useCreateClaim(options?: ...) {
  return useMutation({
    mutationFn: claimsService.createClaim,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: claimKeys.lists() });
      options?.onSuccess?.(data, variables, context); // ✅ Call consumer's onSuccess
    },
  });
}
```

---

### ❌ Pitfall 3: Over-invalidation

```typescript
// Wrong - invalidating everything on every mutation
onSuccess: () => {
  queryClient.invalidateQueries(); // Invalidates ALL queries!
};

// Correct - targeted invalidation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: claimKeys.lists() }); // Only claim lists
};
```

---

### ❌ Pitfall 4: Building keys manually

```typescript
// Wrong - manual key construction
const { data } = useQuery({
  queryKey: ['claims', 'list', filters], // Manual construction
  ...
});

// Correct - use key factory
const { data } = useQuery({
  queryKey: claimKeys.list(filters), // Factory function
  ...
});
```

---

### ❌ Pitfall 5: Mixing old and new patterns

```typescript
// Wrong - mixing useState with useQuery
function ClaimsList() {
  const [claims, setClaims] = useState([]);
  const { data } = useClaims(); // Unnecessary

  useEffect(() => {
    if (data) setClaims(data); // Don't do this
  }, [data]);
}

// Correct - use query data directly
function ClaimsList() {
  const { data: claims } = useClaims();
  // Use claims directly
}
```

---

## Summary

### Query Hook Template

```typescript
export function useResource(
  params: Params,
  options?: Omit<UseQueryOptions<Result, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: resourceKeys.specific(params),
    queryFn: () => resourceService.get(params),
    ...options,
  });
}
```

### Mutation Hook Template

```typescript
export function useCreateResource(options?: UseMutationOptions<Result, Error, Variables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resourceService.create,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
  });
}
```

### Key Takeaways

✅ Use hierarchical query key factories  
✅ Always accept `options` parameter in hooks  
✅ Spread `...options` in useQuery/useMutation  
✅ Call `options?.onSuccess` in mutations  
✅ Invalidate appropriate cache keys  
✅ Use optimistic updates for better UX  
✅ Handle errors gracefully at all levels  
✅ Test hooks with proper mocking
