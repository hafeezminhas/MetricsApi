import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as swagger from 'swagger-express-typescript';

import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import loggerMiddleware from './middleware/logger.middleware';

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeSwagger();
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
  }

  private initializeSwagger() {
    this.app.use('/api-docs/swagger', express.static('swagger'));
    this.app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
    this.app.use(swagger.express(
      {
        definition: {
          info: {
            title: 'MilkMen API Documentation',
            version: '1.0',
          },
          externalDocs: {
            url: 'www.milkmen.com',
          },
          // Models can be defined here
        },
      },
    ));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
    this.app.use(loggerMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/api', controller.router);
    });
  }

  private connectToTheDatabase() {
    const env = process.env.NODE_ENV || 'dev';
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, MONGO_DB } = process.env;
    const dbOpts = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };

    if (env === 'dev') {
      mongoose
        .connect(`mongodb://localhost:27017/${MONGO_DB}`, dbOpts)
        .then(() => console.log('DB Connection Successfull'))
        .catch((err) => {
          console.error(err);
        });
    } else {
      mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, dbOpts);
    }
  }
}

export { App };
