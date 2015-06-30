Template.blogEdit.helpers({
  editable: function() {
    var content = (this.blog && this.blog.content) ? this.blog.content : '';
    return '<div class="editable form-control" contenteditable="true" name="content">' + content + '</div>';
  }
});

Template.blogEdit.events({
  'submit #formBlogEdit': function(e) {
    e.preventDefault();

    // get inputs
    var blogId = this.blog._id;
    var object = {
      title: $(e.target).find('[name=title]').val(),
      content: $(e.target).find('[name=content]').html()
    };

    // validate inputs
    var validation = BlogValidator.validateUpdate(object);
    if (! _.isEmpty(validation.errors())) {
      showValidationErrors(e, validation.errors());
      return;
    }

    // method call 'blogUpdate'
    Meteor.call('blogUpdate', blogId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        if (result !== 1) {
          alert('update fails');
        } else {
          Alerts.notify('success', 'Blog updated successfully.');
          Router.go('myBlogsList');
          /*
          Alerts.dialog('alert', 'Blog update succeeded', function() {
            Router.go('myBlogsList');
          });
          */
        }
      }
    });

  },

  'click #btnRemove': function(e) {
    e.preventDefault();

    // confirm remove
    Alerts.dialog("confirm", "delete?", function(response) {
      if (response) {
        Meteor.call('blogRemove', this.blog._id, function(error, result) {
          if (error) {
            alert(error.reason);
          } else {
            if (result !== 1) {
              alert('remove fails');
            } else {
              alert('remove success');
              Router.go('myBlogsList');
            }
          }
        });
      }
    });
  }
});
