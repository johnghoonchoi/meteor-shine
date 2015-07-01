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
//GroundBlogs = new Ground.Collection(Blogs);

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
        comment: 0,
        hits: 0,
        likes: 0
      },
      user: {
        _id: user._id,
        username: user.username,
        name: user.name
      },
      hitters: [],
      likers: [],
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
  },

  hitUpdate: function(blogId) {
    check(blogId, String);

    // 로그인된 유저가 없으면 리턴
    if (! this.userId) return false;

    var blog = Blogs.findOne({ _id: blogId });
    if (!blog)
      throw new Meteor.Error(422, 'Post not found');

    // 포스트 저자가 본인이 글을 조회한 경우 리턴
    if (blog.user._id === this.userId) {
      return false;
    }

    // 이미 글을 조회한 유저라면 리턴
    if (_.include(blog.hitters, this.userId)) return false;

    var updated = Blogs.update(blog._id, {
      $addToSet: {hitters: this.userId},
      $inc: {"count.hits": 1}
    });

    return updated;
  },

  likeUpdate: function(blogId) {
    check(blogId, String);

    // 로그인된 유저가 없으면 리턴
    if (! this.userId) return;

    var blog = Blogs.findOne({ _id: blogId });
    if (! blog)
      throw new Meteor.Error(422, 'Post not found');

    // 본인의 글에 Like 버튼 클릭하는 경우 리턴
    if (blog.user._id === this.userId) {
      return;
    }

    if (_.include(blog.likers, this.userId)) {
      // Todo : 이 부분부터 시작해야함
      var updated = Blogs.update(
        { 'likers': this.userId },
        { '$pull': { 'likers': this.userId }, '$inc': { "count.likes": -1} }
      );
      console.log('likes decreased: ', updated);


      //if (deleted) {
      //  var dec = Blogs.update(blog._id,
      //    { $inc: { "count.likes": -1}}
      //  );
      //}
      //var updated = dec;

    } else {
      var updated = Blogs.update(blog._id, {
        $addToSet: { likers: this.userId },
        $inc: { "count.likes": 1 }
      });

      console.log('likes increased: ', updated);
    }

    return updated;
    //Blogs.update({
    //  _id: blog._id,
    //  upvoters: {$ne: this.userId}
    //}, {
    //  $addToSet: {likers: this.userId},
    //  $inc: {"count.likes": 1}
    //});
  }
});
