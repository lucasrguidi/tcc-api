# deployments/ec2/Dockerfile
FROM node:20-bookworm-slim

WORKDIR /app

# PM2 global
RUN npm i -g pm2

# 1) Copia manifestos e instala TODAS deps (inclui dev) para conseguir compilar
COPY package*.json ./
RUN npm ci

# 2) Copia o código fonte
COPY . .

# 3) Compila TypeScript para dist/
RUN npm run build

# 4) Remove devDependencies para imagem final mais enxuta
RUN npm prune --omit=dev

ENV NODE_ENV=production
ENV PORT=3000
ENV IN_CONTAINER=1

EXPOSE 3000

CMD ["pm2-runtime", "start", "deployments/ec2/ecosystem.config.cjs"]