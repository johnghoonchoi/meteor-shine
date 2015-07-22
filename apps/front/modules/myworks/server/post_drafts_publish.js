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

  Counts.publish(this, 'postDraftsListCount', PostDrafts.find(query),
    { noReady: true });

  return PostDrafts.find(query, options);

});

Meteor.publish('postDraftEdit', function(draftId) {
  check(draftId, String);
  return PostDrafts.find({ _id: draftId });
});
