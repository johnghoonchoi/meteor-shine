
Template.postEdit.onCreated(function() {
  var instance = this;
  var data = Template.currentData();

  console.log('subscribe postId = ' + data.postId);

  instance.autorun(function() {
    Meteor.subscribe('releasedPostView', data.postId);
  });

  instance.post = function() {
    return Posts.findOne({ _id: data.postId, state: 'PUBLISHED' });
  };

  instance.category = function(categoryId) {
    return Categories.findOne({ _id: categoryId });
  };
});


Template.postEdit.helpers({
  category: function() {
    var post = Template.instance().post();
    return (post) ? Template.instance().category(post.categoryId) : null;
  },

  title: function() {
    var post = Template.instance().post();
    return (post) ? post.title : '';
  },

  content: function() {
    var post = Template.instance().post();
    return (post && post.content) ? post.content.data : '';
  }
});

Template.postEdit.events({

});
