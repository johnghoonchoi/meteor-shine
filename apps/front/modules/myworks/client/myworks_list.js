Template.myworksList.onCreated(function() {
	var instance = this;
  instance.increment = 5;
  instance.loadDefault = 0;
  instance.modeDefault = 'draft';

  instance.state = new ReactiveDict;
  instance.state.set('limit', instance.increment);
  instance.state.set('loaded', instance.loadDefault);

	instance.autorun(function() {
    var limit = instance.state.get('limit');

    if (instance.data.mode.get() === instance.modeDefault) {
      instance.subscribe('postDraftsList', {}, { limit: limit, sort: { createdAt: -1 } },
        function() { instance.state.set('limit', limit) });
    } else {
      instance.subscribe('releasedPostsList', {}, { limit: limit, sort: { createdAt: -1 } },
        function() { instance.state.set('limit', limit) });
    }
  });

  instance.postDrafts = function() {
    return PostDrafts.find({}, {
      limit: instance.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };

  instance.postPublic = function() {
    return Posts.find({}, {
      limit: instance.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };

  instance.myDraftCount = function() {
    return Counts.get('myDraftCount');
  };

  instance.myPublicCount = function() {
    return Counts.get('releasedPostsListCount');
  };

});

Template.myworksList.onDestroyed(function() {
  this.increment = null;
  this.loadDefault = null;
  this.modeDefault = null;
});


Template.myworksList.onRendered(function() {
});

Template.myworksList.helpers({
  myworksList: function() {
    if (Template.instance().data.mode.get() === Template.instance().modeDefault) {
      return Template.instance().postDrafts();
    }
    return Template.instance().postPublic();
  },
  hasMore: function() {
    if (Template.instance().data.mode.get() === Template.instance().modeDefault) {
      return (Template.instance().myDraftCount() > Template.instance().state.get('limit'));
    }
    return (Template.instance().myPublicCount() > Template.instance().state.get('limit'));
  }
});

Template.myworksList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.state.set('limit', instance.state.get('limit') + instance.increment);
  }
});
