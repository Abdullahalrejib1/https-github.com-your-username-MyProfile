FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only for backend)
RUN npm install --production

# Copy server file
COPY server.js ./

# Expose port
EXPOSE 3001

# Environment variable for port
ENV PORT=3001

# Start server
CMD ["node", "server.js"]

