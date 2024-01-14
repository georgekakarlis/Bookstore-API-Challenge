# Bookstore API & UI Challenge

### Objective : 
An API for a Bookstore to manage the stock of the books. 

### Tech Stack : 
Typescript, Expressjs, PostgreSQL, Docker, Nodejs, HTML/CSS/JS
### Architecture Overview : 
The Bookstore REST API, the Notifier-Service and the PostgreSQL database inside a Microservice architecture orchestrated by Docker Compose. 
###  Key Features :
The challenge showcases backend API development, including database interaction, API documentation, error handling, and integration with external services in a microservices architecture. Also a small hint of UI development, served statically.
 ### API Endpoints :  
 Navigate in-app to the /api-docs to see full Swagger implementation.
 GET / - Serve Static index.html
 GET /book -  Retrieves a list of all books
 POST /book - Add a new book to the bookstore
 GET /book/{id} - Retrieve a specific book by its ID
 DELETE /book/{id} - Delete a book by its ID
 PUT /book/{id} - Update a book info by its ID
 ### Directory Structure : 
 The two services (1) book-service and (2) notifier-service are being orchestrated by Docker. 
 ### Installation : 
 ```
 mkdir GKChallenge && cd GKChallenge
 ```
 
 Git clone :  
 ```
 git clone  git@github.com:georgekakarlis/Bookstore-API-Challenge.git
 ```
 Make sure to create an .env file and create some database configs, eg : 
 ````
 DB_USER=postgres
DB_HOST=db
DATABASE=postgres
DB_PASS=postgres
 ````
 ##### ensure you have Docker installed on your machine. 

 then build the image : 
 ```
 docker-compose build
 ```
 then  run: 
 ```
 docker-compose up
 ```
 and navigate to http://localhost:3000 to see the live action.

The API is pre-configured to populate the database with 5 books everytime it starts. 
(populate-books.sql)

### Notifier-Service : 
A microservice to notify the bookstore owner that a book is low on stock. If the book quantity/stock is smaller than the threshold, then an API call is made from the book-service's PUT /book/{id} endpoint so that the owner can keep track of his record on books.