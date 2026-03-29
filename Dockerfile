ARG PNPM_CACHE_DIR=/pnpm-store

# --- Stage 1: Builder ---
FROM node:24.14.0-alpine AS builder

ARG PNPM_CACHE_DIR

RUN corepack enable
WORKDIR /app

COPY package.json pnpm*.yaml ./
COPY nest-cli.json tsconfig*.json ./

RUN --mount=type=cache,id=pnpm,target=${PNPM_CACHE_DIR} \
    pnpm install --frozen-lockfile --ignore-scripts=false --store-dir ${PNPM_CACHE_DIR}

COPY src/ src/
RUN pnpm run prepare
RUN pnpm run build

# --- Stage 2: Production ---
FROM node:24.14.0-alpine AS production

ARG PNPM_CACHE_DIR

RUN corepack enable
WORKDIR /app

COPY package.json pnpm*.yaml ./

RUN --mount=type=cache,id=pnpm,target=${PNPM_CACHE_DIR} \
    pnpm install --prod --frozen-lockfile --ignore-scripts --store-dir ${PNPM_CACHE_DIR}

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"]
