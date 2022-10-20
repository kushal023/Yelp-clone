Here I build Node.js and PostgreSQL CRUD using Express and node-postgres and also Implement caching with Redis I have run PostgreSQL, pgAdmin and redis in docker for local development using docker compose.

## How to run it locally?
Clone the repo and follow below instruction to do it.

```
$ git clone https://github.com/kushalchauhan7629/Yelp-clone.git
```
Now navigate to Yelp-clone folder and run npm install like below.
```
$ cd Yelp-clone

$ npm install
```
Now run the below command to run postgreSQL, pgAdmin4 and redis in a detached mode

```
docker compose up -d
```

Run
```
$ npm start
```