/**
 * PostComments
 *    _id
 *    postId              String
 *    message             String 1..500
 *    author              { _id, username, name }
 *    createdAt           Date
 *    updatedAt           Date
 *
 */
PostComments = new Mongo.Collection('postComments');

Meteor.methods({
  postCommentInsert: function() {

  },

  postCommentUpdate: function() {

  },

  postCommentRemove: function() {

  }
});
