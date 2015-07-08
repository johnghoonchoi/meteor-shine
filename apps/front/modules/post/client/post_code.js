Template.postCode.onCreated(function() {
  var instance = this;
  instance.code = new ReactiveVar('');
  instance.lang = new ReactiveVar('javascript');

});

Template.postCode.onDestroyed(function() {
  this.code = null;
  this.lang = null;
});

Template.postCode.onRendered(function() {
  if($('[data-language]')){
    $('[data-language]').removeClass('active');
    $('[data-language]:first').addClass('active');
    $('.code-preview').remove();
  }
});

Template.postCode.helpers({
  codeInsert: function() {
    return Template.instance().code.get();
  },
  lang: function() {
    return Template.instance().lang.get();
  }
});

Template.postCode.events({
  'keyup .code-area': function(event, instance) {
    instance.code.set(event.target.value);
  },

  'click [data-language]': function(event) {
    var $target = $(event.target);
    $('[data-language]').removeClass('active');
    $target.addClass('active');
    $('.code-area').focus();
    console.log('text: ', $('.code-area').val());

    if($('.code-area').val() !== '') {
      Template.instance().lang.set($target.attr('data-language'));
    }

  },

  'click #saveBtn': function(event, instance) {
    event.preventDefault();
    var $preview = $('.code-preview');
    $preview.attr('contenteditable', false);
    $preview.clone().appendTo('#content');
    $('.code-area').val("");
    $preview.remove();

    $('#codeModal').modal('hide');
  },

  'click [data-original-title=RESET]': function() {
    var name = $('.btn-group').find('.active').attr('data-language');
    Template.instance().lang.set(name);
    $('.code-area').val("");
    $('.code-preview').remove();
    $('.code-area').focus();
  }
});
