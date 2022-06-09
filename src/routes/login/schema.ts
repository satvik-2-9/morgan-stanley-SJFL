import Joi from "joi";
export const schema = Joi.object().keys({
  uid: Joi.string().strict(),
  password: Joi.string().strict(),
});
