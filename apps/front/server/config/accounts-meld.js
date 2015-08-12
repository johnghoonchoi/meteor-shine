var meldDBCallback = function(src_user_id, dst_user_id){
  console.log('meldDBCallback invoked..');
  //Notes.update({user_id: src_user_id}, {$set: {user_id: dst_user_id}}, {multi: true});
};

var serviceAddedCallback = function(user_id, service_name){
  console.log('serviceAddedCallback invoked..');

  if (service_name === 'facebook'){
    console.log('Facebook just added for user ' + user_id);
    var user = Meteor.users.findOne(user_id);
    var link = user.services[service_name].link;
    if (link)
      Meteor.users.update(user_id, {$set: {"profile.fb_link": link}});
  }
};

AccountsMeld.configure({
  askBeforeMeld: true,
  meldDBCallback: meldDBCallback,
  serviceAddedCallback: serviceAddedCallback
});
