Template.signUp.helpers({
  services: function() {
    return getLoginServices();
  },

  isPasswordService: function () {
    return this.name === 'password';
  },

  hasOtherServices: function () {
    return getLoginServices().length > 1;
  },

  hasPasswordService: function() {
    return hasPasswordService();
  }
});
