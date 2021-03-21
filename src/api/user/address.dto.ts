import * as joi from 'joi';

class Address {
  public street: string;
  public city: string;
  public zip?: string;
  public state: string;
}

const addressSchema = joi.object().keys({
  street: joi.string().required(),
  city: joi.string().required(),
  zip: joi.number(),
  state: joi.string().required(),
});

export { Address, addressSchema };
