FROM node:23-alpine3.19
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
