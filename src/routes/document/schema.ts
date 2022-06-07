import Joi from "joi";
export const schema = Joi.object().keys({
  request: Joi.number().integer().strict(),
  user: Joi.number().integer().strict(),
  data: Joi.any(),
});
