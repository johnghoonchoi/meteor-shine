/**
 *
 * releasedPostsList, releasePostsListCount
 *    categoryId
 *    state: 'PUBLISHED'
 *
 * releasedPostView
 *    postId
 *    state: 'PUBLISHED'
 *
 * postsList, postsListCount
 *    categoryId
 *
 * myPostsList, myPostsListCount
 *    userId
 *
 */

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

  return Posts.find(query, options);
});


Meteor.publish('releasedPostsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  query = _.extend(query, { state: 'PUBLISHED' });

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

Meteor.publish('myPostsList', function(options) {
  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "publishedAt": Match.Optional(Number)
    })
  }));

  var query = { 'author._id': this.userId };

  Counts.publish(this, 'myPostsListCount', Posts.find(query),
    { noReady: true });

  return Posts.find(query, options);
});


Meteor.publish('myPostsListCount', function() {
  var query = { 'author._id': this.userId };

  Counts.publish(this, 'myPostsListCount', Posts.find(query));
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

  // TODO check permission
  // Admin only

  Counts.publish(this, 'postsListCount', Posts.find(query),
    { noReady: true });

  return Posts.find(query, options);
});


Meteor.publish('postsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  // TODO check permission
  // Admin only

  Counts.publish(this, 'postsListCount', Posts.find(query));
});

