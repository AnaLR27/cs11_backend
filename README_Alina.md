![baner](https://github.com/GhostDevs3/cs11_backend/blob/CSB-5-AlinaDorosh-dev/banner%20(1).png)

## Backend: 

Parte realizada por Alina Dorosh:

- ruta e endpoint correspondiente de registro de nuevo usuario con email y contraseña protegida con bcrypt, devuelve los tokens generados mediante jsonwebtoken

- ruta e endpoint correspondiente de login. Se ha aplicado la funcionalidad de "login limiter" para detener los ataques de fuerza bruta y optimizar el rendimiento de la aplicación limitando el número de intentos de inicio de sesión.

- ruta e endpoint correspondiente de refresco de token, que devuelve un nuevo token de acceso.

En los endpoints mencionados se ha utilizado la función de asyncHandler del paquete express-async-handler para el manejo más robusto de las funciones asíncronas.