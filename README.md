![baner](https://github.com/GhostDevs3/cs11_backend/blob/CSB-5-AlinaDorosh-dev/banner%20(1).png)

### CODE SPACE JOBS PORTAL - BACKEND

- [**DEPENDENCIES**](#dependencies)
- [**PROJECT LAYOUT**](#project-layout)
- [**ROUTES**](#routes)
- [**MODELS**](#models)
- [**CONTROLLERS**](#controllers)
- [**CONTRIBUTORS**](#contributors)

## **DEPENDENCIES**

|                                                 Packages                                                 | Description                                                                                                                                      |
| :------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------- |
|[express](https://www.npmjs.com/package/express)| Fast, unopinionated, minimalist web framework for Node.js.| 
|[bcrypt](https://www.npmjs.com/package/bcrypt)|Library for hashing passwords| 
|[cors](https://www.npmjs.com/package/cors)|A node.js package for providing a Connect/Express middleware that can be used to enable Cross-origin resource sharing with various options.|
|[dotenv](https://www.npmjs.com/package/dotenv)|Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code|
|[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)| Library for creating and managing tokens|
|[express-async-handler](https://www.npmjs.com/package/express-async-handler)|Middleware for robust handling of asynchronous functions|
|[express-rate-limit](https://www.npmjs.com/package/express-rate-limit)|Used for create middleware with"login limiter" functionality in order to stop brute force attacks and optimize application performance by limiting the number of login attempts.|
|[mongoose](https://www.npmjs.com/package/mongoose)|A JavaScript object-oriented programming library that creates a connection between MongoDB and the Node.js JavaScript runtime environment|

## **PROJECT LAYOUT**
```
src
 ┣ controllers
 ┃ ┗ auth.controller.js
 ┣ middlewares
 ┃ ┗ loginLimiter.js
 ┣ models
 ┃ ┗ auth.model.js
 ┣ routes
 ┃ ┗ auth.routes.js
 ┣ uploads
 ┗ utils
```
 ## **ROUTES**
  **Auth routes:**
  - auth/signup
  - auth/login
  - auth/refresh

 ## **MODELS**
 - *Auth model* - ccontains the register schema with necessary validation prior to saving into the database.

 ## **CONTROLLERS**
   **Auth controllers:**
   - *createNewUser* - creates a new user in the database with an email and a password protected with ` bcrypt ` from the information received in the request body. It controls if the request body contains all necessary information and avoids duplications in the database. In successful request returns access and a refresh token in order to log the user in automatically in registration. The payload of the access token contains the user's id, role and email.


- *login* - searches the database for a user with the email address specified in the request body.The received password is compared to the one in the database.If passwords match, return an access and refresh token in order to give the user access to operations that require authentication.


- *refresh* - checking the refresh token in the request headers. Returns a new access token in order to improve user experience and avoid making the user restart their session when the access token has expired.

## **CONTRIBUTORS**

| Name             |                      Github                       |                         Linkedin                         |                    Email                    |
| :--------------- | :-----------------------------------------------: | :------------------------------------------------------: | :-----------------------------------------: |
| Alina Dorosh     | [**&check;**](https://github.com/AlinaDorosh-dev) | [**&check;**](https://www.linkedin.com/in/alina-dorosh/) | [Contact me](mailto:alina.dorosh@gmail.com) |

 





 

