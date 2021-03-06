import { NextFunction, Request, Response, Router } from 'express';
import { createValidator } from 'express-joi-validation';

/* Middlewares */
import authMiddleware from '../../middleware/auth.middleware';
import permit from '../../middleware/permission.middleware';

import Controller from '../../interfaces/controller.interface';
import { companyCreateValidator, companyUpdateValidator } from './company.dto';

import { AuthRole } from '../auth/role.enum';
import companyModel from './company.model';
import { CustomUtils } from '../../utils/custom-utils';

const validator = createValidator();

class CompanyController implements Controller {
  public path = '/companies';
  public router = Router();
  private company = companyModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, permit(AuthRole.XADMIN), this.getCompanies);
    this.router.post(`${this.path}`, authMiddleware, validator.body(companyCreateValidator), this.createCompany);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getCompanyById);
    this.router.put(`${this.path}/:id`, authMiddleware, validator.body(companyUpdateValidator), this.updateCompany);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteCompany);
  }

  private getCompanies = async (request: Request, response: Response, next: NextFunction) => {
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
    } else {
      const companies = await this.company.find()
        .sort({ update_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      const count = await this.company.countDocuments();

      response.send({ page, limit, count, companies });
    }
  }

  private createCompany = async (request: Request, response: Response, next: NextFunction) => {
    const payload = request.body;
    try {
      const company = await this.company.create(payload);
      response.send(company);
    } catch (e) {
      response.send(e);
    }
  }

  private getCompanyById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const companyQuery = this.company.findById(id);
    const company = await companyQuery;
    if (company) {
      response.send(company);
    } else {
      response.send({ message: 'company not found' });
    }
  }

  private updateCompany = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const companyQuery = this.company.findByIdAndUpdate(id, {
      $set: request.body,
      $new: true,
    });
    try {
      const company = await companyQuery;
      response.send(company);
    } catch (e) {
      response.send(e);
    }
  }

  private deleteCompany = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    try {
      const companyQuery = this.company.findByIdAndDelete(id);
      const company = await companyQuery;
      response.send(company);
    } catch (e) {
      response.send(e);
    }
  }

  private escapeRegex (str: string): any {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

export { CompanyController };
