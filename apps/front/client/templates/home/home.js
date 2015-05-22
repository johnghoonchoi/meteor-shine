// var triggerHandle;

// Template.home.onRendered(function() {
//   triggerHandle = InfiniteScrollTrigger.bind(function() {
//     Router.go(Router.current().nextPath());
//   });
// });

// Template.home.onDestroyed(function() {
//   if (triggerHandle)
//     InfiniteScrollTrigger.unbind(triggerHandle);
// });

Template.home.events({
  'click .load-more': function () {
    Router.go(Router.current().nextPath());
  }
});


Template.home.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  }
});

/*
Template.home.events({
  'change input[name=theme]': function(e) {
    e.preventDefault();

    var theme = $(e.target).val();
    $('body').attr('class', '');
    if (theme !== 'none') {
      $('body').addClass(theme);
    }
  }
});
*/
