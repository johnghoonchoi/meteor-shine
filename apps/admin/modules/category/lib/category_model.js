/**
 * Categories
 *    _id
 *    name                String 1..100
 *    seq                 Number
 *    state               ON, OFF
 *    permissions
 *      read
 *      write
 *      admin
 *    createdAt           Date
 *    updatedAt           Date
 */
Categories = new Mongo.Collection('categories');

Categories.before.update(function(userId, doc) {
  doc.updatedAt = new Date();
});

var whiteList = [ 'name', 'seq', 'state' ];
var adminRoles = [ 'ROLE_ADMIN', 'ROLE_CATEGORY_ADMIN' ];

var checkPermissions = function(userId, permissions) {
  var user = Meteor.users.findOne(userId);
  console.log('user: ' + JSON.stringify(user));

  if (Roles.userIsInRole(userId, permittedRoles)) {
    return true;
  }

  if (permissions && permissions.admin) {
    return _.insersection(adminRoles, user.roles) !== null;
  } else {
    return false;
  }
};

Categories.allow({
  update: function(userId, doc, fields, modifier) {
    if (checkPermissions(userId, doc.permissions) &&
        _.difference(fields, whiteList).length === 0) {
      return true;
    } else {
      return false;
    }
  },

  remove: function(userId, doc) {
    return checkPermissions(userId, doc.permissions);
  },

  fetch: ['permissions']
});


Meteor.methods({
  categoryInsert: function(object) {

  },

  categoryUpdate: function(categoryId, object) {

  },

  categoryRemove: function(categoryId) {

  }
});
