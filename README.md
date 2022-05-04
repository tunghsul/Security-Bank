# Security-Bank

### Note: For M1 Mac users, edit the docker-compose.yml file under services -> mysql_db -> add this "platform: linux/x86_64"
```
cd client
npm install
```

```
cd ../server
npm install
```

```
cd ..
docker-compose up --build
```
database
http://localhost:8000/

application
http://localhost:3050/
