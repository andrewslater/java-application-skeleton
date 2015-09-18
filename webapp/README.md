Java Skeleton Web Application
===============================
This is a sample Spring Boot web application which provides basic functionality common to many projects:

-  JDBC connection to a relational database (default Postgres)
-  Database migrations using flyway and a Maven plugin for generating new migrations
-  ORM via Hibernate
-  User registration and email confirmation
-  Client-side route driven application using React + Fluxxor
-  JS / CSS minification
-  SASS and JSX precompilation
-  i18n
-  OAuth2 resource server 
-  OAuth2 authorization server
-  HATEOAS REST API authorized via OAuth2
-  Templated emails using http://zurb.com/ink/
-  Application system settings persisted in the database 

# Prerequisites

## Maven 3
Maven (https://maven.apache.org/) is our build system. It allows us to easily build our application.

## PostgreSQL
PostgreSQL is used for the relational database. This is where all of our application data is stored. 
 
# Configuration
Start by cloning the repository and setting up a local development configuration file.

Create src/main/resources/config/application-development.properties config and override the following properties:

    oauth2.clients.webapp.secret=92bd0e2f-9048-489f-a414-f7770ba94647
    spring.datasource.username=your_database_username
    spring.datasource.password=your_database_user_password
    
    spring.mail.username=your_sendgrid_username
    spring.mail.password=your_sendgrid_password

* These properties will be unique to your system. 
* The webapp client secret should be something hard to guess. 
* In this case we're using a UUID which was generated for us by https://www.uuidgenerator.net/ 
  * Use your own UUID! Don't just blindly copy this value into your app 
* I recommend using https://sendgrid.com/ for sending emails from your application. 
  * They offer a free plan which allows you to send 12k emails per month for free. 
  * Simply sign up for an account and set your account username/password in application-development.properties.
  * Using Sendgrid allows your application to send emails without requiring you to run your own mail server
 
# Building

From the main java-application-skeleton directory run:

    mvn clean package

# Running

    java -jar -Dspring.profiles.active=development target/webapp-0.1-SNAPSHOT.jar
 
 The first time you run the application the database schema will be created and some sample data will be inserted into it. 
 Two default users will be created:
 
 user@example.com / p4ssw0rd
 admin@example.com / p4ssw0rd
 
 Additionally 10k random users are also created. All users have use the password 'password'.
 
# Create a new database migration

    mvn java-application-skeleton:new-migration -DmigrationName="add-features-table"    

creates a new database migration:

    src/main/resources/db/migrations/V1434629552__add-features-table.sql
    
# API Examples

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

# Seed Data

It is useful in a development environment to have some representative data. There is rudimentary support for generating fake users in the java-application-skeleton plugin. First we run a command to create the file /tmp/users.sql and fill it with SQL which will insert 1000 random users. All users share the same password: p4ssw0rd

    mvn java-application-skeleton:seed-users -DnumUsers=1000 -Doutput=/tmp/users.sql
    
Next we run the psql shell and pass the /tmp/users.sql file to it in order to insert them into the 'java-app-skeleton' database. You may need to pass additional arguments to the psql command depending on your configuration.
 
    psql --file=/tmp/users.sql java-app-skeleton 

TODO: Have the plugin connect automatically to the database
