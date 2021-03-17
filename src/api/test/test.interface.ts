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
  name: string;
  description: string; // large string possibly a textarea in UI
  plants: string[]; // REFs to Plants
  testParams: TestParams[]; // Can have multiple params model list against each test
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