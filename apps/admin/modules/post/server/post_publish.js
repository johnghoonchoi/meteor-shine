/*
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

  var posts = Posts.find(query, options);

  var userIds = posts.map(function(post) {
    return post.author._id;
  });

  var users = Meteor.users.find({ _id: { $in : userIds }});

  return [ posts, users ];
});
*/

Meteor.publishComposite('postsList', function(query, options) {
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
  check(query, Match.Optional({
    "categoryId": Match.Optional(String)
  }));

  Counts.publish(this, 'postsListCount', Posts.find());
});

Meteor.publish('postView', function(postId) {
  check(postId, String);

  var posts = Posts.find({ _id: postId });

  return posts;
});

