# Use the specific Node version
FROM node:22.5.1-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for better Docker cache utilization
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon for hot reloading
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 5400

# Start the app with nodemon for hot reloading
CMD ["nodemon", "--watch", "src", "--exec", "ts-node", "src/server.ts"]
