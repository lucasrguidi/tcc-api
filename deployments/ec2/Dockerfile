# deployments/ec2/Dockerfile
FROM node:20-bookworm-slim

WORKDIR /app

# PM2 para gerenciar o processo Node no container
RUN npm i -g pm2

# Copia manifestos e instala deps (inclui dev para compilar)
COPY package*.json ./
RUN npm ci

# Copia o restante do código
COPY . .

# Compila TypeScript para dist/
RUN npm run build

# Remove devDependencies para imagem de runtime mais enxuta (opcional)
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=3000
ENV IN_CONTAINER=1

EXPOSE 3000

# Inicia a API via PM2 usando dist/app.js
CMD ["pm2-runtime", "start", "deployments/ec2/ecosystem.config.cjs"]