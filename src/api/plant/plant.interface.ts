import { PlantPhaseHistory } from './plant-phase-history.dto';

export interface Plant {
  name: string;
  metricId: string;
  strain: string;
  type: number;
  plantedOn?: Date;
  mother?: string;
  currentPhase: string;
  phaseHistory: PlantPhaseHistory[];
  location: string;
  company: string;
}
export default Plant;
