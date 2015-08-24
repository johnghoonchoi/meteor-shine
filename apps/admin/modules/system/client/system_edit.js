Template.systemEdit.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView', {});
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  };

  instance.facebookLogin = function() {
    return Systems.findOne({ _id: 'facebookLogin' });
  };

  instance.meetupLogin = function() {
    return Systems.findOne({ _id: 'meetupLogin' });
  };

  instance.googleLogin = function() {
    return Systems.findOne({ _id: 'googleLogin' });
  };

  instance.githubLogin = function() {
    return Systems.findOne({ _id: 'githubLogin' });
  };

  instance.twitterLogin = function() {
    return Systems.findOne({ _id: 'twitterLogin' });
  };

  instance.meteorLogin = function() {
    return Systems.findOne({ _id: 'meteorLogin' });
  };

  instance.naverLogin = function() {
    return Systems.findOne({ _id: 'naverLogin' });
  };

  instance.kakaoLogin = function() {
    return Systems.findOne({ _id: 'kakaoLogin' });
  };
});

Template.systemEdit.helpers({
  siteName: function() {
    return Template.instance().siteName();
  },

  facebookLogin: function() {
    return Template.instance().facebookLogin();
  },

  meetupLogin: function() {
    return Template.instance().meetupLogin();
  },

  googleLogin: function() {
    return Template.instance().googleLogin();
  },

  githubLogin: function() {
    return Template.instance().githubLogin();
  },

  twitterLogin: function() {
    return Template.instance().twitterLogin();
  },

  meteorLogin: function() {
    return Template.instance().meteorLogin();
  },

  naverLogin: function() {
    return Template.instance().naverLogin();
  },

  kakaoLogin: function() {
    return Template.instance().kakaoLogin();
  }
});

Template.systemEdit.events({
  'submit #formSystemEdit': function(e, instance) {
    e.preventDefault();

    var objects = [
      {
        _id: 'siteName',
        value: instance.$('#siteName').val().trim()
      },
      {
        _id: 'facebookLogin',
        appId: instance.$('#facebook-id').val().trim(),
        secret: instance.$('#facebook-secret').val().trim()
      },
      {
        _id: 'meetupLogin',
        clientId: instance.$('#meetup-id').val().trim(),
        secret: instance.$('#meetup-secret').val().trim(),
        apiKey: instance.$('#meetup-api-key').val().trim()
      },
      {
        _id: 'googleLogin',
        clientId: instance.$('#google-id').val().trim(),
        secret: instance.$('#google-secret').val().trim()
      },
      {
        _id: 'githubLogin',
        clientId: instance.$('#github-id').val().trim(),
        secret: instance.$('#github-secret').val().trim()
      },
      {
        _id: 'twitterLogin',
        consumerKey: instance.$('#twitter-id').val().trim(),
        secret: instance.$('#twitter-secret').val().trim()
      },
      {
        _id: 'meteorLogin',
        clientId: instance.$('#meteor-id').val().trim(),
        secret: instance.$('#meteor-secret').val().trim()
      },
      {
        _id: 'naverLogin',
        clientId: instance.$('#naver-id').val().trim(),
        secret: instance.$('#naver-secret').val().trim()
      },
      {
        _id: 'kakaoLogin',
        clientId: instance.$('#kakao-id').val().trim()
      }
    ];


    Meteor.call('systemUpsert', objects, function(error) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_system_edit_done');
      }
    });
  }
});
