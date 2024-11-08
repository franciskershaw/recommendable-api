# Build stage - Compiles TypeScript to JavaScript
FROM node:22.5.1-alpine as builder

# Set working directory for build stage
WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript into JavaScript
RUN npm run build

# -----------------------------------------------------------------------------

# Production stage - Lighter image with only production dependencies
FROM node:22.5.1-alpine

# Set working directory for production stage
WORKDIR /usr/src/app

# Copy package files for production
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built JavaScript files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose API port
EXPOSE 5400

# Start the Node.js application
CMD ["node", "dist/server.js"]