Template.myworksNav.onCreated(function() {
  var instance = this;
  instance.subscribe('myDraftCount', {});
  instance.subscribe('myPostsListCount', {});
});
