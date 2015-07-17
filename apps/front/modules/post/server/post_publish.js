Meteor.publish('releasedPostsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  query = _.extend(query, { state: 'PUBLISHED' });

  Counts.publish(this, 'releasedPostsListCount', Posts.find(query),
    { noReady: true });

  var posts = Posts.find(query, options);

  return posts;

});

Meteor.publish('releasedPostsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  Counts.publish(this, 'releasedPostsListCount', Posts.find(query));
});

Meteor.publishComposite('releasedPostView', function(postId) {
  check(postId, String);

  return {
    find: function() {
      return Posts.find({ _id: postId, state: 'PUBLISHED' });
    },
    children: [
      {
        find: function() {
          var post = Posts.findOne(postId);
          return Categories.find({ _id: post.categoryId });
        }
      },
      {
        find: function() {
          return PostLikes.find({ 'user._id': this.userId, postId: postId });
        }
      }
    ]
  };
});


Meteor.publish('postsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  Counts.publish(this, 'postsListCount', Posts.find(query),
    { noReady: true });

  var posts = Posts.find(query, options);

  return posts;
});

Meteor.publish('postView', function(postId) {
  check(postId, String);

  var posts = Posts.find({ _id: postId });

  return posts;
});

