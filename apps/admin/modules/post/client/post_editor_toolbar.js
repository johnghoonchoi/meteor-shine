Template.postEditorToolbar.onRendered(function() {

  Cloudinary.uploadImagePreset(
    {
      config: {
        cloud_name: Meteor.settings.public.cloudinary.cloudName,
        api_key: Meteor.settings.public.cloudinary.apiKey,
        presets: {
          accounts: Meteor.settings.public.cloudinary.presets.accounts,
          preset: Meteor.settings.public.cloudinary.presets.posts,
          blogs: Meteor.settings.public.cloudinary.presets.blogs
        }
      },
      preset: Meteor.settings.public.cloudinary.presets.posts,
      buttonHTML: '<i class="fa fa-upload">',
      showProgress: true,
      options: {
        multiple: true
      }
    },
    function(e, data) {
      var object = {
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

      Meteor.call('postImageInsert', object, function(error, imageId) {
        if (error) {
          console.log('error reason: ', error.reason);
          return;
        }

        var source = '<p class="image"><img src="' + object.url + '" data-id="' + imageId + '" /></p>';
        //$('#content p.active').after(source);
        $('#content').append(source);

        console.log(imageId);
      });
    }
  );

});
