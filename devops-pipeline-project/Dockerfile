# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY app/package*.json ./
RUN npm install --production
COPY app/ .

# Stage 2: Run (smaller final image)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app .
ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
