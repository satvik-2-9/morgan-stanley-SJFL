import Joi from "joi";
export const schema = Joi.object().keys({
  uid: Joi.string().allow(""),
  password: Joi.string().allow(""),
});
