var meldDBCallback = function(src_user_id, dst_user_id){
  console.log('meldDBCallback invoked..');

  Posts.update({user_id: src_user_id}, {$set: {"author._id": dst_user_id}}, {multi: true});
  PostComments.update({user_id: src_user_id}, {$set: {"user._id": dst_user_id}}, {multi: true});

  var user = Meteor.users.findOne(dst_user_id);

  if (user.services.facebook && ! user.oauths){
    var name = user.services.facebook.name;
    var fbId = user.services.facebook.id;
    var picture = "http://graph.facebook.com/" + id + "/picture?type=square&height=160&width=160";
    if (name)
      Meteor.users.update(dst_user_id, { $set: {"oauths.facebook.name": name} });
    if (picture)
      Meteor.users.update(dst_user_id, { $set: {"oauths.facebook.picture": picture} })
  }

  if (user.services.meetup) {
    var meetupId = user.services.meetup.id;
    var apiKey = Meteor.settings.meetup.apiKey;
    var requestUrl = 'https://api.meetup.com/2/member/' + meetupId
      + '?key=' + apiKey + '&signed=true&fields=other_services';
    var response = HTTP.get(requestUrl, {
      params: {
        format: 'json'
      }
    });

    var userData = response.data;
    var picture;
    if(userData.hasOwnProperty("photo") && userData.photo.photo_link !== "")
      picture = userData.photo.photo_link;

    if (userData.name)
      Meteor.users.update(dst_user_id, { $set: {"oauths.meetup.name": name} });
    if (picture)
      Meteor.users.update(dst_user_id, { $set: {"oauths.meetup.picture": picture} })
  }

  // todo: 3rd parth services로 password service를 통합할 경우 username이 날라감
  // todo: Meetup으로 로그인한 경우 인증된 email 프로퍼티값이 없으므로 이메일 입력을 받게해야하나..?
};

//var serviceAddedCallback = function(user_id, service_name){
  //console.log('serviceAddedCallback invoked..');
  //if (service_name === 'facebook'){
  //  console.log('Facebook just added for user ' + user_id);
  //  var user = Meteor.users.findOne(user_id);
  //  var link = user.services[service_name].link;
  //  if (link)
  //    Meteor.users.update(user_id, {$set: {"profile.fb_link": link}});
  //}
//};

AccountsMeld.configure({
  askBeforeMeld: true,
  meldDBCallback: meldDBCallback
  //serviceAddedCallback: serviceAddedCallback
});
