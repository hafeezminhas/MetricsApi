import * as joi from 'joi';

class Address {
  public street: string;
  public city: string;
  public zip?: string;
  public country: string;
}

const addressSchema = joi.object().keys({
  street: joi.string().required(),
  city: joi.string().required(),
  state: joi.string().required(),
  zip: joi.number(),
});

export { Address, addressSchema };
