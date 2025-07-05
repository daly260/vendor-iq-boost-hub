# Stage 1: Build
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy project files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.* ./
COPY . .

# Install dependencies
RUN npm install

# Build the Vite app
RUN npm run build

# ------------------------------------------------------

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy build from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
