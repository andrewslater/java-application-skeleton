Java Skeleton Web Application
===============================
This is a sample Spring Boot web application which provides basic functionality common to many projects:

-  JDBC connection to a relational database (default Postgres)
-  Database migrations using flyway and a Maven plugin for generating new migrations
-  ORM via Hibernate
-  User registration and email confirmation
-  Client-side form validation using http://formvalidation.io
-  Isomorphic React component rendering (http://winterbe.com/posts/2015/02/16/isomorphic-react-webapps-on-the-jvm/)
-  JS / CSS minification
-  SASS and JSX precompilation
-  i18n
-  OAuth2 resource server 
-  OAuth2 authorization server
-  HATEOAS REST API authorized via OAuth2
-  Templated emails using http://zurb.com/ink/
-  Application system settings persisted in the database 

Building
------------

    mvn clean package

Running
------------

    java -jar -Dspring.profiles.active=development target/webapp-0.1-SNAPSHOT.jar
 
 Two default users will be created:
 
 user@example.com / p4ssw0rd
 admin@example.com / p4ssw0rd
 
Create a new database migration
------------

    mvn java-application-skeleton:new-migration -DmigrationName="add-features-table"    

creates a new database migration:

    src/main/resources/db/migrations/V1434629552__add-features-table.sql
    
API Examples
------------

### Retrieve OAuth2 token

    curl -X POST -vu <client>:<secret> http://localhost:8080/skeleton/oauth/token -H "Accept: application/json" -d "password=<password>&username=<email>&grant_type=password&scope=read%20write"

        {
          "access_token": "ff16372e-38a7-4e29-88c2-1fb92897f558",
          "token_type": "bearer",
          "refresh_token": "f554d386-0b0a-461b-bdb2-292831cecd57",
          "expires_in": 43199,
          "scope": "read write"
        }

### List Users

    curl http://localhost:8080/skeleton/api/users -H "Authorization: Bearer ff16372e-38a7-4e29-88c2-1fb92897f558" -H "Accept: application/json"




