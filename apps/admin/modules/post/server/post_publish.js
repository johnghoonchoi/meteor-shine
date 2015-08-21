Meteor.publish('postsList', function(query, options) {
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

  Counts.publish(this, 'postsListCount', Posts.find(query), { noReady: true });

  var posts = Posts.find(query, options);

  return posts;
});


Meteor.publish('postView', function(postId) {
  check(postId, String);

  var posts = Posts.find({ _id: postId });

  return posts;
});

