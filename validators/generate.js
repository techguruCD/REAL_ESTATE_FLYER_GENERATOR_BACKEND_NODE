const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({
  passError: true
})

const listed = [
  validator.body(
    Joi.object({
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
      propertyAddress: Joi.string().min(1).required().label('Property Address'),
      fullName: Joi.string().min(1).required().label('Full Name'),
      email: Joi.string().email().required().label('Email'),
      phoneNumber: Joi.string().min(1).required().label('Phone Number'),
      companyName: Joi.string().min(1).required().label('Company Name'),
      website: Joi.string().min(1).required().label('Website'),
      bedRoom: Joi.number().required().label('Bed Room'),
      bathroom: Joi.number().required().label('Bathroom'),
      squareFeet: Joi.number().required().label('Square'),
      description: Joi.string().default('').label('Description')
    }).required()
  )
]

module.exports = {
  listed,
  notListed
}