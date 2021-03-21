"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const compression = require("compression");
const mongoose = require("mongoose");
const swagger = require("swagger-express-typescript");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_middleware_1 = require("./middleware/logger.middleware");
class App {
    constructor(controllers) {
        this.app = express();
        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
        this.initializeSwagger();
    }
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
    getServer() {
        return this.app;
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }
    initializeSwagger() {
        this.app.use('/api-docs/swagger', express.static('swagger'));
        this.app.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'));
        this.app.use(swagger.express({
            definition: {
                info: {
                    title: 'MilkMen API Documentation',
                    version: '1.0',
                },
                externalDocs: {
                    url: 'www.milkmen.com',
                },
            },
        }));
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
        this.app.use(logger_middleware_1.loggerMiddleware);
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
    }
    initializeStaticFileServer() {
        const env = process.env.NODE_ENV || 'dev';
        if (env === 'dev') {
            this.app.use(express.static(path.join(process.cwd(), 'public')));
            this.app.use(morgan('dev')); // log every request to the console
        }
        else {
            this.app.use(compression());
            this.app.use(express.static(path.join(process.cwd(), 'public'), { maxAge: '7d' }));
        }
    }
    connectToTheDatabase() {
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
        }
        else {
            mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, dbOpts);
        }
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map