interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  company: string | any;
  password: string;
  role: string;
  address: {
    street: string,
    city: string,
    zip: number,
    state: string,
  };
  isActive: boolean;
  isLocked: boolean;
  isDeleted: boolean;
}

export { User };
