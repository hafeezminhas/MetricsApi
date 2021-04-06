// @ts-ignore
import { createValidator } from 'express-joi-validation';
import { NextFunction, Response, Router } from 'express';

import authMiddleware from '../../middleware/auth.middleware';
import Controller from '../../interfaces/controller.interface';
import NotAuthorizedException from '../../exceptions/NotAuthorizedException';
import {
  testCreateValidator,
  testParamsCreateValidator,
  testParamsUpdateValidator,
  testUpdateValidator } from './test.dto';

// Interfaces and Models
import { AuthRole } from '../auth/role.enum';
import RequestWithUser from '../../interfaces/requestWithUser.interface';
import { Test, TestParams } from './test.interface';
import { testModel } from './test.model';
import { testParamsModel } from './test-params.model';

const validator = createValidator();

class TestController implements Controller {
  public path = '/tests';
  public router = Router();
  private testParams = testParamsModel;
  private test = testModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    this.router.get(`${this.path}`, authMiddleware, this.getTests);
    // @ts-ignore
    this.router.post(`${this.path}`, authMiddleware, validator.body(testCreateValidator), this.createTest);
    // @ts-ignore
    this.router.get(`${this.path}/:id`, authMiddleware, this.getTestById);
    // @ts-ignore
    this.router.put(`${this.path}/:id`, authMiddleware, validator.body(testUpdateValidator), this.updateTest);
    // @ts-ignore
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteTest);
    // @ts-ignore
    this.router.delete(`${this.path}/:id/plants/:pid`, authMiddleware, this.deletePlantFromTest);
    // @ts-ignore
    this.router.post(`${this.path}/:id/params`, authMiddleware, validator.body(testParamsCreateValidator), this.createTestParams);
    // @ts-ignore
    this.router.put(`${this.path}/params/:id`, authMiddleware, validator.body(testParamsUpdateValidator), this.updateTestParams);
    // @ts-ignore
    this.router.delete(`${this.path}/params/:id`, authMiddleware, this.deleteTestParams);
  }

  private getTests = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const page = +request.query.page || 1;
    const limit = +request.query.limit || 10;
    const search = request.query.search ? request.query.search.toString() : null;
    const deleted = request.query.deleted || false;
    let queryFilter: any;
    if (search) {
      const regex = new RegExp(this.escapeRegex(search), 'gi');
      queryFilter = { $or: [{ name: regex }, { description: regex }] };
      if (request.user.role !== AuthRole.XADMIN) {
        queryFilter = { $and: [{ isDeleted: deleted }, { company: request.user.company }, ...queryFilter] };
      }

      const plants = await this.test.find(queryFilter)
                                      .sort({ update_at: -1 })
                                      .skip((page - 1) * limit)
                                      .limit(limit)
                                      .populate('plants').populate('testParams');
      const count = await this.test.countDocuments(queryFilter);

      response.send({ page, limit, plants, count, search });
    } else {
      if (request.user.role === AuthRole.XADMIN) {
        queryFilter = {};
      } else {
        queryFilter = { $and: [{ isDeleted: deleted }, { company: request.user.company }] };
      }
      const tests = await this.test.find(queryFilter)
                                    .sort({ update_at: -1 })
                                    .skip((page - 1) * limit)
                                    .limit(limit)
                                    .populate('plants').populate('testParams');
      const count = await this.test.countDocuments(queryFilter);

      response.send({ page, limit, tests, count });
    }
  }

  private createTest = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const payload: Test = { ...request.body };
    payload.company = request.user.company;

    try {
      const testParams = await this.testParams.insertMany(payload.testParams);
      payload.testParams = testParams.map(tp => tp._id);
      payload.isDeleted = false;

      const test = await this.test.create(payload);
      response.send(test);
    } catch (e) {
      response.send(e);
    }
  }

  private getTestById = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const testQuery = this.test
                              .findById(id)
                              .populate('plants')
                              .populate('testParams');
    try {
      const test = await testQuery;
      if (test) {
        if (request.user.role !== AuthRole.XADMIN && request.user.company.toString() !== test.company.toString()) {
          response.send(new NotAuthorizedException('You are not authorized to view the requested data'));
        }
        response.send(test);
      } else {
        response.status(404).send('requested object not found');
      }
    } catch (err) {
      response.status(500).send(err);
    }
  }

  private updateTest = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const id = request.params.id;
    const payload: Test = request.body;
    let testParams: any[];

    try {
      if (payload.testParams.length) {
        testParams = await this.testParams.insertMany(payload.testParams);
        await this.test.findByIdAndUpdate(id, {
          $push: {
            testParams: { $each: testParams.map(tp => tp._id) },
          },
        });
      }
      if (payload.plants.length) {
        await this.test.findByIdAndUpdate(id, {
          $push: {
            plants: { $each: payload.plants },
          },
        });
      }
      delete payload.testParams;
      delete payload.plants;
      const updateTest = this.test.findByIdAndUpdate(
        id,
        { $set: { ...payload } },
        { new: true },
      );

      const test = await updateTest;
      response.send(test);
    } catch (e) {
      response.send(e);
    }
  }

  private deleteTest = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const id = request.params.id;
    try {
      const plantQuery = this.test.findByIdAndUpdate(
        id,
        {
          $set: { isDeleted: true },
        },
        { new: true },
      );
      const plant = await plantQuery;
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }

  private deletePlantFromTest = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const { id, pid } = request.params;
    const target = await this.test.findById(id);
    if (target && target.company.toString() === request.user.company.toString()) {
      try {
        const targetParam = await this.testParams.findByIdAndDelete(pid);
        await this.test.findByIdAndUpdate(
          id,
          { $pull: [targetParam._id] },
          { new: true },
        );

        const test = await this.test.findById(id);
        response.send(test);
      } catch (err) {
        response.send(err);
      }
    } else {
      response.status(404).send('requested test not found');
    }
  }

  private createTestParams = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const payload: TestParams = { ...request.body };
    const id = request.params.id;

    try {
      const testParams = await this.testParams.create(payload);
      await this.test.findByIdAndUpdate(id, {
        $push: {
          testParams: testParams._id,
        },
      });
      const result = await this.test
                                  .findById(id)
                                  .populate('plants')
                                  .populate('testParams');

      response.send(result);
    } catch (e) {
      response.send(e);
    }
  }

  private updateTestParams = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const payload: TestParams = { ...request.body };
    const id = request.params.id;

    try {
      await this.testParams.findByIdAndUpdate(id, {
        $set: { ...payload },
        new: true,
      });
      const result = await this.test
                                  .findById(id)
                                  .populate('plants')
                                  .populate('testParams');

      response.send(result);
    } catch (e) {
      response.send(e);
    }
  }

  private deleteTestParams = async (request: RequestWithUser, response: Response, _: NextFunction) => {
    const id = request.params.id;
    // @ts-ignore
    const parent: Test[] = await this.test.find({ testParams: { $in: [id] } });
    if (!parent.length) {
      response.send({ success: false, message: 'Parent test not found' });
    }

    try {
      const testParams = await this.testParams.findByIdAndDelete(id);
      await this.testParams.findByIdAndUpdate(id, {
        $pull: { testParams: [testParams._id] },
        new: true,
      });
      const result = await this.test
                                    .findById(parent[0]._id)
                                    .populate('plants')
                                    .populate('testParams');

      response.send(result);
    } catch (e) {
      response.send(e);
    }
  }

  private escapeRegex (str: string): any {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

export { TestController };
