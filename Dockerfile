# MahaUdyogSetu - Production Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build client + server bundle
COPY . .
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
# If .env exists in context, copy it
COPY --from=builder /app/.env* ./

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
