/**
 * Posts
 *    _id
 *    categoryId          String
 *    title               String 1..100
 *
 *    content
 *      version           "1.0"
 *      texts             Array of String
 *      images            { _id, url, surl }
 *      videos            { _id, url, surl }
 *    draft
 *      title             String 1..100
 *      content
 *        version         "1.0"
 *        texts           Array of String
 *        images          { _id, url, surl }
 *        videos          { _id, url, surl }
 *      savedAt           Date
 *
 *    tags                Array of String
 *    count               { hits, likes, comments }
 *    author              { _id, username, name }
 *    status              { READY, PUBLISHED, UNPUBLISHED }
 *    createdAt           Date
 *    updatedAt           Date
 *    publishedAt         Date
 *
 */
Posts = new Mongo.Collection('posts');

/**
 * PostLogs
 *    _id
 *    action              { CREATED, UPDATED, DELETED }
 *    details             String 1..200
 *    user                { _id, username, name }
 *    createdAt           Date
 *
 */
PostLogs = new Mongo.Collection('postLogs');


Meteor.methods({
  postInsert: function(object) {
    check(object, Match.Where(matchPostInsert));

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(403, "error_access_denied");
    }

    // build insert object
    var category = object.category;
    var user = Meteor.user();
    var author = {
      _id: user._id,
      username: user.username,
      name: user.name
    };
    var now = new Date();

    // insert and return
    try {
      var post = {
        categoryId: category,
        title: object.title,
        content: object.content,
        count: {
          hits: 0,
          likes: 0,
          comments: 0
        },
        author: author,
        status: 'READY',
        createdAt: now,
        updatedAt: now
      };

      post._id = Posts.insert(post);

      var log = {
        postId: post._id,
        action: 'CREATED',
        details: post,
        author: author,
        createdAt: now
      };

      PostLogs.insert(log);

      return post._id;
    } catch (ex) {
      return null;
    }

  },

  postUpdate: function(postId, object) {
    check(postId, String);
    check(object, Match.Where(matchPostUpdate));

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var post = Posts.findOne({ _id: postId });

    if ( post.author._id !== this.userId ) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    // set data
    var now = new Date();
    var data = {
      title: object.title,
      content: object.content,
      updatedAt: now
    };

    // insert into the database
    var updated = Posts.update({ _id: postId },
      { $set: data, $unset: { draft: "" }});

    return updated;

  },

  postSaveDraft: function(postId, object) {
    check(postId, String);
    check(object, Match.Where(matchPostUpdate));

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var post = Posts.findOne({ _id: postId });

    if ( post.author._id !== this.userId ) {
      throw new Meteor.Error(ERROR_CODE_SECURITY, "error_access_denied");
    }

    var data = {
      draft: {
        title: object.title,
        content: object.content,
        savedAt: new Date()
      }
    };

    var updated = Posts.update({ _id: postId }, { $set: data });

    return updated;
  },

  postPublish: function(postId, object) {
    check(postId, String);
    check(object, Match.Where(matchPostPublish));

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(403, "error_access_denied");
    }

    var post = Posts.findOne({ _id: postId });

    if ( post.author._id !== this.userId ) {
      throw new Meteor.Error(403, "error_access_denied");
    }

    // set data
    var now = new Date();
    var data = {
      status: object.status,
      updatedAt: now
    };

    // update the database
    var updated = Posts.update({ _id: postId }, { $set: data });
    return updated;
  },

  postRemove: function(postId) {
    check(postId, String);

    // check permission
    if (! this.userId) {
      throw new Meteor.Error(403, "error_access_denied");
    }

    var post = Posts.findOne({ _id: postId });

    if ( post.author._id !== this.userId ) {
      throw new Meteor.Error(403, "error_access_denied");
    }

    // remove the blog
    var removed = Posts.remove({ _id: postId });
    return removed;
  }
});
