FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only for backend)
RUN npm install --production

# Copy server file (Supabase version)
COPY server-supabase-api.js ./

# Expose port
EXPOSE 3001

# Environment variable for port
ENV PORT=3001

# Start server
CMD ["node", "server-supabase-api.js"]

