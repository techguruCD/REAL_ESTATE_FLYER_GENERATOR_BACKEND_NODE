const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({
  passError: true
})

const listed = [
  validator.body(
    Joi.object({
      plan: Joi.string().min(1).required().label('Plan'),
      propertyAddress: Joi.string().min(1).required().label('Property Address'),
      fullName: Joi.string().min(1).required().label('Full Name'),
      email: Joi.string().email().required().label('Email'),
      phoneNumber: Joi.string().min(1).required().label('Phone Number'),
      companyName: Joi.string().min(1).required().label('Company Name'),
      website: Joi.string().min(1).required().label('Website')
    }).required()
  )
]

const notListed = [
  validator.body(
    Joi.object({
      plan: Joi.string().min(1).required().label('Plan'),
      propertyAddress: Joi.string().min(1).required().label('Property Address'),
      fullName: Joi.string().min(1).required().label('Full Name'),
      email: Joi.string().email().required().label('Email'),
      phoneNumber: Joi.string().min(1).required().label('Phone Number'),
      companyName: Joi.string().min(1).required().label('Company Name'),
      website: Joi.string().min(1).required().label('Website'),
      bedroom: Joi.number().required().label('Bed Room'),
      bathroom: Joi.number().required().label('Bathroom'),
      squareFeet: Joi.number().required().label('Square'),
      description: Joi.any(),
      images: Joi.any()
      // images: Joi.array().items(Joi.object({
      //   size: Joi.number().max(5000000).required(),
      //   mimetype: Joi.string().valid('image/jpeg', 'image/png').required()
      // })).min(1).required().label('Image')
    }).required()
  )
]

module.exports = {
  listed,
  notListed
}