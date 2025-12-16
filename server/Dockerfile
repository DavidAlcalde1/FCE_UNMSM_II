# server/Dockerfile
FROM node:18-alpine
WORKDIR /app

# copiar manifiestos primero (aprovecha caché)
COPY package*.json ./
RUN npm ci --only=production

# copiar fuentes
COPY . .

EXPOSE 4000
CMD ["node","src/app.js"]