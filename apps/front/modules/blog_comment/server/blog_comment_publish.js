//Meteor.publish('blogCommentsListCount', function(query) {
//  console.log('query = ' + JSON.stringify(query));
//
//  Counts.publish(this, 'blogCommentsCount', BlogComments.find(query),
//    { noReady: true });
//
//  console.log('blogCommentsListCount publish done...');
//});
//
//
//Meteor.publish('blogCommentsList', function(query, options) {
//  console.log('query = ' + JSON.stringify(query));
//  console.log('options = ' + JSON.stringify(options));
//
//  var res = BlogComments.find(query, options);
//
//  console.log('blogCommentsList publish: ' + res.count());
//
//  return res;
//});


Meteor.publishComposite('blogCommentsList', function(query, options) {
  console.log('query = ' + JSON.stringify(query));
  console.log('options = ' + JSON.stringify(options));

  Counts.publish(this, 'blogCommentsCount', BlogComments.find(query),
  { noReady: true });

  var res = {
    find: function() {
      return BlogComments.find(query, options);
    },
    children: [
      {
        find: function(blogComment) {
          return Meteor.users.find(
            { _id: blogComment.user._id },
            { fields: { username: 1, profile: 1 } });
        }
      }
    ]
  };
  //console.log('blogCommentsList publish: ' + res.find().count());
  return res;
});

