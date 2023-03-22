![baner](<https://github.com/GhostDevs3/cs11_backend/blob/CSB-5-AlinaDorosh-dev/banner%20(1).png>)

### CODE SPACE JOBS PORTAL - BACKEND

- [**DEPENDENCIES**](#dependencies)
- [**PROJECT LAYOUT**](#project-layout)
- [**ROUTES**](#routes)
- [**MODELS**](#models)
- [**CONTROLLERS**](#controllers)
- [**CONTRIBUTORS**](#contributors)

## **DEPENDENCIES**

|                                   Packages                                   | Description                                                                                                                                                                      |
| :--------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|               [express](https://www.npmjs.com/package/express)               | Fast, unopinionated, minimalist web framework for Node.js.                                                                                                                       |
|                [bcrypt](https://www.npmjs.com/package/bcrypt)                | Library for hashing passwords                                                                                                                                                    |
|                  [cors](https://www.npmjs.com/package/cors)                  | A node.js package for providing a Connect/Express middleware that can be used to enable Cross-origin resource sharing with various options.                                      |
|                [dotenv](https://www.npmjs.com/package/dotenv)                | Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. Storing configuration in the environment separate from code               |
|          [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)          | Library for creating and managing tokens                                                                                                                                         |
| [express-async-handler](https://www.npmjs.com/package/express-async-handler) | Middleware for robust handling of asynchronous functions                                                                                                                         |
|    [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)    | Used for create middleware with"login limiter" functionality in order to stop brute force attacks and optimize application performance by limiting the number of login attempts. |
|              [mongoose](https://www.npmjs.com/package/mongoose)              | A JavaScript object-oriented programming library that creates a connection between MongoDB and the Node.js JavaScript runtime environment                                        |
|            [nodemailer](https://www.npmjs.com/package/nodemailer)            | Email sending from NodeJS application                                                                                                                                            |
|            [jwt-decode](https://www.npmjs.com/package/jwt-decode)            | A library for decoding JWT tokens                                                                                                                                            |
|            [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)            | A library for documenting API using Swagger                                                                                                                                            

## **PROJECT LAYOUT**

```shell
/
└───src
    ├───controllers
    ├───middlewares
    ├───models
    ├───routes
    ├───uploads
    └───utils
```

## **ROUTES**

**Auth routes:**

 - auth/signup
 - auth/login
 - auth/refresh
 - auth/changePassword/:id

**Forgotten password routes**

 - forgotten-password/send-mail
 - forgotten-password/reset-password/:token

**Candidate routes:**

 - all-candidates
 - candidate/all-candidates
 - candidate/:loginId
 - candidate/:loginId
 - candidate/:loginId/watchlist
 - candidate/edit-job/:loginId/:jobId
 - candidate/employer-jobs/:loginId
 - candidate/delete-job/:loginId/:jobId

**Jobs routes**

 - job/all-jobs
 - job/jobs-applied/:loginId
 - job/jobs-applied/:loginId/:jobId
 - job/job-list
 - job/post-job
 - job/job-single/:jobId
 - 

## **MODELS**

- _Auth model_ - contains the register schema with necessary validation prior to saving into the database.
-   _Job model_ - contains the job schema with necessary validation prior to saving into the database.
-   _Candidate model_ - contains the candidate schema with necessary validation prior to saving into the database.
-   _Employer model_ - contains the employer schema with necessary validation prior to saving into the database.

## **CONTROLLERS**

**Auth controllers:**

- _createNewUser_ - creates a new user in the database with an email and a password protected with `bcrypt` from the information received in the request body. It controls if the request body contains all necessary information and avoids duplications in the database. In successful request returns access and a refresh token in order to log the user in automatically in registration. The payload of the access token contains the user's id, role and email.

- _login_ - searches the database for a user with the email address specified in the request body.The received password is compared to the one in the database.If passwords match, return an access and refresh token in order to give the user access to operations that require authentication.

- _refresh_ - checking the refresh token in the request headers. Returns a new access token in order to improve user experience and avoid making the user restart their session when the access token has expired.



**Forgotten password controllers:**

- _sendMail_ - sends email with link which redirects to reset passord view in frontene application adding a token for email verification

- _resetPassword_ -verifies recieved token and decodes it, and only if email encrypted in the payload of token exists in database allows set new password.

**Candidate controllers:**

-   _getAllCandidates_ - retrieves a list of all candidates from the database. This can be used to display a summary of available candidates or for administrative purposes.
    
-   _addToWatchlist_ - adds a candidate to a user's watchlist by associating the candidate's ID with the user's ID. This allows users to easily track and review their preferred candidates.
    
-   _modifyCandidate_ - updates a candidate's information based on the data received in the request body. Ensures that only authorized users can make changes to a candidate's record.
    
-   _getById_ - retrieves a candidate's information from the database based on their unique ID. This can be used to display detailed information about a specific candidate.
    
-   _deleteById_ - removes a candidate's record from the database based on their unique ID. Ensures that only authorized users can delete a candidate's record.

**Job controllers:**

-   _getAllJobs_ - retrieves all jobs available in the database and returns them in a response. Useful for displaying a list of available jobs to users.
    
-   _getEmployerJobsByLoginId_ - finds and returns all jobs created by a specific employer, identified by their login ID. Useful for employers to manage and view their posted jobs.
    
-   _removeJobByLoginIdAndJobId_ - deletes a specific job from the database using the login ID of the employer and the job ID. Helps employers remove unwanted or outdated job postings.
    
-   _updateJobByLoginIdAndJobId_ - allows an employer to update a specific job's information in the database using their login ID and the job ID. Useful for making changes or corrections to job postings.
    
-   _getJobsAppliedByLoginId_ - retrieves a list of jobs that a specific user has applied for, identified by their login ID. Useful for users to track their job application progress.
    
-   _removeJobApplication_ - deletes a user's job application from the database. Useful for users who want to withdraw their application or for employers who want to remove an applicant.
    
-   _getJobList_ - retrieves a list of jobs based on specific criteria or filters, such as job title, location, or employer. Useful for users searching for specific job opportunities.
    
-   _createJob_ - allows an employer to create and add a new job posting to the database with the necessary information. Helps employers advertise job openings.
    
-   _getJobByJobId_ - finds and returns a specific job's information using its job ID. Useful for users who want to view more details about a job.
    
-   _getCandidateAppliedJobs_ - retrieves a list of jobs that a specific candidate has applied for. Useful for employers to view the applications they have received.
    
-   _deleteCandidateAppliedJobs_ - removes a candidate's job application from the database. Useful for employers who want to reject an applicant or for candidates who want to withdraw their application.
    
-   _applyToJob_ - allows a user to submit a job application for a specific job using their login ID and the job ID. Helps users apply for job opportunities they are interested in.

## **CONTRIBUTORS**

| Name             |                      Github                       |                         Linkedin                         |                    Email                    |
| :--------------- | :-----------------------------------------------: | :------------------------------------------------------: | :-----------------------------------------: |
| Alina Dorosh     | [**&check;**](https://github.com/AlinaDorosh-dev) | [**&check;**](https://www.linkedin.com/in/alina-dorosh/) | [Contact me](mailto:alina.dorosh@gmail.com) |
| Nelson González     | [**&check;**](https://github.com/Anel386) | [**&check;**](https://www.linkedin.com/in/nel386/) | [Contact me](mailto:nel386@gmail.com) |

 





 


| Rafael Fernandez |    [**&check;**](https://github.com/iRaphiki)     |   [**&check;**](https://www.linkedin.com/in/rafa-fr/)    |  [Contact me](mailto:imraphiki@gmail.com)   |
|                  |                                                   |                                                          |
|                  |                                                   |                                                          |
|                  |                                                   |                                                          |
