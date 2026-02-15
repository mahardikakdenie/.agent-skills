# Query Patterns (TanStack Query)

These patterns standardize query and mutation usage across `admin-portal`.

## Query Keys

- Define service-scoped keys in `src/services/<service>/query-keys.ts`.
- Use hierarchical key factories for list/detail/filter variants.
- Keep keys deterministic and serializable.

## Query Hooks

Recommended shape:

```ts
export function useItems(
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<ResponseType, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: serviceKeys.list(params),
    queryFn: () => serviceApi.getItems(params),
    ...options,
  });
}
```

Rules:

- Use `useQuery` only for read operations.
- Keep query keys colocated with service domain keys.
- Do not build ad-hoc query keys in components.

## Mutation Hooks

Recommended shape:

```ts
export function useUpdateItem(
  options?: UseMutationOptions<ResponseType, Error, PayloadType>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => serviceApi.updateItem(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.lists() });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}
```

Rules:

- Use `useMutation` for writes.
- Always invalidate affected keys on success.
- If custom `onSuccess` is supplied, call `options?.onSuccess`.

## Component Usage

- Prefer service hooks over manual `useQuery`/`useMutation` in components.
- Keep component logic focused on rendering and UI orchestration.
- Keep endpoint knowledge inside service files only.
