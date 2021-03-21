import * as joi from 'joi';
class Address {
}
const addressSchema = joi.object().keys({
    street: joi.string().required(),
    city: joi.string().required(),
    zip: joi.number(),
    state: joi.string().required(),
});
export { Address, addressSchema };
//# sourceMappingURL=address.dto.js.map