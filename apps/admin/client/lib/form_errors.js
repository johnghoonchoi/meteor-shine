/**
 * Show validation errors
 *
 * @param errors
 */
showValidationErrors = function(e, errors) {
  $(e.target).find('.has-error').removeClass('has-error');
  $(e.target).find('.help-block').html('');

  _.each(errors, function(error) {
    var translated = "";
    _.each(error.messages, function(message) {
      translated += I18n.get(message);
    });

    var element = $(e.target).find('[name=' + error.attribute + ']');
    element.parent().addClass('has-error');
    element.next().html(translated);
  });
};
