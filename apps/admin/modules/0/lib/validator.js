/**
 * validate
 *    type:     String, Number, Boolean, Array, Object
 *    null
 *    min
 *    max
 *    custom
 *
 * @type {{}}
 */
Validator = function(schema) {

  var _schema = schema;

  var _errors = [];

  this.schema = function(attribute) {
    return (_schema) ? _schema[attribute] : null;
  };

  // get all errors
  this.errors = function() {
    return _errors;
  };

  // set a new error
  this.setError = function(attribute, message) {

    var _findError = function(attribute) {
      for (var i = 0; i < _errors.length; i++) {
        if (_errors[i].attribute === attribute)
          return _errors[i];
      }
      return null;
    };

    var error = _findError(attribute);
    if (! error) {
      error = {
        attribute: attribute,
        messages: [ message ]
      };

      _errors.push(error);
    } else {
      error.messages.push(message);
    }
  };

  this.validate = function(object, attributes) {
    var self = this;

    if (! _.isArray(attributes)) {
      attributes = [ attributes ];
    }

    for (var i = 0; i < attributes.length; i++) {
      var attribute = attributes[i];

      var rule = self.schema(attribute);
      var value = object[attribute];

      if (rule.required === false && ! value) {
        return;
      }

      if (typeof value !== rule.type)
        self.setError(attribute, "error_invalid_type");

      if (rule.required && ! value) {
        self.setError(attribute, "error_input_required");
        return;
      }

      if (rule.type === 'string') {
        if (rule.values && rule.values.length > 0) {
          if (! _.contains(rule.values, value)) {
            self.setError(attribute, "error_invalid_input");
          }
        }

        if ((rule.minLength && value.length < rule.minLength) ||
            (rule.maxLength && value.length > rule.maxLength)) {
          self.setError(attribute, "error_out_of_range");
        }

      }

    }

  }
};

