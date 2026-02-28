FROM node:24.14.0-alpine AS builder

RUN npm i -g pnpm

WORKDIR /app
COPY nest-cli.json .
COPY package.json .
COPY pnpm*.yaml .
COPY tsconfig*.json .

RUN pnpm install --frozen-lockfile --ignore-scripts=false

COPY src/ src/
RUN pnpm run build

# Разделяем сборку и использование ради уменьшения объема образа
FROM node:24.14.0-alpine AS production

RUN npm i -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts=false

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"]