# Documentación Backend (parte Nelson González)
Este proyecto CodeJob es una aplicación que permite la creación y búsqueda de ofertas de trabajo y candidatos. Incluye los siguientes componentes:

-   Aplicación de Express
-   Conexión a la base de datos MongoDB Atlas
-   Controladores para manejar las solicitudes HTTP y la comunicación con la base de datos
-   Endpoints para la búsqueda y creación de ofertas de trabajo y candidatos
- Implementación de swagger para facilitar el trabajo del equipo a la hora de acceder a dichos endpoints.

------

El archivo `package.json` es un archivo fundamental en cualquier proyecto de Node.js. Contiene información importante sobre las dependencias de nuestro proyecto, scripts que podemos ejecutar y otros metadatos.

## Dependencias

El objeto `dependencies` contiene una lista de las dependencias que nuestro proyecto requiere para funcionar correctamente. Cada dependencia está compuesta por un nombre y una versión específica que se puede instalar usando npm.

Algunas de las dependencias incluidas en este proyecto son:

-   `bcrypt`: una librería para la encriptación de contraseñas.
-   `cors`: un middleware para permitir solicitudes de origen cruzado (CORS) en Express.
-   `dotenv`: una librería para leer variables de entorno desde un archivo .env.
-   `express`: un framework para aplicaciones web en Node.js.
-   `express-async-handler`: un middleware para manejar de manera más sencilla las funciones asíncronas en Express.
-   `express-rate-limit`: un middleware para limitar la cantidad de solicitudes que se pueden realizar en un período de tiempo determinado.
-   `jsonwebtoken`: una librería para trabajar con JSON Web Tokens.
-   `jwt-decode`: una librería para decodificar tokens JWT.
-   `mongoose`: una librería para interactuar con MongoDB.
-   `swagger-ui-express`: una librería para documentar API usando Swagger.

## Archivo `app.js`

Este archivo es el punto de entrada para la aplicación y se encarga de configurar y ejecutar el servidor Express.

### Requerimientos

Se importan las siguientes dependencias:

-   `express`: es un framework para aplicaciones web en Node.js.
-   `mongoose`: es una librería que permite conectarse a MongoDB y realizar operaciones de CRUD.
-   `cors`: es un middleware que permite configurar la política de acceso a la API.
-   `dotenv`: es una librería que permite cargar variables de entorno desde un archivo `.env`.
-   `swagger-ui-express`: es una librería que permite integrar Swagger UI con Express.
-   `logger` y `logEvents`: son middlewares que se encargan de registrar los eventos que ocurren en la aplicación.
-   `errorHandler`: es un middleware que se encarga de manejar los errores que ocurren en la aplicación.

### Inicialización de la aplicación

Se crea una aplicación de Express y se habilita el acceso a Swagger UI para documentar la API.

Se configura una conexión a la base de datos de MongoDB y se verifica la conexión. En caso de error, se registra en un archivo de logs.

Se configura el middleware para recibir y enviar JSON en las solicitudes y respuestas HTTP.

### Configuración de las rutas

Se definen las siguientes rutas para la aplicación:

-   `/auth`: para las operaciones de autenticación.
-   `/job`: para las operaciones de las ofertas de trabajo.
-   `/candidate`: para las operaciones de los candidatos.
-   `/employer`: para las operaciones de los empleadores.

Todas las rutas se definen en los archivos de las respectivas rutas: `./routes/auth.routes.js`, `./routes/job.routes.js`, `./routes/candidate.routes.js` y `./routes/employer.routes.js`.

### Escuchar peticiones

Por último, se escuchan las peticiones en el puerto 8000 y se muestra un mensaje en la consola indicando que el servidor está ejecutándose.

## VerifyToken
Este es un middleware para verificar tokens. Si un token no se proporciona en la solicitud, se devuelve un error 401 "Acceso denegado". A continuación, se intenta verificar el token con el secreto especificado en la variable de entorno `ACCESS_TOKEN_SECRET`. Si la verificación falla, se intenta verificar con el secreto especificado en la variable de entorno `REFRESH_TOKEN_SECRET`. Si ambas verificaciones fallan, se devuelve un error 400 "Token expirado". Si la verificación es exitosa, el usuario verificado se agrega al objeto de solicitud como `req.user` y se llama a la función `next()` para continuar con el procesamiento de la solicitud.

## Rutas

### Ruta: `/auth/changePassword/:id`

#### Método: `PATCH`

#### Descripción:

Esta ruta permite a un usuario cambiar su contraseña.

#### Acceso:

Solo accesible con un token de acceso válido.

#### Parámetros:

-   `id`: identificador único del usuario.

#### Body:

-   `oldPassword`: contraseña antigua del usuario.
-   `newPassword`: contraseña nueva que se desea establecer.

#### Funcionamiento:

1.  La ruta verifica si existe un token de autorización enviado en la petición.
2.  Si existe un token, se verifica si la contraseña antigua proporcionada coincide con la almacenada en la base de datos.
3.  Si la contraseña antigua es correcta, se actualiza la contraseña en la base de datos y se devuelve una respuesta de éxito.
4.  Si la contraseña antigua no es correcta, se devuelve una respuesta de error.

______

### Ruta `/all-candidates`

#### Descripción

Obtiene una lista de todos los candidatos.

#### Método

GET

#### URL

`/candidate/all-candidates`

#### Autorización

Se requiere un token de acceso válido para acceder a esta ruta.

----------


### Ruta `candidate/:loginId`

#### Descripción

Obtiene un candidato por su id de inicio de sesión.

#### Método
GET
#### URL

`/candidate/:loginId`

#### Autorización

Se requiere un token de acceso válido para acceder a esta ruta.

_____

### Ruta `/candidate/:loginId/watchlist`

#### Descripción

Agrega un candidato a la lista de seguimiento de un usuario.

#### Método

POST

#### URL

`/candidate/:loginId/watchlist`

Reemplaza `:loginId` por el ID de inicio de sesión del usuario que desea agregar el candidato.

#### Autorización

Se requiere un token de acceso válido para acceder a esta ruta.

Espero que esta documentación sea útil. Si necesitas ayuda adicional, no dudes en hacérmelo saber.
_____


### Ruta `/all-jobs`

#### Descripción:

Obtener una lista de todas las ofertas de trabajo.

#### Método:

GET

#### URL:

`/job/all-jobs`

#### Acceso:

Autenticado

#### Middleware:

`verifyToken`

### Función asociada:

`getAllJobs`

----------

### Ruta: `/jobs-applied/:loginId`

#### Descripción:

Obtener una lista de las ofertas de trabajo a las que un candidato ha aplicado.

#### Método:

GET

#### URL:

`/job/jobs-applied/:loginId`

#### Acceso:

Autenticado

#### Middleware:

`verifyToken`

#### Función asociada:

`getJobsAppliedByLoginId`

----------

### Ruta: `/jobs-applied/:loginId/:jobId`

#### Descripción:

Eliminar una aplicación de una oferta de trabajo por parte de un candidato.

#### Método:

DELETE

#### URL:

`/job/jobs-applied/:loginId/:jobId`

#### Acceso:

Autenticado

#### Middleware:

`verifyToken`

#### Función asociada:

`removeJobApplication`
_____

### Ruta `/candidate/edit-job/:loginId/:jobId`

#### Descripción

Actualiza los detalles de un trabajo específico para un candidato.

#### Método

PATCH

#### URL

`/candidate/edit-job/:loginId/:jobId`

Reemplaza `:loginId` por el ID de inicio de sesión del candidato y `:jobId` por el ID único del trabajo que se desea actualizar.

#### Parámetros de la URL

`loginId`

El ID de inicio de sesión único del candidato.

`jobId`

El ID único del trabajo que se desea actualizar.

#### Autorización

Se requiere un token de acceso válido para acceder a esta ruta.
_____

### Ruta `/job-list`

#### Descripción

Esta ruta permite obtener una lista de ofertas de trabajo activas.

#### Método

GET

#### URL

`/job/job-list`

#### Acceso

Público

#### Función asociada

`getJobList`
______

### Ruta `/post-job`

#### Descripción

Esta ruta permite crear una nueva oferta de trabajo.

#### Método

POST

#### URL

`/job/post-job`

#### Acceso

Público

#### Función asociada

`createJob`
______

### Ruta `/job-single/:jobId`

#### Descripción

Esta ruta permite obtener una oferta de trabajo específica por su ID.

#### Método

GET

#### URL

`/job/job-single/:jobId`

#### Acceso

Público

#### Función asociada

`getJobByJobId`
____
### Ruta `/candidate/employer-jobs/:loginId`

#### Descripción

Obtiene una lista de trabajos publicados por un empleador específico.

#### Método

GET

#### URL

`/candidate/employer-jobs/:loginId`

Reemplaza `:loginId` por el ID de inicio de sesión único del empleador.

#### Parámetros de la URL

`loginId`

El ID de inicio de sesión único del empleador.

#### Autorización

Se requiere un token de acceso válido para acceder a esta ruta.
___

### Ruta `/candidate/delete-job/:loginId/:jobId`

#### Descripción

Elimina un trabajo específico de un candidato.

#### Método

DELETE

#### URL

`/candidate/delete-job/:loginId/:jobId`

Reemplaza `:loginId` por el ID de inicio de sesión del candidato y `:jobId` por el ID único del trabajo que se desea eliminar.

#### Parámetros de la URL

`loginId`

El ID de inicio de sesión único del candidato.

`jobId`

El ID único del trabajo que se desea eliminar.

#### Autorización

Se requiere un token de acceso válido para acceder a esta ruta.

___


[Aquí un ejemplo de la implementación de Swagger en el proyecto.![Captura.png](https://i.postimg.cc/4yDjBpq6/Captura.png)](https://postimg.cc/bSR6vSzr)