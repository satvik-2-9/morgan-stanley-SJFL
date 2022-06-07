import Joi from "joi";
export const schema = Joi.object().keys({
  type: Joi.string().pattern(new RegExp("^FINANCIAL$|^NON_FINANCIAL$")),
  theme: Joi.string().pattern(
    new RegExp(
      "^EDUCATION$|^HEALTHCARE$|^LIFESTYLE$|^LIVELIHOOD$|^CAREER_COUNSELLING$|^GENERAL_COUNSELLING$|^WELLNESS_COUNSELLING$"
    )
  ),
  description: Joi.string().allow(""),
  user: Joi.number().integer().strict(),
  admin: Joi.number().integer().strict(),
  donation: Joi.number(),
});
