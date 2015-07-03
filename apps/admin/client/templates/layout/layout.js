Template.layout.events({
	'click #main-overlay': function () {
    console.log('Hello!');
    $('#container').removeClass('aside-left-set')
  },
  'click article.page': function () {
    // Close aside-right when page content is clicked
    // Comment this section out to disable this feature
    var wrapper = $('#wrapper');
    if (wrapper.hasClass('aside-right-set')) {
      wrapper.removeClass('aside-right-set');
    } else {

    }
  },
  'click .aside-right li': function () {
    // Close aside-right when notification li is clicked
    // Comment this section out to disable this feature
    var wrapper = $('#wrapper');
    if (wrapper.hasClass('aside-right-set')) {
      wrapper.removeClass('aside-right-set');
    } else {

    }
  }
});

Template.layout.onRendered( function () {

  var wrapper = $('#wrapper');

  // Check Mobile Mode when rendered
  if ($(window).width() <= 750) {
    wrapper.addClass('mobile');
  } else {
    wrapper.removeClass('mobile');
  };

  // Check Mobile Mode on resize
  $(window).on( 'resize', function () {
    if ($(window).width() <= 750) {
      // When Mobile
      wrapper.addClass('mobile');
      if (wrapper.hasClass('aside-right-set')) {
        // Collapse Notifications
        wrapper.removeClass('aside-right-set');
      } else {

      }
      if (wrapper.hasClass('aside-left-set')) {
        // Collapse Tree Menu
        wrapper.removeClass('aside-left-set');
      } else {

      }
    } else {
      // When Not Mobile (Above 750px)
      wrapper.removeClass('aside-left-set');
      wrapper.removeClass('mobile');
    }
    // else {
    //   wrapper.removeClass('mobile');
    // };
  });

});

