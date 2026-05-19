# Build from monorepo root:
# docker build -f apps/admin-portal/Dockerfile -t admin-portal:local .
# docker run -p 3000:3000 --env-file apps/admin-portal/.env admin-portal:local

ARG NODE_IMAGE=public.ecr.aws/docker/library/node:20.19.0-alpine
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
# turbo prune includes .env in out/full/, so next build picks it up automatically.
FROM base AS deps
RUN corepack enable
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_AUTH_TOKEN
ARG NEXT_PUBLIC_AUTH_SERVICE_URL
ARG NEXT_PUBLIC_TRANSACTION_SERVICE_URL
ARG NEXT_PUBLIC_PRODUCT_SERVICE_URL
ARG NEXT_PUBLIC_HELPER_SERVICE_URL
ARG NEXT_PUBLIC_PROMOTION_SERVICE_URL
ARG NEXT_PUBLIC_CHANNEL_SERVICE_URL
ARG NEXT_PUBLIC_API_POLICY_BASE_URL
ARG NEXT_PUBLIC_API_CLAIM_BASE_URL
ARG NEXT_PUBLIC_SANCTION_SERVICE_URL
ARG NEXT_PUBLIC_COUNTRY_SERVICE_URL
ARG NEXT_PUBLIC_FINANCE_SERVICE_URL
ARG NEXT_PUBLIC_THIRD_PARTY_SERVICE_URL

ENV NEXT_PUBLIC_AUTH_TOKEN=$NEXT_PUBLIC_AUTH_TOKEN \
    NEXT_PUBLIC_AUTH_SERVICE_URL=$NEXT_PUBLIC_AUTH_SERVICE_URL \
    NEXT_PUBLIC_TRANSACTION_SERVICE_URL=$NEXT_PUBLIC_TRANSACTION_SERVICE_URL \
    NEXT_PUBLIC_PRODUCT_SERVICE_URL=$NEXT_PUBLIC_PRODUCT_SERVICE_URL \
    NEXT_PUBLIC_HELPER_SERVICE_URL=$NEXT_PUBLIC_HELPER_SERVICE_URL \
    NEXT_PUBLIC_PROMOTION_SERVICE_URL=$NEXT_PUBLIC_PROMOTION_SERVICE_URL \
    NEXT_PUBLIC_CHANNEL_SERVICE_URL=$NEXT_PUBLIC_CHANNEL_SERVICE_URL \
    NEXT_PUBLIC_API_POLICY_BASE_URL=$NEXT_PUBLIC_API_POLICY_BASE_URL \
    NEXT_PUBLIC_API_CLAIM_BASE_URL=$NEXT_PUBLIC_API_CLAIM_BASE_URL \
    NEXT_PUBLIC_SANCTION_SERVICE_URL=$NEXT_PUBLIC_SANCTION_SERVICE_URL \
    NEXT_PUBLIC_COUNTRY_SERVICE_URL=$NEXT_PUBLIC_COUNTRY_SERVICE_URL \
    NEXT_PUBLIC_FINANCE_SERVICE_URL=$NEXT_PUBLIC_FINANCE_SERVICE_URL \
    NEXT_PUBLIC_THIRD_PARTY_SERVICE_URL=$NEXT_PUBLIC_THIRD_PARTY_SERVICE_URL

RUN pnpm exec turbo run build --filter=admin-portal...

# Minimal runtime image running as non-root.
# Pass env vars at runtime: docker run --env-file apps/admin-portal/.env
FROM base AS runner
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
