import Joi from "joi";
export const schema = Joi.object().keys({
    name: Joi.string().required(),
    agenda: Joi.string().required(),
    description: Joi.string().required(),
    posterUrl:Joi.string().uri().allow(""),
    startDate:Joi.date(),
    endDate:Joi.date(),
    theme: Joi.string().pattern(
        new RegExp(
          "^EDUCATION$|^HEALTHCARE$|^LIFESTYLE$|^LIVELIHOOD$|^CAREER_COUNSELLING$|^GENERAL_COUNSELLING$|^WELLNESS_COUNSELLING$"
        )
      ),
    location: Joi.string().allow(""),
  });