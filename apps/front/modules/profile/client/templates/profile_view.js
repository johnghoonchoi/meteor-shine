Template.profileView.onCreated(function() {
  var instance = this;
  instance._profilePictureView = Blaze.render(Template.profilePicture, document.body);

  // modules/0/lib/router.js 에서 Meteor.subscribe('profileView')을
  // 라우터 컨피그의 waitOn 에서드에 작성해서
  // Template.subscriptionsReady를 사용하지 못하는것 같음
  instance.subReady = Meteor.subscribe('userRegisteredServices');
  instance.isReady = function() {
    return instance.subReady.ready();
  }

  instance.user = function() {
    return Meteor.users.findOne(Meteor.userId, {fields: {services: 1}});
  }

});

Template.profileView.onDestroyed(function() {
  if (this._profilePictureView) {
    Blaze.remove(this._profilePictureView);
    this._profilePictureView = null;
  }
});


Template.profileView.onRendered(function() {
  var instance = this;
  instance.autorun(function() {
    console.log('ready? ', instance.isReady());
  });


});

/**
 * Display user information
 *    - picture
 *    - profile
 */

var TEMPLATE_PROFILE = 'templateProfile';

Template.profileView.helpers({
  templateProfile: function() {
    return Session.get(TEMPLATE_PROFILE) || 'profileEditNormal';
  },

  isReady: function() {
    return Template.instance().isReady();
  },

  canFbConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.facebook) return '';
    return true
  },

  canGoogleConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.google) return '';
    return true
  },

  canMeetupConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.meetup) return '';
    return true
  },

  canNaverConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.naver) return '';
    return true
  },

  canKakaoConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.kakao) return '';
    return true
  },

  canTwitterConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.twitter) return '';
    return true
  },

  canGithubConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services.github) return '';
    return true
  },

  canMeteorConnect: function() {
    var user = Template.instance().user();
    if (user && user.services && user.services['meteor-developer']) return '';
    return true
  }
});

Template.profileView.events({

  "click #editPicture, click .view-avatar img, click .avatar-initials": function(e) {
    e.preventDefault();
    $('#avatarModal').modal('show');
    //var cropInstance = new CropAvatar();
    //cropInstance.init();
    //cropInstance.click();
  },

  'click #changePassword': function(e) {
    e.preventDefault();

    Accounts.ui.dialog.show('changePassword');
  },

  'click #editProfile': function() {
    var template = Session.get(TEMPLATE_PROFILE);
    if (template === 'profileEditForm')
      Session.set(TEMPLATE_PROFILE, 'profileEditNormal');
    else
      Session.set(TEMPLATE_PROFILE, 'profileEditForm');
  },

  'click [data-action=connect-fb]': function() {
    loginOtherServices('facebook');
  },

  'click [data-action=disconnect-fb]': function() {
    Meteor.call('removeOAuthService', 'facebook', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);

    });
  },


  'click [data-action=connect-google]': function() {
    loginOtherServices('google');
  },

  'click [data-action=disconnect-google]': function() {
    Meteor.call('removeOAuthService', 'google', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  },


  'click [data-action=connect-meetup]': function() {
    loginOtherServices('meetup');
  },

  'click [data-action=disconnect-meetup]': function() {
    Meteor.call('removeOAuthService', 'meetup', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  },


  'click [data-action=connect-naver]': function() {
    loginOtherServices('naver');
  },

  'click [data-action=disconnect-naver]': function() {
    Meteor.call('removeOAuthService', 'naver', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  },


  'click [data-action=connect-kakao]': function() {
    loginOtherServices('kakao');
  },

  'click [data-action=disconnect-kakao]': function() {
    Meteor.call('removeOAuthService', 'kakao', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  },


  'click [data-action=connect-twitter]': function() {
    loginOtherServices('twitter');
  },

  'click [data-action=disconnect-twitter]': function() {
    Meteor.call('removeOAuthService', 'twitter', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  },


  'click [data-action=connect-github]': function() {
    loginOtherServices('github');
  },

  'click [data-action=disconnect-github]': function() {
    Meteor.call('removeOAuthService', 'github', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  },


  'click [data-action=connect-meteor]': function() {
    loginOtherServices('meteor-developer');
  },

  'click [data-action=disconnect-meteor]': function() {
    Meteor.call('removeOAuthService', 'meteor', function(err, result) {
      if (err) console.log('err.reason: ', err.reason);
    });
  }
});


