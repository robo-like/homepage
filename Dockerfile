# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package files for production
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy build artifacts from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/data ./data
COPY --from=build /app/public ./public

# Expose the port the app runs on
EXPOSE 3000

# Add a script to run the server with the correct port
RUN echo '#!/bin/sh\n\
PORT=${PORT:-3000}\n\
exec node ./build/server/index.js' > /app/start.sh && chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]