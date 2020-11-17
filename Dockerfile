FROM node:alpine

RUN apk update && apk add ca-certificates && update-ca-certificates

RUN mkdir /app
ADD . /app
WORKDIR /app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
RUN npm install
CMD /wait && npm start