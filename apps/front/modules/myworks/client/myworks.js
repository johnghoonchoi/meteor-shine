Template.myWorksDrafts.onCreated(function() {
  var instance = this;

  instance.increment = 50;

  instance.data = Template.currentData();
  instance.data.state = new ReactiveDict;
  instance.data.state.set('limit', instance.increment);
  instance.data.state.set('loaded', 0);

  instance.autorun(function() {
    var limit = instance.data.state.get('limit');
    instance.subscribe('postDraftsList', {}, { limit: limit, sort: { createdAt: -1 } },
      function() { instance.data.state.set('limit', limit) });

    Navigations.path.set('myWorksDrafts');
  });

  instance.data.postDrafts = function() {
    return PostDrafts.find({}, {
      limit: instance.data.state.get('loaded'),
      sort: {createdAt: -1}
    });
  };

  instance.data.draftCount = function() {
    return Counts.get('postDraftsListCount');
  }

});

Template.myWorksDrafts.onRendered(function() {
  console.dir(this.data);
  console.dir(this.data.state);

});
