Meteor.publish('postDraftsList', function(query, options) {
  //check(query, Match.ObjectIncluding({
  //  "categoryId": Match.Optional(String)
  //}));
  //
  //check(options, Match.ObjectIncluding({
  //  "limit": Number,
  //  "sort": Match.ObjectIncluding({
  //    "createdAt": Match.Optional(Number),
  //    "publishedAt": Match.Optional(Number)
  //  })
  //}));

  //query = _.extend(query, { state: 'PUBLISHED' });

  query = _.extend(query, { 'author._id': this.userId });

  Counts.publish(this, 'postDraftsListCount', PostDrafts.find(query),
    { noReady: true });

  var postDrafts = PostDrafts.find(query, options);

  return postDrafts;

});
