FROM node:20-alpine

WORKDIR /app

RUN npm i -g pm2

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pm2-runtime", "start", "deployments/ec2/ecosystem.config.cjs"]