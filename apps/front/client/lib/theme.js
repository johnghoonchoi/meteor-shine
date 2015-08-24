
Theme = {
  _name: new ReactiveVar(DEFAULT_THEME),

  get: function() {
    return this._name.get();
  },

  set: function(name) {
    this._name.set(name);
  }
};
