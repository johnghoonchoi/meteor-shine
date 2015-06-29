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
  },

  'click #alert-test': function() {
    Alerts.dialog('alert', 'Hi there...', function() {
      console.log('done...');
    });
  }
});


Template.home.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  }
});

Template.homeListItem.helpers({
  blog_content: function() {
    var content = this.content;
    //return content.replace(/<(?:.|\n)*?>/gm, '');
    //return content.replace(/(<([^>]+)>)/ig, "");
    return content;
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
