FROM node:14 as dev

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

ENV app_name=consumption-reader

COPY . .

CMD [ "npm", "run", "start", "${app_name}" ]
