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

# Create persist directory
RUN mkdir -p persist persist-save

# Expose port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
