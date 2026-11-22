FROM mcr.microsoft.com/playwright:v1.39.0-jammy
WORKDIR /app
RUN npm install --no-save netlify-cli@21.6.0 node-jq