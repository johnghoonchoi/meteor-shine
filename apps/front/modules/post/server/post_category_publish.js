Meteor.publish('postCategoriesList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "state": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Match.Optional(Number),
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "seq": Match.Optional(Number)
    })
  }));

  Counts.publish(this, 'postCategoriesListCount', PostCategories.find(query),
    { noReady: true });

  var categories = PostCategories.find(query, options);

  return categories;

});

Meteor.publish('myPostCategoriesList', function(query, options) {
  check(query, Match.ObjectIncluding({
    "state": Match.Optional(String)
  }));

  check(options, Match.ObjectIncluding({
    "limit": Match.Optional(Number),
    "sort": Match.ObjectIncluding({
      "createdAt": Match.Optional(Number),
      "seq": Match.Optional(Number)
    })
  }));

  Counts.publish(this, 'postCategoriesListCount', PostCategories.find(query),
    { noReady: true });

  var categories = PostCategories.find(query, options);

  return categories;

})

Meteor.publish('postCategoryView', function(categoryId) {
  check(categoryId, String);

  var categories = PostCategories.find({ _id: categoryId });

  return categories;

});
