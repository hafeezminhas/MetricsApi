"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
/* ---- API Controllers ----- */
const auth_controller_1 = require("./api/auth/auth.controller");
const company_controller_1 = require("./api/company/company.controller");
const plant_controller_1 = require("./api/plant/plant.controller");
const user_controller_1 = require("./api/user/user.controller");
const validateEnv_1 = require("./utils/validateEnv");
validateEnv_1.default();
const app = new app_1.App([
    new auth_controller_1.AuthenticationController(),
    new company_controller_1.CompanyController(),
    new user_controller_1.UserController(),
    new plant_controller_1.PlantController(),
]);
app.listen();
//# sourceMappingURL=server.js.map