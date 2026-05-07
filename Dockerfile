FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/src ./src
COPY backend/.env.example ./.env.example
COPY --from=frontend-build /app/frontend/dist ../frontend/dist
EXPOSE 5000
CMD ["node","src/server.js"]
