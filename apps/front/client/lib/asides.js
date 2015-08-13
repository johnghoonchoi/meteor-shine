/**
 * slide the left and right aside templates
 */

var delta = function(width) {
  var diff = parseInt(($('main#content').width() - $('article.page').width()) / 2);

  return (width > diff) ? width - diff + 20 : 0;
};

Aside = {
  _pinKey: function(position) {
    return (position && position.toLowerCase() === 'right') ?
      'aside-pin-right' : 'aside-pin-left';
  },

  _pinClass: function(position) {
    return (position && position.toLowerCase() === 'right') ?
      'aside-right-fixed' : 'aside-left-fixed';
  },

  isPined: function(position) {
    return (localStorage.getItem(this._pinKey(position)) === '1');
  },

  pin: function(position, state) {
    var container = $('#container');

    if (state) {
      localStorage.setItem(this._pinKey(position), '1');

      container.removeClass('aside-left-on');
      container.addClass(this._pinClass(position));
    } else {
      localStorage.setItem(this._pinKey(position), '0');
      container.removeClass(this._pinClass(position));
      container.addClass('aside-left-on');
    }
  },

  togglePin: function(position) {
    this.pin(position, ! this.isPined(position));
  },

  show: function(position) {
    var container = $('#container');

    if (! position) {
      if (this.isPined('right'))
        position = 'right';

      if (this.isPined('left'))
        position = 'left';
    }

    switch (position) {
      case 'left':
        container.removeClass('aside-right-on');
        container.addClass('aside-left-fixed');
        break;

      case 'right':
        container.removeClass('aside-left-on');
        container.addClass('aside-right-fixed');
        break;

      default:
        container.removeClass('aside-left-on');
        container.removeClass('aside-right-on');
    }
  },

  hide: function() {
    var container = $('#container');
    if (! Aside.isPined('left')) {
      container.removeClass('aside-left-on');
    }

    if (! Aside.isPined('right')) {
      container.removeClass('aside-right-on');
    }
  },

  toggle: function(position) {
    if (position === 'left' && ! Aside.isPined('left')) {
      $('#container').toggleClass('aside-left-on');
    } else if (position === 'right' && ! Aside.isPined('right')) {
      $('#container').toggleClass('aside-right-on');
    }
  }
};

