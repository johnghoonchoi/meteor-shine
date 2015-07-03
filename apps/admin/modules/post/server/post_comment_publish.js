Meteor.publish('postCommentsList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "postId": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Number,
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number)
    })
  }));

  Counts.publish(this, 'postCommentsListCount', PostComments.find(query),
    { noReady: true });

  var comments = PostComments.find(query, options);

  return comments;
});
