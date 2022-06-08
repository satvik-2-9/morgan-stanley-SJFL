import Joi from "joi";
export const schema = Joi.object().keys({
  uid: Joi.string().strict(),
  email: Joi.string().strict(),
  password: Joi.string().strict(),
  address: Joi.any(),
  yearOfEnrolment: Joi.string().strict(),
  name: Joi.string().strict(),
  phoneNumber: Joi.string().strict(),
  photoUrl: Joi.string().allow(""),
  donationReceived: Joi.number().strict(),
});
