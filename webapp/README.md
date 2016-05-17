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

    spring.datasource.username=your_database_username
    spring.datasource.password=your_database_user_password
    
    spring.mail.username=your_sendgrid_username
    spring.mail.password=your_sendgrid_password

* These properties will be unique to your system. 
* I recommend using https://sendgrid.com/ for sending emails from your application. 
  * Using Sendgrid allows your application to send emails without requiring you to run your own mail server
  * They offer a free plan which allows you to send 12k emails per month for free. 
  * Simply sign up for an account and set your account username/password in application-development.properties.
 
# Building

From the main java-application-skeleton directory run:

    mvn clean install

# Running

    java -jar -Dspring.profiles.active=development target/webapp-0.1-SNAPSHOT.jar
 
 The first time you run the application the database schema will be created and some sample data will be inserted into it. 
 Two default users will be created:
 
 user@example.com / p4ssw0rd
 admin@example.com / p4ssw0rd
 
 You can generate random test users by using the db plugin as described below.
 
# Development

## Database Migrations

    mvn db:new-migration -DmigrationName="add-features-table"    

creates a new database migration:

    src/main/resources/db/migrations/V1434629552__add-features-table.sql

## Frontend Development

When running locally during development it's nice to be able to iterate on javascript and css without having to recompile and redeploy the application after every change. To support this there is an application configuration property named `webpack.mode`. 
    
    # When set to PRECOMPILED (the default value) javascript, css, and fonts are served from the packaged JAR 
    webpack.mode = PRECOMPILED
         
    # When set to DYNAMIC javascript, css, and fonts are served from a local server
    webpack.mode = DYNAMIC
    
Grunt is already configured to help you run this local asset server from the command line. From the `webapp/` directory run the following command:
    
    $ grunt watchjs
    
    Running "webpack-dev-server:start" (webpack-dev-server) task
    webpack-dev-server on port 9090
    Version: webpack 1.12.9
                                     Asset     Size  Chunks             Chunk Names
    db812d8a70a4e88e888744c1c9a27e89.woff2  66.6 kB          [emitted]
      f4769f9bdb7466be65088239c12046d1.eot  20.1 kB          [emitted]
     fa2772327f55d8198301fdb8bcfc8158.woff  23.4 kB          [emitted]
      e18bbf611f2a2e43afc071aa2f4e1512.ttf  45.4 kB          [emitted]
      89889688147bd7575d6327160d64e760.svg   109 kB          [emitted]
      32400f4e08932a94d8bfd2422702c446.eot  70.8 kB          [emitted]
    448c34a56d699c29117adc64c43affeb.woff2    18 kB          [emitted]
     a35720c2fed2c7f043bc7e4ffb45e073.woff  83.6 kB          [emitted]
      a3de2170e4e9df77161ea5d3f31b2668.ttf   142 kB          [emitted]
      f775f9cca88e21d45bebe185b27c0e5b.svg   366 kB          [emitted]
                                    app.js  3.84 MB       0  [emitted]  app
                                  basic.js   1.1 MB       1  [emitted]  basic
    webpack: bundle is now VALID.

Now there is a server running on localhost:9090 which is serving assets (as defined in `webpack-config.js`). The grunt process watches the filesystem for changes to files and automatically recompiles on the fly. This means you can make changes to javascript or css and the results are immediately refelected when you refresh the page in your browser.
        
    
# API Examples

### Create OAuth2 Client

    INSERT INTO oauth_client_details (client_id, resource_ids, client_secret, scope, authorized_grant_types, authorities) VALUES ('webapp', 'restservice', 'webapp-secret', 'read,write', 'password,refresh_token', 'USER');
    
### Retrieve OAuth2 token

    curl -X POST -vu <client>:<secret> http://localhost:8080/oauth/token -H "Accept: application/json" -d "password=<password>&username=<email>&grant_type=password&scope=read%20write"

        {
          "access_token": "ff16372e-38a7-4e29-88c2-1fb92897f558",
          "token_type": "bearer",
          "refresh_token": "f554d386-0b0a-461b-bdb2-292831cecd57",
          "expires_in": 43199,
          "scope": "read write"
        }

### List Users

    curl http://localhost:8080/api/users -H "Authorization: Bearer ff16372e-38a7-4e29-88c2-1fb92897f558" -H "Accept: application/json"

# Seed Data

It is useful in a development environment to have some representative data. There is rudimentary support for generating fake users in the db plugin. Here we pipe the output of the maven task to Postgres. 

    mvn db:seed-users -DnumUsers=1000 -q | psql java-application-skeleton
    
All users share the same password: p4ssw0rd

TODO: Have the plugin connect automatically to the database
