Template.pagination.helpers({
  ready: function() {
    var handle = Template.instance().handle;
    return (handle) ? handle.ready() : true;
  },

  spinner: function() {
    return this.spinnerTemplate;
  },

  hasMore: function() {
    return (this.getLimit() === this.getLoaded());
  },

  spinner: function() {
    return this.spinnerTemplate;
  },

  labelLoadMore: function() {
    return "load more";
  }
});

Template.pagination.events({
  'click #load-more': function(e, instance) {
    e.preventDefault();

    var data = Template.currentData();

    instance.handle = data.next();
  }
});
