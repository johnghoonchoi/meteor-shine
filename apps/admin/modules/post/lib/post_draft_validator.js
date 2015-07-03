
PostDraftValidator = {
  schema: {
    title: {
      name: 'title',
      type: 'string',
      required: false,
      minLength: 1,
      maxLength: 100
    },

    content: {
      name: 'content',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 65536
    }
  },

  validateInsert: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content']);

    return validator;
  },

  validateUpdate: function(object) {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content']);

    return validator;
  }
};


matchPostDraftInsert = function(object) {
  var validation = PostDraftValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchPostDraftUpdate = function(object) {
  var validation = PostDraftValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};

