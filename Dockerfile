# ── Stage 1: build de los frontends ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Instalar dependencias raíz (backend + devDeps necesarias para el build)
COPY package*.json ./
RUN npm ci

# 2. Copiar e instalar dependencias del frontend Svelte
COPY src/frontend/package*.json ./src/frontend/
RUN cd src/frontend && npm ci

# 3. Copiar e instalar dependencias del frontend React
COPY src/frontend-react/package*.json ./src/frontend-react/
RUN cd src/frontend-react && npm ci

# 4. Copiar el resto del código fuente
COPY . .

# 5. Construir ambos frontends (usa el script ya definido en package.json raíz)
RUN npm run build

# ── Stage 2: imagen de producción ────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Solo dependencias de producción (sin devDeps)
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar el código del backend
COPY --from=builder /app/index.js ./
COPY --from=builder /app/src/backend ./src/backend
COPY --from=builder /app/data ./data

# Copiar los builds de los frontends
COPY --from=builder /app/src/frontend/build ./src/frontend/build
COPY --from=builder /app/src/frontend-react/dist ./src/frontend-react/dist

# Directorio persistente para NeDB
RUN mkdir -p /app/data/db && chown -R node:node /app/data

USER node

EXPOSE 3000

CMD ["node", "index.js"]
