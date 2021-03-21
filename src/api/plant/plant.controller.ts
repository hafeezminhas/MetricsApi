import { createValidator } from 'express-joi-validation';
import { NextFunction, Request, Response, Router } from 'express';

import Controller from '../../interfaces/controller.interface';
import authMiddleware from '../../middleware/auth.middleware';
import { phaseHistoryModel } from './phase-history.model';
import { plantModel } from './plant.model';
import { plantCreateValidator, plantUpdateValidator } from './plant.dto';
import Plant from './plant.interface';

const validator = createValidator();

class PlantController implements Controller {
  public path = '/plants';
  public router = Router();
  private phaseHistory = phaseHistoryModel;
  private plant = plantModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    this.router.get(`${this.path}`, authMiddleware, this.getPlants);
    // @ts-ignore
    this.router.post(`${this.path}`, authMiddleware, validator.body(plantCreateValidator), this.createPlant);
    // @ts-ignore
    this.router.get(`${this.path}/:id`, authMiddleware, this.getPlantById);
    // @ts-ignore
    this.router.put(`${this.path}/:id`, authMiddleware, validator.body(plantUpdateValidator), this.updatePlant);
    // @ts-ignore
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePlant);
  }

  private getPlants = async (request: Request, response: Response, _: NextFunction) => {
    const page = +request.query.page || 1;
    const limit = +request.query.limit || 10;
    const search = request.query.search? request.query.search.toString() : null;
    if (search) {
      const regex = new RegExp(this.escapeRegex(search), 'gi');
      const plants = await this.plant.find({ $or: [{ name: regex }, { metricId: regex }] })
                                      .sort({ update_at: -1 })
                                      .skip((page - 1) * limit)
                                      .limit(limit)
                                      .populate('phaseHistory');
      const count = await this.plant.countDocuments();

      response.send({ page, limit, plants, count });
    } else {
      const plants = await this.plant.find()
        .sort({ update_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('phaseHistory');
      const count = await this.plant.countDocuments();

      response.send({ page, limit, plants, count });
    }
  }

  private createPlant = async (request: Request | any, response: Response, _: NextFunction) => {
    const payload: Plant = request.body;
    payload.company = request.user.company;

    try {
      const phases = await this.phaseHistory.insertMany(payload.phaseHistory);
      payload.phaseHistory = phases.map(p => p._id);

      const plant = await this.plant.create(payload);
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }

  private getPlantById = async (request: Request, response: Response, _: NextFunction) => {
    const id = request.params.id;
    const plantQuery = this.plant.findById(id).populate('phaseHistory');
    const plant = await plantQuery;
    if (plant) {
      response.send(plant);
    } else {
      response.send({ message: 'plant not found' });
    }
  }

  private updatePlant = async (request: Request, response: Response, _: NextFunction) => {
    const id = request.params.id;
    const payload = request.body;
    let newPhases: any;

    try {
      if (payload.phaseHistory.length) {
        newPhases = await this.phaseHistory.insertMany(payload.phaseHistory);
        const pushPhases = async() => {
          for (const ph of newPhases) {
            await this.plant.findByIdAndUpdate(id, {
              $push: { phaseHistory: ph._id },
            });
          }
        };

        await pushPhases();
      }
      delete payload.phaseHistory;
      const updateQuery = this.plant.findByIdAndUpdate(id, {
        $set: payload,
      });

      const plant = await updateQuery;
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }

  private deletePlant = async (request: Request, response: Response, _: NextFunction) => {
    const id = request.params.id;
    try {
      const plantQuery = this.plant.findByIdAndDelete(id);
      const plant = await plantQuery;
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }

  private escapeRegex (str: string): any {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
}

export { PlantController };
