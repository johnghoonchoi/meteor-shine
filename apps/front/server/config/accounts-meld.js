var meldDBCallback = function(src_user, dst_user_id){
  console.log('meldDBCallback invoked..');

  if (src_user.username)
    Meteor.users.update(dst_user_id, { $set: {"username": src_user.username} });

  var user = Meteor.users.findOne(dst_user_id);

  if (user.services.facebook){
    var fbId = user.services.facebook.id;
    var picture = "http://graph.facebook.com/" + fbId + "/picture?type=square&height=160&width=160";
    var name = user.services.facebook.name;

    Meteor.users.update(dst_user_id, { $set: {"oauths.facebook.picture": picture} });

    if (name)
      Meteor.users.update(dst_user_id, { $set: {"oauths.facebook.name": name} });
  }

  if (user.services.meetup) {
    if (user.services.meetup.name) {
      var name = user.services.meetup.name;
      Meteor.users.update(dst_user_id, { $set: {"oauths.meetup.name": name} });
    }

    if(user.services.meetup.photo && user.services.meetup.photo.photo_link !== "") {
      var picture = userData.photo.photo_link;
      Meteor.users.update(dst_user_id, { $set: {"oauths.meetup.picture": picture} })
    }
  }

  // _id update
  Posts.update({user_id: src_user._id}, {$set: {"author._id": dst_user_id}}, {multi: true});
  PostComments.update({user_id: src_user._id}, {$set: {"user._id": dst_user_id}}, {multi: true});


  // todo: 3rd parth services로 password service를 통합할 경우 username이 날라감
  // todo: Meetup으로 로그인한 경우 인증된 email 프로퍼티값이 없으므로 이메일 입력을 받게해야하나..?
};

var serviceAddedCallback = function(user_id, service_name){
  if (service_name === 'facebook'){
    console.log('Facebook just added for user ' + user_id);
  }
  if (service_name === 'meetup'){
    console.log('meetup just added for user ' + user_id);
  }
};

AccountsMeld.configure({
  askBeforeMeld: true,
  meldDBCallback: meldDBCallback
  //serviceAddedCallback: serviceAddedCallback
});
