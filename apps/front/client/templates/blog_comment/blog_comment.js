Template.blogCommentNew.helpers({
  editable: function() {
    return '<div class="editable form-control" contenteditable="true" name="msg"></div>';
  }
});

Template.blogCommentNew.events({
  'submit #formBlogCommentNew': function(e) {
    e.preventDefault();

    var blogId = Template.parentData().blog._id;

    var object = {
      blogId: blogId,
      msg: $(e.target).find('[name=msg]').html()
    };

    var validation = BlogCommentValidator.validateInsert(object);
    if (validation.errors().length > 0) {
      validation.errors().forEach(function(error) {
        Alerts.notify('error', error.messages);
      });
      return;
    }


    Meteor.call('blogCommentInsert', object, function(error) {
      if (error)
        Alerts.notify('error', error.reason);
    })
  }
});

var triggerHandle;

Template.blogCommentsList.onRendered(function() {
  triggerHandle = InfiniteScrollTrigger.bind(function() {
    if (Router.current().nextPath())
      Router.go(Router.current().nextPath());
  });
});

Template.blogCommentsList.onDestroyed(function() {
  if (triggerHandle)
    InfiniteScrollTrigger.unbind(triggerHandle);
});

Template.blogCommentsList.events({
  'click .load-more': function () {
    // if (Router.current().nextPath())
  }
});
