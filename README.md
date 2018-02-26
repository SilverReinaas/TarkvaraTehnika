## Installation

- Log into PostgreSQL as superuser (postgres)
- Create a user and a database for the app like this:  
    *CREATE USER spordisidrun PASSWORD 'sidrunspordi'*  
    *CREATE DATABASE spordisidrun;*  
    *GRANT ALL PRIVILEGES ON DATABASE spordisidrun TO spordisidrun;*    
- Open the project in IntelliJ IDEA
- Add your user account to **data.sql** (table is created in **schema.sql**)
- In application.properties, set **spring.datasource.initialize** to **true**
- Go to the command line into the project directory and run: **mvn clean compile spring-boot:run**. This will initialize the database for the first time, compile all the sources and start the app.
- Change **spring.datasource.initialize** to **false** again.
- Go to **http://localhost:8080** and see the Hello World page.
- rain is testing commiting
