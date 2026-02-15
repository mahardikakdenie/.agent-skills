#!/usr/bin/env node

/**
 * Unsynced Legacy Updates Checker
 *
 * Checks if legacy repo remotes have new commits that haven't been
 * merged to integrate-app/* branches via git subtree pull.
 *
 * Requires: subtree-config.json file with remote configurations
 *
 * Usage:
 *   node scripts/migration/check-unsynced-updates.js [--apps app1,app2,...]
 *
 * Examples:
 *   node scripts/migration/check-unsynced-updates.js (checks all apps)
 *   node scripts/migration/check-unsynced-updates.js --apps admin-portal,ticket-portal
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const adminPortalRoot = path.resolve(__dirname, '..', '..');

// Parse command line arguments
const args = process.argv.slice(2);
let filterApps = null;

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--apps' && args[i + 1]) {
    filterApps = args[i + 1].split(',').map((app) => app.trim());
    i += 1;
  }
}

console.log('🔍 Checking for unsynced updates from legacy repos...\n');
if (filterApps) {
  console.log(`📋 Checking specific apps: ${filterApps.join(', ')}\n`);
} else {
  console.log('📋 Checking all configured apps\n');
}

/**
 * Execute git command and return output
 */
function execGit(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', ...options }).trim();
  } catch (error) {
    if (options.allowError) {
      return null;
    }
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    return null;
  }
}

/**
 * Load subtree configuration
 */
function loadSubtreeConfig() {
  const configPath = path.join(adminPortalRoot, 'subtree-config.json');

  if (!fs.existsSync(configPath)) {
    console.error('❌ Error: subtree-config.json not found!');
    console.error(`   Expected at: ${configPath}\n`);
    console.error('   Please create this file with your legacy repo configurations.');
    console.error('   See subtree-config.example.json for format.\n');
    process.exit(1);
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return config.repos || [];
  } catch (error) {
    console.error('❌ Error reading subtree-config.json:', error.message);
    process.exit(1);
  }
}

/**
 * Get last commit hash for a branch
 */
function getLastCommitHash(branch) {
  const command = `git log ${branch} -1 --format="%H"`;
  return execGit(command, { allowError: true });
}

/**
 * Get commits between two points
 */
function getCommitsBetween(base, head) {
  // Get ALL commits that are in head but not in base
  // Don't use --since here as it filters before comparison
  const command = `git log ${base}..${head} --format="%H|%an|%ai|%s"`;
  const output = execGit(command, { allowError: true });

  if (!output) return [];

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, author, date, subject] = line.split('|');
      return {
        hash: hash.substring(0, 8),
        fullHash: hash,
        author,
        date: new Date(date),
        dateStr: date,
        subject,
      };
    });
}

/**
 * Check if remote exists
 */
function remoteExists(remoteName) {
  const remotes = execGit('git remote', { allowError: true });
  if (!remotes) return false;
  return remotes.split('\n').includes(remoteName);
}

/**
 * Main execution
 */
function main() {
  let repos = loadSubtreeConfig();

  if (repos.length === 0) {
    console.log('❌ No repositories configured in subtree-config.json');
    process.exit(1);
  }

  // Filter repos if --apps flag is provided
  if (filterApps) {
    repos = repos.filter((repo) => filterApps.includes(repo.app));
    if (repos.length === 0) {
      console.log('❌ No matching apps found in subtree-config.json');
      console.log(`   Requested: ${filterApps.join(', ')}`);
      process.exit(1);
    }
  }

  console.log(`Found ${repos.length} configured repositories\n`);

  // First, fetch all remotes
  console.log('📥 Fetching from remotes...\n');
  const fetchedRemotes = new Set();

  for (const repo of repos) {
    if (!remoteExists(repo.remote)) {
      console.log(`⚠️  Remote '${repo.remote}' not found, skipping ${repo.app}`);
      continue;
    }

    if (!fetchedRemotes.has(repo.remote)) {
      process.stdout.write(`   Fetching ${repo.remote}... `);
      const result = execGit(`git fetch ${repo.remote}`, { allowError: true });
      if (result !== null) {
        console.log('✅');
        fetchedRemotes.add(repo.remote);
      } else {
        console.log('❌');
      }
    }
  }

  console.log('\n📊 Analyzing updates...\n');

  const needsUpdate = [];
  const upToDate = [];
  const errors = [];

  for (const repo of repos) {
    process.stdout.write(`Checking ${repo.app}... `);

    // Check if remote branch exists
    const remoteBranch = `${repo.remote}/${repo.branch}`;
    const remoteBranchExists = execGit(`git rev-parse --verify ${remoteBranch}`, {
      allowError: true,
    });

    if (!remoteBranchExists) {
      console.log(`❌ Remote branch not found`);
      errors.push({
        app: repo.app,
        error: `Remote branch ${remoteBranch} not found`,
      });
      continue;
    }

    // Check if integrate-app/* branch exists
    const integrateBranch = `integrate-app/${repo.app}`;
    const integrateBranchExists = execGit(`git rev-parse --verify origin/${integrateBranch}`, {
      allowError: true,
    });

    if (!integrateBranchExists) {
      console.log('⚠️  integrate-app/* branch not found');
      errors.push({
        app: repo.app,
        error: `Branch origin/${integrateBranch} not found`,
      });
      continue;
    }

    // Get commits that are in remote but not in integrate-app/*
    const unsyncedCommits = getCommitsBetween(`origin/${integrateBranch}`, remoteBranch);

    if (unsyncedCommits.length > 0) {
      needsUpdate.push({
        app: repo.app,
        remote: repo.remote,
        branch: repo.branch,
        prefix: repo.prefix,
        unsyncedCount: unsyncedCommits.length,
        latestCommit: unsyncedCommits[0],
        commits: unsyncedCommits,
      });
      console.log(`🔔 ${unsyncedCommits.length} unsynced commit(s)`);
    } else {
      upToDate.push({
        app: repo.app,
        remote: repo.remote,
        branch: repo.branch,
      });
      console.log('✅ Up to date');
    }
  }

  // Generate report
  const reportDir = path.join(adminPortalRoot, 'docs', 'migration');
  const reportPath = path.join(reportDir, 'unsynced-updates-report.md');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportContent = generateMarkdownReport(needsUpdate, upToDate, errors);
  fs.writeFileSync(reportPath, reportContent, 'utf8');

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Report generated: ${reportPath}`);
  console.log('='.repeat(60) + '\n');

  // Summary
  console.log('📈 Summary:');
  console.log(`   🔔 Apps needing subtree pull: ${needsUpdate.length}`);
  console.log(`   ✅ Apps up to date: ${upToDate.length}`);
  console.log(`   ❌ Errors: ${errors.length}\n`);

  if (needsUpdate.length > 0) {
    console.log('🔔 Apps needing subtree pull (sorted A-Z):');
    needsUpdate.sort((a, b) => a.app.localeCompare(b.app));
    needsUpdate.forEach((r) => {
      console.log(
        `   • ${r.app} (${r.unsyncedCount} commits, latest: ${r.latestCommit.dateStr.split('T')[0]})`,
      );
    });
    console.log('');
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(needsUpdate, upToDate, errors) {
  const now = new Date();
  const reportDate = now.toISOString();

  let md = `# Unsynced Legacy Updates Report

> **Generated:** ${reportDate}  
> **Total Repositories:** ${needsUpdate.length + upToDate.length}

---

## 📊 Summary

- 🔔 **Apps needing subtree pull:** ${needsUpdate.length}
- ✅ **Apps up to date:** ${upToDate.length}
- ❌ **Errors:** ${errors.length}

---

## 🔔 Apps Needing Subtree Pull (${needsUpdate.length})

`;

  if (needsUpdate.length === 0) {
    md += '*All apps are up to date with their legacy repositories.*\n\n';
  } else {
    md +=
      "These apps have new commits in legacy repo that haven't been synced via subtree pull:\n\n";

    // Sort alphabetically
    needsUpdate.sort((a, b) => a.app.localeCompare(b.app));

    md += '| App | Unsynced Commits | Latest Commit | Author | Subject |\n';
    md += '|-----|------------------|---------------|--------|--------|\n';

    needsUpdate.forEach((r) => {
      const dateStr = r.latestCommit.date.toISOString().split('T')[0];
      const timeStr = r.latestCommit.date.toISOString().split('T')[1].substring(0, 8);
      const subject =
        r.latestCommit.subject.substring(0, 50) + (r.latestCommit.subject.length > 50 ? '...' : '');

      md += `| **${r.app}** | ${r.unsyncedCount} | ${dateStr} ${timeStr} | ${r.latestCommit.author} | ${subject} |\n`;
    });

    md += '\n### Details\n\n';

    needsUpdate.forEach((r) => {
      md += `#### ${r.app}\n\n`;
      md += `**Remote:** \`${r.remote}/${r.branch}\`  \n`;
      md += `**Unsynced commits:** ${r.unsyncedCount}\n\n`;

      md += '| Commit | Date | Author | Subject |\n';
      md += '|--------|------|--------|--------|\n';

      r.commits.forEach((c) => {
        const dateStr = c.date.toISOString().split('T')[0];
        const subject = c.subject.substring(0, 60) + (c.subject.length > 60 ? '...' : '');
        md += `| \`${c.hash}\` | ${dateStr} | ${c.author} | ${subject} |\n`;
      });

      md += '\n**Command to sync:**\n\n';
      md += '```bash\n';
      md += `git checkout integrate-app/${r.app}\n`;
      md += `git subtree pull --prefix=${r.prefix} ${r.remote} ${r.branch}\n`;
      md += `git push origin integrate-app/${r.app}\n`;
      md += '```\n\n';
      md += '---\n\n';
    });
  }

  md += `## ✅ Apps Up to Date (${upToDate.length})

`;

  if (upToDate.length > 0) {
    md += 'These apps have no unsynced commits (already up to date):\n\n';

    // Sort alphabetically
    upToDate.sort((a, b) => a.app.localeCompare(b.app));

    md += '| App | Remote Branch |\n';
    md += '|-----|---------------|\n';

    upToDate.forEach((r) => {
      md += `| ${r.app} | \`${r.remote}/${r.branch}\` |\n`;
    });

    md += '\n';
  }

  if (errors.length > 0) {
    md += `---

## ❌ Errors (${errors.length})

`;

    errors.forEach((e) => {
      md += `- **${e.app}**: ${e.error}\n`;
    });

    md += '\n';
  }

  md += `---

## 🔄 Next Steps

`;

  if (needsUpdate.length > 0) {
    md += `### Option 1: Sync All Apps

\`\`\`bash
# Run sync for all apps needing update
`;

    needsUpdate.forEach((r) => {
      md += `# ${r.app}\n`;
      md += `git checkout integrate-app/${r.app}\n`;
      md += `git subtree pull --prefix=${r.prefix} ${r.remote} ${r.branch}\n`;
      md += `git push origin integrate-app/${r.app}\n\n`;
    });

    md += `\`\`\`

### Option 2: Sync Specific Apps

See detailed commands in the "Details" section above.

### Option 3: After Syncing

Once you've synced integrate-app/* branches, use the legacy update routines:

\`\`\`bash
# Check which integrate-app/* branches need merging to migrate-app/*
node scripts/migration/check-unsynced-updates.js

# Then follow apps/admin-portal/docs/migration/service/legacy-update-batch-prompts.md
\`\`\`
`;
  } else {
    md += `All apps are up to date! No subtree pulls needed.

You can still check if any integrate-app/* branches need merging to migrate-app/*:

\`\`\`bash
node scripts/migration/check-unsynced-updates.js
\`\`\`
`;
  }

  md += '\n---\n\n';
  md +=
    '*This report was auto-generated by `scripts/migration/check-unsynced-updates.js`*\n';

  return md;
}

// Run
main();
