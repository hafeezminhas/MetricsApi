import { Address } from '../user/address.dto';

interface Company {
  _id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address?: Address;
  established: Date;
  metricId: number;
  stateLicense: string[];
  companySize: number;
  subscriptionType: number;
  userCount: number;
}

export { Company };
