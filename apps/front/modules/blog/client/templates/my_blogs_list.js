// var triggerHandle;

// Template.myBlogsList.onRendered(function() {
//   triggerHandle = InfiniteScrollTrigger.bind(function() {
//     if (Router.current().nextPath())
//       Router.go(Router.current().nextPath());
//   });
// });

// Template.myBlogsList.onDestroyed(function() {
//   if (triggerHandle)
//     InfiniteScrollTrigger.unbind(triggerHandle);
// });
Template.myBlogsList.events({
  'click .load-more': function () {
    Router.go(Router.current().nextPath());
  }
});

Template.myBlogsList.helpers({
  noBlogs: function() {
    return Counts.get('blogsCount') === 0;
  }
});

Template.myBlogsListItem.helpers({
  blog_content: function() {
    var content = this.content;
    // return content.replace(/<(?:.|\n)*?>/gm, '');
    return content;
  }
});
