Template.myworksNav.onCreated(function() {
  var instance = this;
  var parentData = Template.parentData(1);

  instance.subscribe('myDraftCount', {});
  instance.subscribe('myPostsListCount', {});
});
