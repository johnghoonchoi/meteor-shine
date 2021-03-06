/**
 * Server startup
 */
Meteor.startup(function() {

  process.env.HTTP_FORWARDED_COUNT = 1;

  Connection.collection.remove({});

  var now = new Date();

  if (Meteor.users.find().count() === 0) {
    var users = [
      {
        username: 'admin',
        email: 'leesn@bookp.al',
        password: '74123',
        roles: [ 'ROLE_ADMIN' ]
      },

      {
        username: 'test',
        email: 'test@bookp.al',
        password: '74123'
      }
    ];

    users.forEach(function(user) {
      user._id = Accounts.createUser({
        username: user.username,
        email: user.email,
        password: user.password
      });

      if (user.roles && user.roles.length > 0) {
        Roles.addUsersToRoles(user._id, user.roles);
      }
    });
  }

  if (Categories.find().count() === 0) {
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
      Categories.insert(category);
    });
  }
});
