FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Create data directory for SQLite database
RUN mkdir -p data

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
