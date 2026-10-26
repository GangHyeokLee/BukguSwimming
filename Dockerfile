# Pin the Node patch and OS family; refresh deliberately after security advisories.
FROM node:24.22.1-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Explicit opt-in for Docker development: docker build --target development ...
FROM deps AS development
ENV NODE_ENV=development
COPY --chown=node:node . .
RUN mkdir -p .next && chown node:node .next
EXPOSE 5000
USER node
CMD ["npm", "run", "dev"]

FROM deps AS builder
ENV NODE_ENV=production
# Public URL and rewrites are embedded by next build. This is not a secret.
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
COPY . .
RUN npm run build

# Default target is always the production server, never next dev.
FROM base AS runner
ENV NODE_ENV=production \
    PORT=5000 \
    HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
# Application files remain root-owned; only the Next.js cache needs write access.
RUN mkdir -p .next/cache && chown -R node:node .next/cache
USER node
EXPOSE 5000
CMD ["node", "server.js"]
