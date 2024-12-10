FROM node:23.3-bookworm

WORKDIR /usr/src/app

COPY . .

EXPOSE 4000

# Install dependencies
RUN npm install

ENTRYPOINT ["node", "index.js"]
