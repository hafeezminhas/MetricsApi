import { createValidator } from 'express-joi-validation';
import * as moment from 'moment';
import { NextFunction, Request, Response, Router } from 'express';

import Controller from '../../interfaces/controller.interface';
import authMiddleware from '../../middleware/auth.middleware';
import { plantModel } from './plant.model';
import { plantCreateValidator, plantUpdateValidator } from './plant.dto';
import Plant from './plant.interface';
import { PlantPhaseHistoryItem } from './plant.enum';

const validator = createValidator();

class PlantController implements Controller {
  public path = '/plants';
  public router = Router();
  private plant = plantModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.getPlants);
    this.router.post(`${this.path}`, authMiddleware, validator.body(plantCreateValidator), this.createPlant);
    this.router.get(`${this.path}/:id`, authMiddleware, this.getPlantById);
    this.router.put(`${this.path}/:id`, authMiddleware, validator.body(plantUpdateValidator), this.updatePlant);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.deletePlant);
  }

  private getPlants = async (request: Request, response: Response, next: NextFunction) => {
    const page = +request.query.page || 1;
    const limit = +request.query.limit || 10;
    const plantQuery = this.plant.find()
                               .skip(page * limit)
                               .limit(limit)
                               .populate('phaseHistory');

    const plants = await plantQuery;
    response.send({ page, limit, plants });
  }

  private createPlant = async (request: Request, response: Response, next: NextFunction) => {
    const payload: Plant = request.body;
    payload.phaseHistory.push({
      phase: PlantPhaseHistoryItem.Seedling,
      start: moment().toISOString(),
      end: null,
    });
    try {
      const plant = await this.plant.create(payload);
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }

  private getPlantById = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const plantQuery = this.plant.findById(id).populate('phaseHistory');
    const plant = await plantQuery;
    if (plant) {
      response.send(plant);
    } else {
      response.send({ message: 'plant not found' });
    }
  }

  private updatePlant = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    const plantQuery = this.plant.findByIdAndUpdate(id, {
      $set: request.body,
      $new: true,
    });
    try {
      const plant = await plantQuery;
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }

  private deletePlant = async (request: Request, response: Response, next: NextFunction) => {
    const id = request.params.id;
    try {
      const plantQuery = this.plant.findByIdAndDelete(id);
      const plant = await plantQuery;
      response.send(plant);
    } catch (e) {
      response.send(e);
    }
  }
}

export { PlantController };
