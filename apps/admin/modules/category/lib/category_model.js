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


var permittedRoles = [ 'ROLE_ADMIN', 'ROLE_CATEGORY_ADMIN' ];

var checkPermissions = function(userId, permissions) {
  var user = Meteor.users.findOne(userId);

  if (Roles.userIsInRole(userId, permittedRoles)) {
    return true;
  }

  if (permissions && permissions.admin) {
    return _.insersection(permittedRoles, user.roles) !== null;
  } else {
    return false;
  }
};


Meteor.methods({
  categoryInsert: function(object) {
    check(object, Match.Where(matchCategoryInsert));

    if (! checkPermissions(this.userId)) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, 'error_access_denied');
    }

    if (this.isSimulation) {
      return;
    }

    var now = new Date();
    var tail = Categories.findOne({}, { sort: { seq: -1 }, limit: 1 });

    object = _.extend(object, {
      seq: tail.seq + 1,
      state: 'OFF',
      createdAt: now,
      updatedAt: now
    });

    object._id = Categories.insert(object);

    return object._id;
  },

  categoryUpdate: function(categoryId, object) {
    check(categoryId, String);
    check(object, Match.Where(matchCategoryUpdate));

    if (! checkPermissions(this.userId)) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, 'error_access_denied');
    }

    object = _.extend(object, {
      updatedAt: new Date()
    });

    return Categories.update({ _id: categoryId }, { $set: object });
  },

  categoryMove: function(categoryId, seq) {
    check(categoryId, String);
    check(seq, Number);

    if (! checkPermissions(this.userId)) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, 'error_access_denied');
    }

    return Categories.update({ _id: categoryId }, { $set: { seq: seq }});
  },

  categoryState: function(categoryId, state) {
    check(categoryId, String);
    check(state, Match.OneOf('ON', 'OFF'));

    if (! checkPermissions(this.userId)) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, 'error_access_denied');
    }

    return Categories.update({ _id: categoryId }, { $set: { state: state }});
  },

  categoryRemove: function(categoryId) {
    check(categoryId, String);

    if (! checkPermissions(this.userId)) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, 'error_access_denied');
    }

    Categories.remove({ _id: categoryId });
  }
});
