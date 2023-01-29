# API

Api en construcción usando node y el framework Express. Mas allá de un sistema CRUD se ofrece una aplicación con integración a diferentes bases de datos relacionales y no relacionales como Maria db, Sqlite, Mongo y Firebase. Un chat contruido con Socket IO y un sistema de autenticación y de registro.

## Tech

- [Node.js](https://nodejs.org/en/) - Evented I/O for the backend
- [Express](https://expressjs.com/es/) - Framework to develop the backend
- [Express-handlebars](https://www.npmjs.com/package/express-handlebars) - Engine to develop the UI
- [Normalizr](https://www.npmjs.com/package/normalizr) - Tool to normalize some data in DB
- [Multer](https://www.npmjs.com/package/multer) - Middleware to upload images in server
- [MongoDb](https://www.mongodb.com/) - Optional noSQL database
- [Mysql2](https://www.npmjs.com/package/mysql2) - Optional SQL database
- [Sqlite3](https://www.sqlite.org/index.html) - Optional SQL database for chat
- [firebase-admin](https://www.npmjs.com/package/firebase-admin) - Optional noSQL database
- [Knex](https://knexjs.org/) - Query builder to interact with MariaDb
- [Mongoose](https://mongoosejs.com/) - ODM to interact with mongoDB
- [Passport](https://www.passportjs.org/) - Authentication middleware
- [Passport-Local](https://www.passportjs.org/packages/passport-local/) - Strategy used of passport to aunthenticate users
- [Express-Session](https://www.npmjs.com/package/express-session) - Middleware to create sessions of users who has been autheticated
- [Connect-Mongo](https://www.npmjs.com/package/connect-mongo) - Module of mongo db t work with session.
- [Socket-io](https://socket.io/) - Library to work with sockets
- [Nodemailer](https://nodemailer.com/about/) - module for Node.js applications to allow easy as cake email sending.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords.
- [Twilio](https://www.npmjs.com/package/twilio) - The Twilio REST API allows you to query and manage meta-data about your account, phone numbers, usage, and access tokens.
- [Winston](https://www.npmjs.com/package/winston) - Winston is designed to be a simple and universal logging library with support for multiple transports.
- [Yargs](https://www.npmjs.com/package/yargs) - Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.
- [Mocha](https://mochajs.org/) - Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.
- [Chai](https://www.chaijs.com/) - Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework.
- [Supertest](https://www.npmjs.com/package/supertest) - The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.

## Rutas

### Root:

```sh
http://localhost:8080/
```

### Login

Esta es la ruta inicial de la aplicación desde donde se podra realizar un proceso de login mediante un username y un password.
En el caso de no contar con una cuenta dirijase a la ruta Register.

| Method | Route | Reason                                     |
| ------ | ----- | ------------------------------------------ |
| Get    | /     | Renderizar la UI determinada para el login |

### Register

Esta ruta provee al usuario de una UI para el registro junto con el endpoint definido para regsitrar sus datos en DB, encriptar su contraseña
y redirigir al login para ingresar a la aplicación.

| Method | Route           | Reason                                       |
| ------ | --------------- | -------------------------------------------- |
| Get    | api/v1/register | Renderizar la UI determinada para el sign up |
| Post   | api/v1/register | Registrar el usuario en mongoDB              |

## Profile

| Method | Route                 | Reason                                                           |     |
| ------ | --------------------- | ---------------------------------------------------------------- | --- |
| Post   | api/v1/profile/       | Redirigir al usuario con su username en la URL a la UI de la app |
| Get    | api/v1/profile/       | Renderizar la UI del usuario logueado o redirigir al login       |
| Post   | api/v1/profile/logout | Realizar el logout del usuario y redirir al login                |

### Products

En las siguientes rutas se proveeran los endpoints en donde se administraran los diferentes productos en la base datos

| Method | Route                 | Reason                                                 |
| ------ | --------------------- | ------------------------------------------------------ |
| Get    | api/v1/productos/:id? | Obtener productos por id o todos si no se provee el id |
| Post   | api/v1/productos/     | Agregar productos a la base de datos                   |
| Put    | api/v1/productos/:id  | Actualizar productos por id                            |
| Delete | api/v1/productos/:id  | Borrar productos por id                                |

### Cart

En las siguientes rutas se proveeran los endpoints para crear carritos de compras en donde se almacenaran los productos a comprar por el cliente desde la UI

> **Nota:** Estas rutas tienen un acceso público por lo tanto no es necesario proveer credenciales.

| Method | Route                                 | Reason                           |
| ------ | ------------------------------------- | -------------------------------- |
| Post   | api/v1/carrito/                       | Crear carrito                    |
| Delete | api/v1/carrito/:id                    | Borrar Carrito                   |
| Get    | api/v1/carrito/:id/productos          | Listar los productos del carrito |
| Post   | api/v1/carrito/:id/productos          | agregar productos al carrito     |
| Delete | api/v1/carrito/:id/productos/:id_prod | Borrar productos del carrito     |

### Test

En la siguiente ruta podras acceder a una tabla de productos con una imágen aleatoria con el fín de proveer de data falsa a la UI que la necesite. Por defecto provee 5 productos pero si el usuario necesita de más o menos cantidad puede hacerla explicita al final de la ruta

| Method | Route                      | Reason                                                                       |
| ------ | -------------------------- | ---------------------------------------------------------------------------- |
| Get    | /api/v1/test/helloworld    | print "hello world"                                                          |
| Get    | /productos-test/:quantity? | Generar lista d eproductos falsos por fakerJS                                |
| Get    | /tech-info                 | Mostrar aspectos técnicos del coomputador del usuario por medio de NODE      |
| Get    | /randoms                   | Realizar un procedimiento demandante para poner en uso procesos fork en NODE |
| Get    | /randoms-ngnix             | Controlador para realizar pruebas sencillas con ngnix                        |

### Twilio

Esta ruta se implemento con el fin de agrupar los diferentes procedimientos de notificación tanto al usuario como al administrador
cuando una compra sea realizado haciendo uso de Twilio y Nodemailer

| Method | Route | Reason                                                      |
| ------ | ----- | ----------------------------------------------------------- |
| Post   | /     | Ruta de inicio para ejecutar procedimientos de notificación |

## Instalación

To run the app in dev mode:

```sh
npm i
pnpm run dev
```

Ensure to have installed redis-server in your machine otherwise visit [Redis installation](https://redis.io/docs/getting-started/installation/)

## Test

To run test with mocha:

```sh
pnpm run test
```

You can find other starter scripts modes in the package.json file
