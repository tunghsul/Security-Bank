# SWE 266P: Security-Bank
Developed by Project Group #5: Yi Chen, Tung-Hsuan Lin, Shih-Lei Chen, and Michael Nguyen


## **Getting Started**:

Clone the project into your desired working directory and changed the directory to the Security-Bank
``` 
git clone git@github.com:tunghsul/Security-Bank.git
cd Security-Bank
```
> **M1 Mac users, follow these steps before building the app**:
> 1) Edit the docker-compose.yml file 
> 2) Add this "platform: linux/x86_64" under services -> mysql_db
> 3) It should look like this services: mysql_db: platform: linux/x86_64


Go to the client folder and install the dependencies
```
cd client
npm install
```

Go to the server folder and install the dependencies
```
cd ../server
npm install
```

Go back to the root folder (Security-Bank) and build the docker image (verify Docker is opened beforehand on your system)
```
cd ..
docker-compose up --build
```

## **Viewing the Application**:

### Database: http://localhost:8000/

* host: mysql_db
* username: MYSQL_USER
* password: MYSQL_PASSWORD
* database: bank

### Application: http://localhost:3050/
