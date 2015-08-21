Meteor.publishComposite('postsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "category": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  return {
    find: function() {
      return Posts.find(query, options);
    },
    children: [
      {
        find: function(post) {
          return Meteor.users.find({ _id: post.author._id});
        }
      }
    ]
  };
});

Meteor.publish('postsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "category": Match.Optional(String)
  }));

  Counts.publish(this, 'postsListCount', Posts.find(query));
});

Meteor.publish('postView', function(postId) {
  check(postId, String);

  var posts = Posts.find({ _id: postId });

  return posts;
});

