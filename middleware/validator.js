const joi = require('joi')

exports.signUpValidation = async (req, res, next) => {
  const schema = joi.object({
    firstName: joi.string().min(3).max(15).required().pattern(new RegExp('[A-Za-z]+$')).required().messages({
      'any.required': 'FirstName is required',
      'string.empty': 'FirstName is required',
      'string.min': 'FirstName should contain at least three characters',
      'string.max': 'FirstName should not be more than 30 characters',
      'string.pattern.base': 'FirstName can only contain letters with no spaces',
    }),

    lastName: joi.string().min(3).max(15).required().pattern(new RegExp('[A-Za-z]+$')).required().messages({
      'any.required': 'LastName is required',
      'string.empty': 'LastName is required',
      'string.min': 'LastName should contain at least three characters',
      'string.max': 'LastName should not be more than 30 characters',
      'string.pattern.base': 'LastName can only contain letters with no spaces',
    }),
    email: joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
    }),
    phoneNumber: joi
      .string()
      .pattern(/^[7-9][0-9]{9}$/)
      .required()
      .messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be a valid 10-digit number (e.g. 8012345678)',
      }),

    password: joi
      .string()
      .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$'))
      .required()
      .messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
        'string.pattern.base':
          'Password must contain at least eight characters, one UpperCase, Lowercase, Digits and a special character[#?!@$%^&*-]',
      }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }
  next()
}

exports.loginValidator = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
    }),

    password: joi.string().required().messages({
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty',
    }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }
  next()
}

exports.vendorSignUpValidation = async (req, res, next) => {
  const schema = joi.object({
    businessName: joi
      .string()
      .min(3)
      .max(15)
      .required()
      .pattern(new RegExp('[A-Za-z]+$'))
      .required()
      .messages({
        'any.required': 'businessName is required',
        'string.empty': 'businessName is required',
        'string.min': 'businessName should contain at least three characters',
        'string.max': 'businessName should not be more than 30 characters',
      }),
    businessAddress: joi
      .string()
      .min(5)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s,.'\-/#]+$/)
      .required()
      .messages({
        'any.required': 'Business address is required',
        'string.empty': 'Business address cannot be empty',
        'string.min': 'Business address should contain at least 5 characters',
        'string.max': 'Business address should not exceed 100 characters',
        'string.pattern.base': 'Business address contains invalid characters',
      }),

    firstName: joi.string().min(3).max(15).required().pattern(new RegExp('[A-Za-z]+$')).required().messages({
      'any.required': 'firstName is required',
      'string.empty': 'firstName is required',
      'string.min': 'firstName should contain at least three characters',
      'string.max': 'firstName should not be more than 30 characters',
      'string.pattern.base': 'firstName can only contain letters with no spaces',
    }),

    lastName: joi.string().min(3).max(15).required().pattern(new RegExp('[A-Za-z]+$')).required().messages({
      'any.required': 'LastName is required',
      'string.empty': 'LastName is required',
      'string.min': 'LastName should contain at least three characters',
      'string.max': 'LastName should not be more than 30 characters',
      'string.pattern.base': 'LastName can only contain letters with no spaces',
    }),
    businessEmail: joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
    }),
    phoneNumber: joi
      .string()
      .pattern(/^[7-9][0-9]{9}$/)
      .required()
      .messages({
        'string.empty': 'Phone number is required',
        'string.pattern.base': 'Phone number must be a valid 10-digit number (e.g. 8012345678)',
      }),
    password: joi
      .string()
      .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!%*?&]{8,})$'))
      .required()
      .messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
        'string.pattern.base':
          'Password must contain at least eight characters, one UpperCase, Lowercase, Digits and a special character[#?!@$%^&*-]',
      }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }
  next()
}

exports.vendorLoginValidator = async (req, res, next) => {
  const schema = joi.object({
    businessEmail: joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty',
      'string.email': 'Invalid email format',
    }),

    password: joi.string().required().messages({
      'any.required': 'Password is required',
      'string.empty': 'Password cannot be empty',
    }),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }
  next()
}
