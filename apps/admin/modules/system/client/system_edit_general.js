Template.systemEditGeneral.onCreated(function() {
  Navigations.path.set('systemEdit');

  var instance = this;

  instance.autorun(function() {
    instance.subscribe('systemView', {});
  });

  instance.siteName = function() {
    return Systems.findOne({ _id: 'siteName' });
  };

  instance.logo = function() {
    return Systems.findOne({ _id: 'logo' });
  }
});

Template.systemEditGeneral.onRendered(function() {
  Cloudinary.uploadImagePreset({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey,
      presets: {
        accounts: Meteor.settings.public.cloudinary.presets.accounts,
        blogs: Meteor.settings.public.cloudinary.presets.blogs
      }
    },
    preset: Meteor.settings.public.cloudinary.presets.accounts,
    buttonHTML: '<i class="fa fa-upload"></i>',
    showProgress: true,
    options: { multiple: false }
  }, function(e, data) {

    var attributes = {
      url: data.result.url,
      surl: data.result.secure_url,
      size: data.result.bytes,
      width: data.result.width,
      height: data.result.height,
      ext: data.result.format,
      mime: data.originalFiles[0].type,
      original: data.originalFiles[0].name,
      repoId: data.result.public_id
    };

    Meteor.call('systemLogoUpsert', attributes, function(error) {
      if (error)
        Alerts.notify('error', error.reason);
      else
        Alerts.notify('success', 'text_upload_logo_success');
    });
  });

});

Template.systemEditGeneral.helpers({
  siteName: function() {
    return Template.instance().siteName();
  },

  logo: function() {
    return Template.instance().logo();
  }
});

Template.systemEditGeneral.events({
  'submit #formSystemEditGeneral': function(e, instance) {
    e.preventDefault();

    var objects = [
      {
        _id: 'siteName',
        value: instance.$('#siteName').val().trim()
      }
    ];

    Meteor.call('systemUpsert', objects, function(error) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        Alerts.notify('success', 'text_system_edit_done');
      }
    });
  }
});
