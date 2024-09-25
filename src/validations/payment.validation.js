const Joi = require('joi');
// const { password, objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    amount: Joi.number().positive().required(),
    email: Joi.string().email().required(),
    currency: Joi.string().required(),
    paymentMethod: Joi.string().valid('fiat', 'crypto').required(),
  }),
};

const verifyPayment = {
  body: Joi.object().keys({
    reference: Joi.number().required()
  }),
};


module.exports = {
  createPayment,
  verifyPayment,
};
