
Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  notificationInsert: function(attributes) {

    var object = {
      user: { _id: attributes.user._id },
      mobile: { }
    };

    Notifications.insert(object);
  },

  notificationRead: function(id) {
    var properties = {
      read: true,
      readAt: new Date()
    };

    Notifications.update({ _id: id, 'user._id': this.userId }, { $set: properties });
  },

  notificationReadAll: function() {
    var properties = {
      read: 1,
      readAt: new Date()
    };

    Notifications.update({ 'user._id': this.userId }, { $set: properties }, { multi: true });
  }
});

createCommentNotification = function(comment) {
  var blog = Blogs.findOne(comment.blogId);

  if (blog.user._id !== comment.user._id) {
    var message = I18n.get('text_notification_new_comment', [ userDisplayName(blog.user) ]);
    var messageUri = 'blog/' + blog._id;

    Notifications.insert({
      user: { _id: blog.user._id },
      msg: {
        type: NOTIFICATION_MSG_TYPE_COMMENT,
        content: message,
        link: messageUri
      },
      read: false,
      createdAt: new Date()
    });
  }
};
