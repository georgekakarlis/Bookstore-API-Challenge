FROM node:18

WORKDIR /usr/src/app

COPY book-service/package*.json ./book-service/
COPY notifier-service/package*.json ./notifier-service/

RUN cd book-service && npm install
RUN cd notifier-service && npm install

COPY book-service/ ./book-service/
COPY notifier-service/ ./notifier-service/

EXPOSE 3000
EXPOSE 4000

CMD cd /usr/src/app/book-service && npm start & cd /usr/src/app/notifier-service && npm start
