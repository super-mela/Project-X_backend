const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    user: Joi.string().min(6).required(),
    phone: Joi.string()
      .min(10)
      .max(13)
      .required()
      .pattern(/^[0-9]+$/),
    // password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string()
      .min(10)
      .required()
      .pattern(/^[0-9]+$/),
    // password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const varifyValidation = (data) => {
  const schema = Joi.object({
    phone: Joi.string()
      .min(10)
      .required()
      .pattern(/^[0-9]+$/),
    verifyKey: Joi.string().min(4).required(),
  });
  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.varifyValidation = varifyValidation;
