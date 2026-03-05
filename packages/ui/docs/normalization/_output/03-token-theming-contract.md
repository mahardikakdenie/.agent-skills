# Token and Theming Contract (Batch 2 Refresh)

## Token Source and Ownership
- Source of truth: `@repo/config`
- Consumer: `@repo/ui` components
- Brand overrides: app-level `globals.css` with same semantic keys

## Required Semantic Tokens
Apps must provide semantic variables used by shared components, including:
- Surface/text: `--background`, `--foreground`, `--card`, `--popover`
- Intent: `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`
- Utility: `--border`, `--input`, `--ring`, `--radius`
- Status: `--success`, `--warning`, `--info`
- Data viz: `--chart-1` to `--chart-5`

## Dark Theme Strategy
- Use the same semantic keys under `[data-theme="dark"]`
- No alternate key namespace for dark mode
- Shared components consume token values, not hardcoded dark utility colors

## Forbidden Styling in @repo/ui
- Hardcoded color literals (hex/rgb/hsl)
- App-brand utility coupling in shared components
- `!important` overrides in shared component styles
- App env var or app asset coupling

## Rollout Rule
Token normalization in `@repo/config` must land before broad component rollout in Batch 3.