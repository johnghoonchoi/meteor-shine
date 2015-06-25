Meteor.publish('blogsList', function(query, options) {

  Counts.publish(this, 'blogsCount', Blogs.find(), { noReady: true });

  var blogs = Blogs.find(query, options);
  var blogCommentCount = BlogComments.find();

  return [ blogs, blogCommentCount ];
});


Meteor.publishComposite('blogOne', function(query) {
  return {
    find: function() {
      return Blogs.find(query);
    },
    children: [
      {
        find: function(blog) {
          return Meteor.users.find(
            { _id: blog.user._id },
            { fields: { username: 1, profile: 1 } }
          )
        }
      }
    ]
  };
});

Meteor.publish('myBlogsList', function(query, options) {
  query = _.extend(query, { 'user._id': this.userId });

  Counts.publish(this, 'blogsCount', Blogs.find(query), { noReady: true });

  var blogs = Blogs.find(query, options);

  return blogs;
});


Meteor.publish('myBlogOne', function(blogId) {
  var blogs = Blogs.find({ _id: blogId, 'user._id': this.userId });

  return blogs;
});
