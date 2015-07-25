Template.myworksList.onCreated(function() {
  var instance = this;
  instance.increment = 2;
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
      instance.subscribe('myPostsList', { limit: limit, sort: { createdAt: -1 } },
        function() { instance.state.set('limit', limit) });
    }
  });

  instance.myDraftCursor = function() {
    return PostDrafts.find({}, {
      limit: instance.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };
  instance.myPostCursor = function() {
    return Posts.find({}, {
      limit: instance.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };
});

Template.myworksList.onDestroyed(function() {
  BothLog.log('myworksList temp destroyed..');
  this.increment = null;
  this.loadDefault = null;
  this.modeDefault = null;
});

Template.myworksList.onRendered(function() {
});

Template.myworksList.helpers({
  myworksList: function() {
    var instance= Template.instance();
    if (instance.data.mode.get() === instance.modeDefault) {
      return instance.myDraftCursor();
    }
    return instance.myPostCursor();
  },
  hasMore: function() {
    var instance= Template.instance();
    if (instance.data.mode.get() === instance.modeDefault) {
      return (Counts.get('myDraftCount') > instance.state.get('limit'));
    }
    return (Counts.get('myPostsListCount') > instance.state.get('limit'));
  },

  switchMode: function() {
    var instance= Template.instance();
    return instance.data.mode.get() === instance.modeDefault;
  }
});

Template.myworksList.events({
  'click .load-more': function(e, instance) {
    e.preventDefault();
    instance.state.set('limit', instance.state.get('limit') + instance.increment);
  }
});

Template.myworksDraft.onCreated(function() {
  this.parent = Template.parentData(1);
});
Template.myworksDraft.helpers({
  mode: function() {
    return Template.instance().parent.mode.get();
  }
});
