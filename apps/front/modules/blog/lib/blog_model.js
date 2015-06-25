/**
 * Blogs
 *    _id
 *    title               String 1..100
 *    content             String 1..
 *    user                Object  { _id, username, name }
 *    createdAt           Date
 *    updatedAt           Date
 *
 * @type {Mongo.Collection}
 */
Blogs = new Mongo.Collection('blogs');
GroundBlogs = new Ground.Collection(Blogs);


Meteor.methods({

  blogInsert: function(object) {
    check(object, Match.Where(matchBlogInsert));

    // check permission
    if (! this.userId)
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");

    // set input object
    var now = new Date();
    var user = Meteor.user();

    var data = {
      title: object.title,
      content: object.content,
      count: {
        comment: 0
      },
      user: {
        _id: user._id,
        username: user.username,
        name: user.name
      },
      createdAt: now,
      updatedAt: now
    };

    // write to database
    data._id = Blogs.insert(data);

    return data._id;
  },

  blogUpdate: function(blogId, object) {
    check(blogId, String);
    check(object, Match.Where(matchBlogEdit));

    // check permission
    if (! this.userId)
      throw new Meteor.Error(403, "error_access_denied");
    var blog = Blogs.findOne({ _id: blogId });

    if ( blog.user._id != this.userId ) {
      return false;
    }

    // make input object
    var now = new Date();
    var data = {
      title: object.title,
      content: object.content,
      updatedAt: now
    };

    // update the database
    var updated = Blogs.update({ _id: blogId, 'user._id': this.userId }, { $set: data });
    return updated;
  },

  blogRemove: function(blogId) {
    // check permission
    if (! this.userId)
      throw new Meteor.Error(403, "error_access_denied");

    // remove the blog
    var removed = Blogs.remove({ _id: blogId, 'user._id': this.userId });
    return removed;
  }
});
