const errors = {
  required: 'This field is required',
  minlength: 'This field must be at least {{requiredLength}} characters long',
  maxlength: 'This field must be no more than {{requiredLength}} characters long',
  min: 'This field must be at least {{min}}',
  max: 'unknown error',
};

/**
 * asterisk syntax is for times when you want to use a default value for undeclared errors
 *
 * errors : ['required', 'min', 'max' ]
 *
 * errorsLabels : {
 *  'required': 'This field is required',
 *  '*': 'You need to have minimum 5 and maximum 10 characters',
 * }
 *
 * the asterisk is used when not other error is present in form control
 *
 */
