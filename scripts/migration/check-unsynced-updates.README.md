# Migration Scripts

## check-unsynced-updates.js

This script checks whether legacy remote branches have new commits that have not yet been synced into `origin/integrate-app/<app>` via `git subtree pull`.

### Prerequisites

- `subtree-config.json` exists in the repository root.
- Required legacy remotes and branches are configured in `subtree-config.json`.
- The repository can run `git fetch`, `git log`, and `git rev-parse`.

### Usage

```bash
# Check all configured apps
node scripts/migration/check-unsynced-updates.js

# Check specific apps only
node scripts/migration/check-unsynced-updates.js --apps admin-portal,ticket-portal
```

### Output

- A Markdown report is generated at `docs/migration/unsynced-updates-report.md`.

The report includes:
- Summary of apps that need sync / are up to date / have errors.
- List of unsynced commits.
- `git subtree pull` commands per app.
- Next steps to continue legacy update routines.

### Notes

- The script only analyzes commit gaps between `origin/integrate-app/<app>` and `<remote>/<branch>`.
- The script does not perform merge or subtree pull automatically.
