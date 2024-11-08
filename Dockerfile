# Build stage
FROM node:22.5.1-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:22.5.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 5400
CMD ["node", "dist/server.js"]