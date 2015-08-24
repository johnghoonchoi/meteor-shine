var meldUserCallback = function(srcUser, dstUser){
  // create a melded user object here and return it
  var meldedUser = _.clone(dstUser);

  // 'createdAt' field: keep the oldest between the two
  if (srcUser.createdAt < dstUser.createdAt)
    meldedUser.createdAt = srcUser.createdAt;

  if (!dstUser.username && srcUser.username)
    meldedUser.username = srcUser.username;

  dstUser.profile = dstUser.profile || {};
  meldedUser.profile = _.extend(dstUser.profile, srcUser.profile || {});
  dstUser.oauths = dstUser.oauths || {};
  meldedUser.oauths = _.extend(dstUser.oauths, srcUser.oauths || {});

  return meldedUser;
};

var meldDBCallback = function(src_user_id, dst_user_id){
  // Here you can modify every collection you need for the document referencing
  // to src_user_id to be modified in order to point to dst_user_id

  // Todo : refactoring here
  Posts.update(
    {'author._id': src_user_id},
    {$set: {'author._id': dst_user_id}},
    {multi: true}
  );
  PostsComments.update(
    {'user._id': src_user_id},
    {$set: {'user._id': dst_user_id}},
    {multi: true}
  );
};


var serviceAddedCallback = function(userId, serviceName){
    var user = Meteor.users.findOne(userId);
    var set = {};
    var picture;

    if (user) {
      var serviceData = user.services[serviceName];
      var name = serviceData.name;

      if (serviceName === 'facebook') {
        var serviceId = user.services[serviceName].id;
        picture = "http://graph.facebook.com/"+ serviceId +"/picture?type=square&height=160&width=160";
      }

      if (serviceName === 'google')
        picture = serviceData.picture;

      if (serviceName === 'twitter')
        picture = serviceData.profile_image_url_https;

      set["oauths." + serviceName + ".name"] = name || '';
      set["oauths." + serviceName + ".picture"] = picture || '';

      Meteor.users.update(userId, {$set: set});

      console.log('External service just added for user');
    }
};

AccountsMeld.configure({
  askBeforeMeld: true,
  meldUserCallback: meldUserCallback,
  meldDBCallback: meldDBCallback,
  serviceAddedCallback: serviceAddedCallback
});
