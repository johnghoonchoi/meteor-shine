Template.pagination.helpers({
  ready: function() {
    var handle = Template.instance().handle;
    return (handle) ? handle.ready() : true;
  },

  hasMore: function() {
    return this.hasMore();
  }/*,

  loading: function() {
    return this.loadingTemplate;
  },

  spinner: function() {
    return this.spinnerTemplate;
  },

  labelLoadMore: function() {
    return "load more";
  }*/
});

Template.pagination.events({
  'click #load-more': function(e, instance) {
    e.preventDefault();

    var data = Template.currentData();

    data.limitInc();
    instance.handle = data.subscribe(instance);
  }
});
