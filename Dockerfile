FROM node:24.14.0-alpine AS builder

RUN npm i -g pnpm

WORKDIR /app
COPY nest-cli.json .
COPY package.json .
COPY pnpm*.yaml .
COPY tsconfig*.json .

ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true
RUN pnpm install --frozen-lockfile --ignore-scripts=false

COPY src/ src/
RUN pnpm run build
RUN pnpm run prepare

# Разделяем сборку и использование ради уменьшения объема образа
FROM node:24.14.0-alpine AS production

RUN npm i -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true
RUN pnpm install --prod --frozen-lockfile --ignore-scripts=false

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["pnpm", "start:prod"]