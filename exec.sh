docker-compose up -d
mongo --host localhost --port 27018 -u admin -p password --authenticationDatabase admin
docker cp movies.json mongodb_service:/movies.json
docker exec -it mongodb_service mongoimport --username admin --password password --authenticationDatabase admin --db mflix --collection movies --file /movies.json --jsonArray
docker-compose up -d --build
