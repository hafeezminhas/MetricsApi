import 'dotenv/config';
import { App } from './app';
/* ---- API Controllers ----- */
import { AuthenticationController } from './api/auth/auth.controller';
import { CompanyController } from './api/company/company.controller';
import { PlantController } from './api/plant/plant.controller';
import { UserController } from './api/user/user.controller';
import validateEnv from './utils/validateEnv';
validateEnv();
const app = new App([
    new AuthenticationController(),
    new CompanyController(),
    new UserController(),
    new PlantController(),
]);
app.listen();
//# sourceMappingURL=server.js.map