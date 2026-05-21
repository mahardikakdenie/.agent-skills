# AI Agent Skills CLI 🤖

[![npm version](https://img.shields.io/npm/v/@mahardikakdenie/agent-skills.svg)](https://www.npmjs.com/package/@mahardikakdenie/agent-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful Command Line Interface (CLI) tool designed to instantly bootstrap your projects with curated **AI Agent Skills**. 

This tool ensures that AI assistants (like **Gemini CLI**, **Claude Code**, **Cursor**, or **Windsurf**) understand your codebase conventions, architectural patterns, and engineering standards from the very first prompt.

---

## 🌟 Why this exists?

AI Agents are revolutionizing development, but they often lack context about *your* specific project rules. They typically ignore `node_modules`, meaning library-based documentation is invisible to them. 

By injecting physical, structured markdown skills directly into your project's `.agents/` directory, you provide a "brain" that the AI can read and follow, resulting in:
- **Zero Hallucinations**: AI follows your team's actual patterns.
- **Instant Onboarding**: New AI sessions know your architecture immediately.
- **Consistent Quality**: Every line of code generated adheres to your standards.

---

## 🚀 Quick Start

No installation required. Run it directly using `npx` in your project root:

```bash
npx @mahardikakdenie/agent-skills
```

This will create a `.agents/` directory containing all optimized skill sets.

---

## 📚 Included Skills

The CLI currently bundles **13 specialized skills**:

| Skill | Description |
| :--- | :--- |
| `monorepo-workspace` | Standardizes package boundaries and Turbo/pnpm workflows. |
| `react-query` | Best practices for TanStack Query v5 and service layers. |
| `forms-validation` | Schema-first validation using react-hook-form + zod. |
| `design-system` | Standards for building and maintaining `@repo/ui` components. |
| `impeccable` | High-end UX/UI design, polish, and accessibility guidelines. |
| `systematic-debugging` | A rigorous 4-phase root-cause investigation process. |
| `turborepo` | Pipeline orchestration and caching optimization rules. |
| `next-best-practices` | App Router, RSC boundaries, and Next.js performance. |
| `next-cache-components` | Next.js 16+ `use cache` and Partial Prerendering (PPR). |
| `next-upgrade` | Automated workflows for Next.js version migrations. |
| `vercel-react-best-practices` | 45 performance rules maintained by Vercel Engineering. |
| `vercel-composition-patterns` | Advanced compound components and composition logic. |
| `web-design-guidelines` | Vercel's official web interface accessibility standards. |

---

## 🛠️ Requirements

- **Node.js**: v20.19.0 or higher.
- **Package Manager**: pnpm, npm, or yarn.

---

## 🔧 How it Works

1. The tool identifies your project root.
2. It copies the structured `.agents/` knowledge base into your repo.
3. Your AI assistant detects these files (via `CLAUDE.md`, `.cursorrules`, or Gemini's auto-discovery).
4. **Ready to go!** Your AI assistant is now fully aligned with your specific technical stack and architectural standards.

---

## 🤝 Contributing

We welcome updates to existing skills or new skill additions!

1. Clone this repository.
2. Add/Edit files in `template/.agents/`.
3. Test locally using `node bin/cli.js`.
4. Submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Maintained and updated by the **PT FriendsureTech Developer Team**. Empowering seamless AI-Human collaboration.*
