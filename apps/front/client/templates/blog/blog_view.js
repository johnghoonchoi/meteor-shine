Template.blogOne.onCreated(function() {
  TempImages.remove({});
});

Template.blogOne.onDestroyed(function() {
  TempImages.remove({});

  $('.cloudinary-uploader input').off('click');
});

Template.blogOne.helpers({
	editable: function() {
	var content = this.blog.content;
	return '<div class="editable" id="editor" contenteditable="false" name="content" data-default="false">'+ content +'</div>';
	},
	title: function() {
	var title = this.blog.title;
	return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="false" data-default="false">' + title + '</h2>';
	},
	ownPost: function() {
	return this.blog.user._id === Meteor.userId();
	},
  editMode: function() {
    return Session.get('editMode') == true;
  }
});

Template.blogOne.events({
	'submit #formBlogEdit': function(e) {
    e.preventDefault();

    // Strip Classes Before Input into DB
    stripTags = function (el) {
      var lines = el.children();

      lines.removeClass('editor-empty');
      lines.removeClass('is-selected');

      return lines;
    };

    var currentContent = $('[name=content]');
    var finalContent = stripTags(currentContent).parent().html();

    // get inputs
    var blogId = this.blog._id;
    var object = {
      title: $(e.target).find('[name=title]').html(),
      content: finalContent
      //content: $(e.target).find('[name=content]').html()
    };

    // validate inputs
    var validation = BlogValidator.validateUpdate(object);
    if (! _.isEmpty(validation.errors())) {
      showValidationErrors(e, validation.errors());
      return;
    }

    // method call 'blogUpdate'
    Meteor.call('blogUpdate', blogId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.reason);
      } else {
        if (result !== 1) {
          alert('update fails');
        } else {
          Alerts.notify('success', 'Blog updated successfully.');

          Session.set('editMode', false);
          $('#newTitle').attr('contenteditable', 'false');
          $('#editor').attr('contenteditable', 'false');
          //Router.go('myBlogsList');
          /*
          Alerts.dialog('alert', 'Blog update succeeded', function() {
            Router.go('myBlogsList');
          });
          */
        }
      }
    });

  },

  'click #cancelEdit': function(){
    Session.set('editMode', false);

    var content = this.blog.content;
    var title = this.blog.title;

    $('#editor').empty().append(content);
    $('#newTitle').empty().append(title);

    $('#newTitle').attr('contenteditable', 'false');
    $('#editor').attr('contenteditable', 'false');
  },

  'click #edit': function(){
    Session.set('editMode', true);
    $('#editor').attr('contenteditable', 'true');
    $('#newTitle').attr('contenteditable', 'true');
  }
});

Template.blogOne.onRendered(function(){

  Session.set('editMode', false);

	// Define Editor Element
  var editor = document.getElementById('editor');

  // Define Title Element
  var editorTitle = document.getElementById('newTitle');

  // Initiate Editor
  inlineEditor.init(editor, editorTitle);


  Cloudinary.uploadImagePreset({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
        api_key: Meteor.settings.public.cloudinary.apiKey,
        presets: {
        accounts: Meteor.settings.public.cloudinary.presets.accounts,
          blogs: Meteor.settings.public.cloudinary.presets.blogs
      }
    },
    preset: Meteor.settings.public.cloudinary.presets.blogs,
/*
  Cloudinary.uploadImage({
    config: {
      cloud_name: Meteor.settings.public.cloudinary.cloudName,
      api_key: Meteor.settings.public.cloudinary.apiKey
    },
*/
    buttonHTML: '<i class="fa fa-upload"> 업로드',
    showProgress: true,
    options: {
      multiple: true
    },
    addons: {
      eager: { crop: "crop", x: 200, y: 50, width: 150, height: 150 }
    }
  }, function(e, data) {
    var attributes = {
      // genreId: instance.data.chapter.genreId,
      // bookId: instance.data.chapter.bookId,
      // chapterId: instance.data.chapter._id,
      url: data.result.url,
      surl: data.result.secure_url,
      size: data.result.bytes,
      width: data.result.width,
      height: data.result.height,
      urlFit: data.result.eager[0].url,
      surlFit: data.result.eager[0].secure_url,
      widthFit: data.result.eager[0].width,
      heightFit: data.result.eager[0].height,
      ext: data.result.format,
      mime: data.originalFiles[0].type,
      original: data.originalFiles[0].name,
      repoId: data.result.public_id
    };
    Meteor.call('cImageUploadSave', attributes, function(error, id) {
      if (error) {
        //Alerts.error(error.reason);
        console.log(error.reason)
      }

      attributes._id = id;

      var source = '<p class="image"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></p>';

      $('#editor .is-selected').after(source);

      console.log('upload done');
    });

  });

});
