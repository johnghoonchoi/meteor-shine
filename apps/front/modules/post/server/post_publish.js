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

  query = _.extend(query, { 'author._id': this.userId, state: 'PUBLISHED' });

  Counts.publish(this, 'releasedPostsListCount', Posts.find(query),
    { noReady: true });

  Meteor._sleepForMs(200);
  return Posts.find(query, options);
});

Meteor.publish('postDraftsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number)
    })
  }));

  query = _.extend(query, { 'author._id': this.userId });

  Counts.publish(this, 'myDraftCount', Posts.find(query),
    { noReady: true });

  Meteor._sleepForMs(200);
  return PostDrafts.find(query, options);
});

//Meteor.publish('postDraftEdit', function(draftId) {
//  check(draftId, String);
//  return PostDrafts.find({ _id: draftId });
//});

Meteor.publish('releasedPostsListCount', function(query) {
  check(query, Match.ObjectIncluding({
    "categoryId": Match.Optional(String)
  }));

  query = _.extend({ 'author._id': this.userId }, query );
  Counts.publish(this, 'releasedPostsListCount', Posts.find(query));
});

Meteor.publish('myDraftCount', function(query) {
  query = _.extend({ 'author._id': this.userId }, query );
  Counts.publish(this, 'myDraftCount', PostDrafts.find(query),
    { noReady: true });
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




//Meteor.publish('postsList', function(query, options) {
//  check(query, Match.ObjectIncluding({
//    "categoryId": Match.Optional(String)
//  }));
//
//  check(options, Match.ObjectIncluding({
//    "limit": Number,
//    "sort": Match.ObjectIncluding({
//      "createdAt": Match.Optional(Number),
//      "publishedAt": Match.Optional(Number)
//    })
//  }));
//
//  Counts.publish(this, 'postsListCount', Posts.find(query),
//    { noReady: true });
//
//  var posts = Posts.find(query, options);
//
//  return posts;
//});


