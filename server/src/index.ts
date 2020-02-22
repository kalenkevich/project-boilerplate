import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { execute, subscribe } from 'graphql';
import { Container } from 'typedi';
import { createServer } from "http";
import { SubscriptionServer } from 'subscriptions-transport-ws';

import settings from '../config/settings';
import DatabaseConnector from './databases/DatabaseInterface';
import PostgresDBService from './databases/PostgresDBService';
import resolvers from './resolvers';
import Logger from './services/Logger';
import { User, UserRole } from './models/UserModel';

const logger: Logger = Container.get('Logger');
export const pubSub = new PubSub();

const currentConfiguration = process.env.ENVIRONMENT || 'development';
const port = process.env.PORT || settings.port;

logger.info(`Environment: ${currentConfiguration}`);
logger.info(`Allowed Origins: ${settings.allowedClientOrigins}`);

export class ApplicationServer {
  public app: Application;
  public server: ApolloServer;

  constructor(private dbConnector: DatabaseConnector) {
    this.app = express();
  }

  get userRepository() {
    return this.dbConnector.connection.getRepository(User);
  }

  public async start() {
    this.registerBodyParsers();
    this.configureHeaders();
    const schema = await this.initServer();
    this.run(schema)
  }

  public registerBodyParsers() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended: false}));
    this.app.use(cookieParser(settings.tokenSecret));
  }

  public configureHeaders() {
    this.app.use(cors((req, callback) => {
      const currentClientOrigin = req.header('origin');
      const origin = (settings.allowedClientOrigins || []).find(
        (allowedOrigin) => allowedOrigin === currentClientOrigin);

      callback(null, {origin, credentials: true});
    }));
  }

  public async initServer() {
    this.app.set('port', port);

    const schema = await buildSchema({
      resolvers,
      authChecker: ({root, args, context, info}, roles: UserRole[]) => {
        const {user} = context;

        return roles.indexOf(user.role) !== -1;
      },
      container: Container,
      pubSub,
    });

    this.server = new ApolloServer({
      schema,
      context: async ({req, res}) => {
        const { authorizationToken } = req.cookies;
        const user = await this.userRepository.findOne({ authorizationToken });

        return { user, authorizationToken, request: req, response: res };
      },
    });

    this.server.applyMiddleware({
      app: this.app,
      cors: false,
    });

    return schema;
  }

  public run(schema) {
    const app = createServer(this.app);

    try {
      new SubscriptionServer({
        execute,
        subscribe,
        schema,
        onConnect: async (connectionParams) => {
          const { authorizationToken } = connectionParams;

          if (authorizationToken) {
            const user = await this.userRepository.findOne({ authorizationToken });

            if (user) {
              return user;
            }
          }

          throw new Error('Missing auth token!');
        }
      }, {
        server: app,
        path: '/subscriptions',
      });

      app.listen({port}, () => {
        logger.info(`API running on port :${port}`);
        logger.telegram('Server готов к работе!')
      });
    } catch (e) {
      console.error(e);
    }
  }
}

const dBConnector = new PostgresDBService(settings);

dBConnector.connect().then(async (connection) => {
  try {
    logger.info(`DB connected to ${settings.databaseUrl}`);

    Container.set('EntityManager', dBConnector.entityManager);
    Container.set('QueryRunner', connection.createQueryRunner());
    // Container.set('RedisClient', RedisClient);

    const server = new ApplicationServer(dBConnector);
    await server.start();
  } catch(error) {
    this.logger.error(error);
  }
});
