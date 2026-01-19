# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev for build tools)
RUN pnpm install --frozen-lockfile

# Stage 2: Build
FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code and config files
COPY . .

# Generate Prisma Client
# DATABASE_URL is required by prisma.config.ts but not used for client generation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN pnpm exec prisma generate

# Build the application using pnpm exec to avoid global CLI dependency
RUN pnpm exec nest build

# Copy Prisma package
COPY --from=build /app/node_modules/prisma ./node_modules/prisma

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy Prisma files
COPY prisma ./prisma
COPY prisma.config.ts ./

# Copy Prisma Client from build stage
# pnpm stores generated Prisma Client in node_modules/.pnpm
COPY --from=build /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Copy Prisma CLI from build stage (needed for migrations)
# Copy the entire prisma package and its binaries
COPY --from=build /app/node_modules/prisma ./node_modules/prisma


# Copy built application
COPY --from=build /app/dist ./dist


# Install PostgreSQL client for health checks
RUN apk add --no-cache postgresql-client && \
    chmod +x /app/scripts/docker-entrypoint.sh

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Change ownership
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"


# Start the application
CMD ["node", "dist/main"]
