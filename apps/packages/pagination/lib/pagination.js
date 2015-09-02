PagedSubscription = function(options) {
  // force to be called with `new`
  if (! (this instanceof PagedSubscription)) {
    return new PagedSubscription(options);
  }

  if (! options || ! options.default) {
    options.default = { increment: 10 };
  }

  if (! options || ! options.name) {
    throw new Meteor.Error('subscription name undefined')
  }

  this.name = options.name;
  this.query = options.query || {};
  this.options = options.options || {};
  this.callback = options.callback;

  this.increment = options.default.increment;
  this.limit = new ReactiveVar(options.default.limit || options.default.increment);
  this.sort = new ReactiveVar(options.default.sort);

  this.loadMoreTemplate = options.loadMoreTemplate || Template.paginationLoadMore;
  this.loadingTemplate = options.loadingTemplate || Template.paginationLoading;

  this.subscribe = function(instance) {
    var queryOptions = _.extend(this.options, {
      limit: this.limit.get(), sort: this.sort.get()
    });

    return instance.subscribe(this.name, this.query, queryOptions, this.callback);
  };

  this.hasMore = function() {
    return options.hasMore();
  };

  this.limitInc = function() {
    this.limit.set(this.limit.get() + this.increment);
  };
};
/*
PagedSubscription = function(options) {
  // called without `new`
  if (! (this instanceof PagedSubscription)) {
    return new PagedSubscription(options);
  }

  var _increment = options.increment || 10;
  var _limit = new ReactiveVar(options.limit || _increment);
  var _loaded = new ReactiveVar(0);

  this.getLimit = function() {
    return _limit.get();
  };

  this.setLimit = function(value) {
    _limit.set(value);
  };

  this.incLimit = function() {
    var limit = _limit.get() + _increment;
    _limit.set(limit);
    return limit;
  };

  this.getLoaded = function() {
    return _loaded.get();
  };

  this.setLoaded = function(value) {
    _loaded.set(value);
  };

  this.spinnerTemplate = options.spinnerTemplate;

  this.first = function(name, query, options, callbacks) {
    this.subscription = {
      name: name,
      query: query,
      options: options,
      callbacks: callbacks
    };

    options = _.extend(options, { limit: _limit.get() });

    return Template.instance().subscribe(name, query, options, callbacks);
  };

  this.next = function() {
    _limit.set(_limit.get() + _increment);

    var options = _.extend(this.subscription.options, { limit: _limit.get() });

    return Template.instance().subscribe(
      this.subscription.name,
      this.subscription.query,
      options,
      this.subscription.callbacks
    );
  };
};

*/
