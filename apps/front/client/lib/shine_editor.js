/* Shine Editor CLASS DEFINITION
 * ============================= */

ShineEditor = function() {
  // define properties here..
};

ShineEditor.prototype = {
  Constructor: ShineEditor,

  updateInputCount: function(max, target) {
    max = max || 100;
    var textLength = $(target).text().trim().length;
    var count = max - textLength;
    //str.slice(beginSlice[, endSlice])
    $('span.input-counter').text(count);
    if (count <= 0) {
      alert('30자 미만으로 입력해주세요.');
      $('[type=submit]').prop('disabled', true);
    } else {
      $('[type=submit]').prop('disabled', false);
    }
  }
};

