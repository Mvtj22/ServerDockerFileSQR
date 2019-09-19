FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Enviroment Variable
ENV PORT=3000
ENV MONGO_DB=robo
ENV DATABASE_URL=localhost
ENV DATABASE_PORT=27017
# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install --save-dev nodemon
RUN npm install pm2 -g
# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "pm2-runtime", "npm", "--", "start" ]
#CMD ["node" "server.js"]