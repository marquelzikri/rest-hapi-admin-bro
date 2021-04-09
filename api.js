let Hapi = require('@hapi/hapi')

let dotenv = require('dotenv')

let mongoose = require('mongoose')

let RestHapi = require('rest-hapi')

let AdminBro = require('admin-bro')
let AdminBroPlugin = require('@admin-bro/hapi')
let AdminBroMongoose = require('@admin-bro/mongoose')

let argon2 = require('argon2')

dotenv.config()
AdminBro.registerAdapter(AdminBroMongoose)

async function api () {
  const MONGO_URI = process.env.MONGO_URI

  try {
    /**
     * Connection for AdminBro
     */
    let connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    let server = Hapi.Server({
      port: 8080,
      routes: {
        validate: {
          failAction: async (request, h, err) => {
            RestHapi.logger.error(err)
            throw err
          }
        }
      }
    })

    let config = {
      appTitle: process.env.APP_TITLE || 'rest-hapi-demo',
      enableTextSearch: true,
      logRoutes: true,
      docExpansion: 'list',
      swaggerHost: process.env.SWAGGER_HOST || 'localhost:8080',
      mongo: {
        URI: MONGO_URI,
      },
    }

    let adminBroOptions = {
      databases: [connection],
      auth: {
        authenticate: async (email, password) => {
          // find user by their email
          const user = await mongoose.model("user").findOne({ email }).exec()

          if (user) {
            try {
              if (await argon2.verify(user.password, password)) {
                // password match
                return user
              } else {
                // password did not match
                console.error('password did not match')
              }
            } catch (err) {
              // internal failure
              console.error('authenticate error:', JSON.stringify(err, null, 2))
            }
          }

          return null
        },
        strategy: 'session',
        cookieName: process.env.COOKIE_NAME || 'adminBroCookie',
        cookiePassword: process.env.COOKIE_PASSWORD || 'please-put-min-32-characters-for-cookie-password!',
        isSecure: true,
      },
    }

    await server.register({
      plugin: RestHapi,
      options: {
        mongoose: mongoose,
        config: config,
      },
    })

    await server.register({
      plugin: AdminBroPlugin,
      options: adminBroOptions,
    })

    await server.start()

    RestHapi.logUtil.logActionComplete(RestHapi.logger, 'Server Initialized', server.info)

    return server
  } catch (err) {
    console.log('Error starting server:', err)
  }

}

module.exports = api()
