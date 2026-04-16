# Stage 1: Build React app
FROM node:18 AS build

WORKDIR /app

# Build-time variable (NO default here)
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built React files
COPY --from=build /app/build /usr/share/nginx/html

# Optional: remove default nginx config (cleaner)
RUN rm /etc/nginx/conf.d/default.conf

# Basic nginx config (serves React properly)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]