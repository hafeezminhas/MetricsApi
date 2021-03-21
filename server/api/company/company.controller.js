import { Router } from 'express';
import { createValidator } from 'express-joi-validation';
/* Middlewares */
import authMiddleware from '../../middleware/auth.middleware';
import permit from '../../middleware/permission.middleware';
import { companyCreateValidator, companyUpdateValidator } from './company.dto';
import { AuthRole } from '../auth/role.enum';
import companyModel from './company.model';
const validator = createValidator();
class CompanyController {
    constructor() {
        this.path = '/companies';
        this.router = Router();
        this.company = companyModel;
        this.getCompanies = async (request, response, next) => {
            const page = +request.query.page || 1;
            const limit = +request.query.limit || 10;
            const search = request.query.search ? request.query.search.toString() : null;
            if (search) {
                const regex = new RegExp(this.escapeRegex(search), 'gi');
                const companies = await this.company.find({ name: regex })
                    .sort({ update_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
                const count = await this.company.countDocuments();
                response.send({ page, limit, count, companies, search });
            }
            else {
                const companies = await this.company.find()
                    .sort({ update_at: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit);
                const count = await this.company.countDocuments();
                response.send({ page, limit, count, companies });
            }
        };
        this.createCompany = async (request, response, next) => {
            const payload = request.body;
            try {
                const company = await this.company.create(payload);
                response.send(company);
            }
            catch (e) {
                response.send(e);
            }
        };
        this.getCompanyById = async (request, response, next) => {
            const id = request.params.id;
            const companyQuery = this.company.findById(id);
            const company = await companyQuery;
            if (company) {
                response.send(company);
            }
            else {
                response.send({ message: 'company not found' });
            }
        };
        this.updateCompany = async (request, response, next) => {
            const id = request.params.id;
            const companyQuery = this.company.findByIdAndUpdate(id, {
                $set: request.body,
                $new: true,
            });
            try {
                const company = await companyQuery;
                response.send(company);
            }
            catch (e) {
                response.send(e);
            }
        };
        this.deleteCompany = async (request, response, next) => {
            const id = request.params.id;
            try {
                const companyQuery = this.company.findByIdAndDelete(id);
                const company = await companyQuery;
                response.send(company);
            }
            catch (e) {
                response.send(e);
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware, permit(AuthRole.XADMIN), this.getCompanies);
        this.router.post(`${this.path}`, authMiddleware, validator.body(companyCreateValidator), permit(AuthRole.XADMIN), this.createCompany);
        this.router.get(`${this.path}/:id`, authMiddleware, permit(AuthRole.XADMIN), this.getCompanyById);
        this.router.put(`${this.path}/:id`, authMiddleware, validator.body(companyUpdateValidator), permit(AuthRole.XADMIN), this.updateCompany);
        this.router.delete(`${this.path}/:id`, authMiddleware, permit(AuthRole.XADMIN), this.deleteCompany);
    }
    escapeRegex(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
}
export { CompanyController };
//# sourceMappingURL=company.controller.js.map