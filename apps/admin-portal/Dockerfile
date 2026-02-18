# Build from monorepo root:
# docker build -f apps/admin-portal/Dockerfile -t admin-portal:local .

ARG NODE_IMAGE=node:20.19.0-alpine@sha256:8bda036ddd59ea51a23bc1a1035d3b5c614e72c01366d989f4120e8adca196d4
ARG TURBO_VERSION=2.7.6

FROM ${NODE_IMAGE} AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Create a pruned workspace for admin-portal using Turborepo's Docker flow.
FROM base AS pruner
ARG TURBO_VERSION
RUN corepack enable && npm install -g turbo@${TURBO_VERSION}
COPY . .
RUN turbo prune admin-portal --docker

# Install dependencies from pruned manifests, then build from full pruned sources.
FROM base AS deps
RUN corepack enable
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter admin-portal build

# Minimal runtime image running as non-root.
FROM ${NODE_IMAGE} AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps --chown=nextjs:nodejs /app/apps/admin-portal/public ./apps/admin-portal/public
COPY --from=deps --chown=nextjs:nodejs /app/apps/admin-portal/.next/standalone ./
COPY --from=deps --chown=nextjs:nodejs /app/apps/admin-portal/.next/static ./apps/admin-portal/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/admin-portal/server.js"]
