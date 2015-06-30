/**
 * Server startup
 */
Meteor.startup(function() {

  if (Preference.find().count() === 0) {
    Preference.insert({
      _id: 'theme', value: 'classic'
    });
  }

  if (PostCategories.find().count() === 0) {
    var now = new Date();
    var categories = [
      {
        _id: 'news',
        title: 'News & Information',
        seq: 1,
        state: 'ON',
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'lectures',
        title: 'Lectures',
        seq: 2,
        state: 'ON',
        createdAt: now,
        updatedAt: now
      },
      {
        _id: 'techtips',
        title: 'Tech-tips',
        seq: 3,
        state: 'ON',
        createdAt: now,
        updatedAt: now
      }
    ];

    categories.forEach(function(category) {
      PostCategories.insert(category);
    });
  }
});
