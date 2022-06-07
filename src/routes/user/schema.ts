import Joi from "joi";
export const schema = Joi.object().keys({
  uid: Joi.number().integer().strict(),
  email: Joi.string().strict(),
  password: Joi.string().strict(),
  address: Joi.string().strict(),
  yearOfEnrolment: Joi.number().strict(),
  name: Joi.string().strict(),
  phoneNumber: Joi.number().strict(),
  photoUrl: Joi.string().strict(),
  donationReceived: Joi.number().strict(),
});
