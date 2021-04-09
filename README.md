# rest-hapi-demo
A template to auto generate RESTful API and admin dashboard using [rest-hapi](https://github.com/JKHeadley/rest-hapi) and [adminBro](https://adminbro.com/) Hapi plugin.
## Requirements

You need [Node.js version >= 12](https://nodejs.org/en/) installed and you'll need [MongoDB](https://docs.mongodb.com/manual/installation/) installed and running.

## Installation

clone the repo
```
$ git clone https://github.com/marquelzikri/rest-hapi-admin-bro
$ cd rest-hapi-admin-bro
```

install the dependencies
```
$ npm install
```

seed the models
- Local db
```
$ ./node_modules/.bin/rest-hapi-cli seed
```
- External db
```
$ ./node_modules/.bin/rest-hapi-cli seed <your mongoDB url>
```

## Using the app

start the api
```
$ npm start
```

view the api docs at

[http://localhost:8080/](http://localhost:8080/)

view the admin dashboard at

[http://localhost:8080/admin](http://localhost:8080/admin)


