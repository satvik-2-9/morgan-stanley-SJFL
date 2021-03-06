import Joi from "joi";
export const schema = Joi.object().keys({
  uid: Joi.string().strict(),
  email: Joi.string().strict(),
  password: Joi.string().strict(),
  name: Joi.string().strict(),
  photoUrl: Joi.string().uri().allow(""),
});
