FROM node:24.14.0-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json .
COPY pnpm*.yaml .

COPY nest-cli.json .
COPY tsconfig*.json .

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts=false --store-dir /root/.local/share/pnpm/store

COPY src/ src/
RUN pnpm run prepare
RUN pnpm run build

# Разделяем сборку и использование ради уменьшения объема образа
FROM node:24.14.0-alpine AS production

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile --ignore-scripts=false --store-dir /root/.local/share/pnpm/store

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"]