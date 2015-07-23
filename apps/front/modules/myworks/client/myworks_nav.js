Template.myworksNav.onCreated(function() {
  var instance = this;

  instance.subscribe('myDraftCount', {});
  instance.subscribe('releasedPostsListCount', {});

  instance.myDraftCount = function() {
    return Counts.get('myDraftCount');
  };
  instance.myPublicCount = function() {
    return Counts.get('releasedPostsListCount');
  };
});

Template.myworksNav.onDestroyed(function() {
});

Template.myworksNav.onRendered(function() {
});

Template.myworksNav.helpers({
  myDraftCount: function() {
    return Template.instance().myDraftCount();
  },
  myPublicCount: function() {
    return Template.instance().myPublicCount();
  }
});

Template.myworksNav.events({
});

