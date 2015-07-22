
Template.headerClassic.events({
  'click [data-toggle=navigations]': function(e) {
    e.preventDefault();

    if ($('#container').hasClass('aside-left-on')) {
      asideSlide();
    } else {
      asideSlide('left');
    }
  },

  'click [data-toggle=notifications]': function(e) {
    e.preventDefault();

    if ($('#container').hasClass('aside-right-on')) {
      asideSlide();
    } else {
      asideSlide('right');
    }
  }
});
