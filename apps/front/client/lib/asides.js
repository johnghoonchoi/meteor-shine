/**
 * slide the left and right aside templates
 */

var delta = function(width) {
  var diff = parseInt(($('main#content').width() - $('article.page').width()) / 2);

  return (width > diff) ? width - diff + 20 : 0;
};

asideSlide = function(move) {
  var container = $('#container');
  var content = $('main#content');

  switch (move) {
    case 'left':
      container.addClass('aside-left-on');
      container.removeClass('aside-right-on');

      var diff = delta($('aside.left').width());

      content.css('left', diff + 'px');
      content.css('right', -diff + 'px');
      break;

    case 'right':
      container.addClass('aside-right-on');
      container.removeClass('aside-left-on');

      var diff = delta($('aside.right').width());

      content.css('left', -diff + 'px');
      content.css('right', diff + 'px');
      break;

    default:
      container.removeClass('aside-left-on');
      container.removeClass('aside-right-on');
      content.css('left', 0);
      content.css('right', 0);
  }
};
