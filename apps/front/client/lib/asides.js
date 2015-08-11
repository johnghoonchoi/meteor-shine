/**
 * slide the left and right aside templates
 */

asideSlide = function(move) {
  var container = $('#container');

  switch (move) {
    case 'left':
      container.addClass('aside-left-on');
      container.removeClass('aside-right-on');
      break;

    case 'right':
      container.addClass('aside-right-on');
      container.removeClass('aside-left-on');
      break;

    default:
      container.removeClass('aside-left-on');
      container.removeClass('aside-right-on');
  }
};
