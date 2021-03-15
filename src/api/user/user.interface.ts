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
    country: string
  };
}

export default User;
