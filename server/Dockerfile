# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm prune --omit=dev

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=file:/app/data/shopsmart.db

WORKDIR /app
RUN apk add --no-cache openssl && addgroup -S shopsmart && adduser -S shopsmart -G shopsmart
COPY --from=build --chown=shopsmart:shopsmart /app/package*.json ./
COPY --from=build --chown=shopsmart:shopsmart /app/node_modules ./node_modules
COPY --from=build --chown=shopsmart:shopsmart /app/prisma ./prisma
COPY --from=build --chown=shopsmart:shopsmart /app/src ./src
RUN mkdir -p /app/data && chown -R shopsmart:shopsmart /app

USER shopsmart
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["sh", "-c", "npx prisma migrate deploy && node prisma/seed.js && node src/index.js"]
