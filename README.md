# 3813ICT_Assignment_1

## Version Control
This assignment applies git version control at the point where it has been implemented with creating new user, remove existing user. 
Along with 4 components: account, login, register, remove-user and 1 service (login-service).
The git repository contains README.md file and 1 folder which is angular project in order to prevent any naming convention error.
From then, each small changes will be committed into the repo to keep track of the project.

## Rest API (NodeJs and Angular)
The front-end Angular application communicates with NodeJs server through service which they pass specific parameters to the service which will then go to the server to execute the function based on the provided routes:
+ http://localhost:3000/api/auth: this route is to check the log in authentication where it has been defined in the server.js file with 2 parameters required (email and password) with POST method, the process of looping through the users array and return a boolean to indicate the authentication is success or denied. The parameters are passed through service and then log in component subscribes to that service and use the function to check user log in. And then store the email and type in local and session storage.
+ http://locahost:3000/api/create: this route is to create new user in the array where it has been defined in the server.js file with 2 parameters required (email and password) with POST method, the process is looping through the array and check whether the email are already exist in the array, if not then continue to store them into a dictionary and add to the array. The parameters are passed through service and then register component subscribes to that service and use the function to check user log in.
+ http://localhost:3000/api/delete: this route is to remove an existing user in the array where it has been defined in the server.js file with 1 parameter required (email) with POST method, however only the super admin can remove users. The process is find the index of the email in the array and remove it using splice(). The email is passed through service and then remove-user component subscribes to that service and use the function to check user log in.

## Angular components
In the assignment, there are 5 components at the moment (app, login, account, register, remove-user) and 1 service (login-service) and 1 server (server.js)
+ login component: handle log in authentication 
+ app component: checking user permission when they access the profile page
+ account component: retrieve session storage and display user email and type
+ register component: handle create user process by accept input from user and pass to server.js
+ remove-user component: handle delete user process by accessing a function in server.js through service
+ login-service service: the middleware that passing parameters from a component to the NodeJs server side and allow a function to the re-usable.
+ server.js server: it contains the hard-code user array with 3 functions (logIn, createUser and removeUser) which will be called by the components.
