/**
 *
 */
Meteor.publish('releasedCategoriesList', function() {

  Counts.publish(this, 'releasedCategoriesListCount', Categories.find({ state: 'ON' }),
    { noReady: true });

  var categories = Categories.find({ state: 'ON' }, { sort: { seq: 1 }});

  return categories;
});

/**
 *
 */
Meteor.publish('categoriesList', function(query, options) {
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

  Counts.publish(this, 'categoriesListCount', Categories.find(query),
    { noReady: true });

  var categories = Categories.find(query, options);

  return categories;

});

/**
 *
 */
Meteor.publish('categoryView', function(categoryId) {
  check(categoryId, String);

  var categories = Categories.find({ _id: categoryId });

  return categories;

});
