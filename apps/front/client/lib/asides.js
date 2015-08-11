/**
 * slide the left and right aside templates
 */

var delta = function(width) {
  var diff = parseInt(($('main#content').width() - $('article.page').width()) / 2);

  return (width > diff) ? width - diff + 20 : 0;
};

var asideFix = function () {

  // left priority
  var leftPin = (localStorage.getItem("leftPin") === "true");
  var rightPin = (localStorage.getItem("rightPin") === "true");

  if (leftPin) {
    return 'left';
  } else if (rightPin) {
    return 'right';
  }
};

asideSlide = function(move) {

  var container = $('#container');
  var content = $('main#content');

  if (!move) move = asideFix();

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
