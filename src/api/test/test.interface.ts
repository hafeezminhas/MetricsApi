import {Company} from '../company/company.interface';

class TestParams {
  public date: Date;
  public airTemp: number;
  public airRH: number;
  public co2: number;
  public lightIntensity: number;
  public waterPH: number;
  public waterTDS: number;
  public waterOxygen: number;
}

interface Test {
  _id?: string;
  name: string;
  description: string;
  plants: string[];
  testParams: TestParams[];
  company: Company,
  resultDate: Date;
  wetWeight: number;
  dryWeight: number;
  trimmedWeight: number;
  THCA: number;
  DELTATHC: number;
  THCVA: number;
  CBDA: number;
  CBGA: number;
  CBL: number;
  CBD: number;
  CBN: number;
  CBT: number;
  TAC: number;
}

export { TestParams, Test }