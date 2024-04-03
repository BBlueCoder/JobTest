# Work Test
A Node.js app to upload a file contains domains, lookup for dns records for each domain and save the result in MongoDB.

# Tech Stack
This app uses `http` module to create an http server in Node.js. in Addition to `MongoDB` module to communicate with Mongo Database.

## Processing 
To make proccessing the data efficient, I built the app using only promises and then using worker threads. 
The file [handle-upload](https://github.com/BBlueCoder/JobTest/blob/master/src/handle-upload.js) has the code of processing the data. There are a function `readFile` that uses only promises and function `readFileWithWorkers`. 

I made a simple benchmark for testing the uploading: 

````
  Promises :
  * Time to execute ≈ 32s
  * Memory ≈ 25MB
````

````
  Worker Threads :
  * Time to execute ≈ 17s
  * Memory ≈ 120MB
````

There is a big diffirence between the two in execution time. `Worker Threads` are much faster but there is a trade off. They consume more memory than promises. 

## Run the application
To run the application, clone this repository to your computer, make sure to change the database configuration in [db](https://github.com/BBlueCoder/JobTest/blob/master/src/db/client.js) file.

run the following commands : 
````
cd ./src
node ./index.js
````

The app will start listening in port `5000`

