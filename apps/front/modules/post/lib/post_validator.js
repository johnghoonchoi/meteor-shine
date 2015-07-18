
PostValidator = {
  schema: {
    title: {
      name: 'title',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
    },
    // todo: 이 부분은 어떻게 벨리데이션 체크해야되는지..
    content: {
      name: 'content',
      type: 'object',
      required: true,
      minLength: 1,
      maxLength: 65536
    },

    categoryId: {
      name: 'categoryId',
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 100
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
  },

  validatePublish: function() {
    var validator = new Validator(this.schema);

    validator.validate(object, ['title', 'content', 'categoryId']);

    return validator;
  }
};


matchPostInsert = function(object) {
  var validation = PostValidator.validateInsert(object);
  return _.isEmpty(validation.errors());
};

matchPostUpdate = function(object) {
  var validation = PostValidator.validateUpdate(object);
  return _.isEmpty(validation.errors());
};

matchPostPublish = function() {
  var validation = PostValidator.validatePublish(object);
  return _.isEmpty(validation.errors());
};
