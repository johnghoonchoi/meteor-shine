
CategoryValidator = {
  schema: {
    _id: {
      name: '_id',
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 20
    },

    title: {
      name: 'title',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },

    seq: {
      name: 'seq',
      type: 'number',
      required: false
    },

    state: {
      name: 'state',
      type: 'number',
      required: true,
      values: [ 'ON', 'OFF' ]
    },

    permission: {
      name: 'permission',
      type: 'object',
      required: true
    }
  },

  validateInsert: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['_id', 'title', 'permission']);

    return validator;
  },

  validateUpdate: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'state', 'permission']);

    return validator;
  }
};


matchCategoryInsert = function(object) {
  var validation = CategoryValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchCategoryUpdate = function(object) {
  var validation = CategoryValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};
