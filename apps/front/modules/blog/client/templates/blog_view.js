Template.blogOne.onCreated( function () {
  /*
   Session.set('editMode', false);
   Session.set('draftsLimit', 5);
   */

  console.log('blogOne onCreated');
});

Template.blogOne.onDestroyed( function () {
  /*
   delete Session.keys['editMode'];
   delete Session.keys['draftsLimit'];
   */
  console.log('blogOne onDestroyed');
});


Template.blogOne.onRendered( function () {
  var editor = document.getElementById('editor');
  /*
   // Save last cursor position to blurSavedSel (global var)
   // saveSelection() defined at selection_restore.js
   $(editor).on('blur', function () {
   blurSavedSel = saveSelection();
   });

   // Nasty hack to create Default Selection
   // Focus and then Blur to save first selection
   this.autorun( function () {
   if (Session.get('editMode') === true) {
   setTimeout( function () {
   placeCaretAtEnd(editor);
   blurSavedSel = saveSelection();
   $(editor).blur();
   }, 1);
   }
   });
   */
  console.log('blogOne onRendered');
});

Template.blogOne.helpers({
  editable: function () {
    var content = this.content;
    return '<div class="editable" id="editor" contenteditable="false" name="content" data-default="false">'+ content +'</div>';
  },
  title: function () {
    var title = this.title;
    return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="false" data-default="false">' + title + '</h2>';
  },
  ownPost: function () {
    return this.user._id === Meteor.userId();
  },
  editMode: function () {
    return Session.get('editMode') === true;
  },
  author: function() {
    return Meteor.users.findOne(this.user._id);
  },
  likesClass: function() {
    var userId = Meteor.userId();
    if (userId && userId !== this.user._id) {
      if (! _.include(this.likers, userId)) {
        return 'btn btn-default likable';
      }
      return 'btn btn-danger likable'
    }
    return 'disabled'
  },
  likesCount: function() {
    return (this.count && this.count.likes) ? this.count.likes : 0;
  }
});


Template.blogOne.events({
 'submit #formBlogEdit': function(e) {
    e.preventDefault();

    var currentContent = $('[name=content]');
    var finalContent = stripTags(currentContent).parent().html();

    // get inputs
    var blogId = this._id;

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

    var content = this.content;
    var title = this.title;

    $('#editor').empty().append(content);
    $('#newTitle').empty().append(title);

    $('#newTitle').attr('contenteditable', 'false');
    $('#editor').attr('contenteditable', 'false');
  },

  'click #edit': function(){
    Session.set('editMode', true);
    $('#editor').attr('contenteditable', 'true');
    $('#newTitle').attr('contenteditable', 'true');
  },

  'click .likable': function(e) {
    //alert('test');
    e.preventDefault();
    Meteor.call('likeUpdate', this._id, function(error, result) {
      if (error) console.log('error.reason: ', error.reason);
      //console.log('result: ', result);
    });
  },

  'click .disabled': function(e) {
    e.preventDefault();
    var userId = Meteor.userId();
    if (userId) {
      return alert('본인 글에는 Like하실 수 없습니다.');
    }
    alert('로그인이 필요합니다.');
  }



});


// Template.blogOne.onCreated(function() {
//   TempImages.remove({});
// });

// Template.blogOne.onDestroyed(function() {
//   TempImages.remove({});

//   $('.cloudinary-uploader input').off('click');
// });


// Template.blogOne.events({
// 	'submit #formBlogEdit': function(e) {
//     e.preventDefault();

//     // Strip Classes Before Input into DB
//     stripTags = function (el) {
//       var lines = el.children();

//       lines.removeClass('editor-empty');
//       lines.removeClass('is-selected');

//       return lines;
//     };

//     var currentContent = $('[name=content]');
//     var finalContent = stripTags(currentContent).parent().html();

//     // get inputs
//     var blogId = this.blog._id;
//     var object = {
//       title: $(e.target).find('[name=title]').html(),
//       content: finalContent
//       //content: $(e.target).find('[name=content]').html()
//     };

//     // validate inputs
//     var validation = BlogValidator.validateUpdate(object);
//     if (! _.isEmpty(validation.errors())) {
//       showValidationErrors(e, validation.errors());
//       return;
//     }

//     // method call 'blogUpdate'
//     Meteor.call('blogUpdate', blogId, object, function(error, result) {
//       if (error) {
//         Alerts.notify('error', error.reason);
//       } else {
//         if (result !== 1) {
//           alert('update fails');
//         } else {
//           Alerts.notify('success', 'Blog updated successfully.');

//           Session.set('editMode', false);
//           $('#newTitle').attr('contenteditable', 'false');
//           $('#editor').attr('contenteditable', 'false');
//           //Router.go('myBlogsList');
//           /*
//           Alerts.dialog('alert', 'Blog update succeeded', function() {
//             Router.go('myBlogsList');
//           });
//           */
//         }
//       }
//     });

//   },

//   'click #cancelEdit': function(){
//     Session.set('editMode', false);

//     var content = this.blog.content;
//     var title = this.blog.title;

//     $('#editor').empty().append(content);
//     $('#newTitle').empty().append(title);

//     $('#newTitle').attr('contenteditable', 'false');
//     $('#editor').attr('contenteditable', 'false');
//   },

//   'click #edit': function(){
//     Session.set('editMode', true);
//     $('#editor').attr('contenteditable', 'true');
//     $('#newTitle').attr('contenteditable', 'true');
//   }
// });

// Template.blogOne.onRendered(function(){

//   Session.set('editMode', false);

// 	// Define Editor Element
//   var editor = document.getElementById('editor');

//   // Define Title Element
//   var editorTitle = document.getElementById('newTitle');

//   // Initiate Editor
//   inlineEditor.init(editor, editorTitle);

// });

// Template.blogContentToolbar.onRendered(function() {

//   Cloudinary.uploadImagePreset({
//     config: {
//       cloud_name: Meteor.settings.public.cloudinary.cloudName,
//       api_key: Meteor.settings.public.cloudinary.apiKey,
//       presets: {
//         accounts: Meteor.settings.public.cloudinary.presets.accounts,
//         blogs: Meteor.settings.public.cloudinary.presets.blogs
//       }
//     },
//     preset: Meteor.settings.public.cloudinary.presets.blogs,
//     /*
//     config: {
//       cloud_name: Meteor.settings.public.cloudinary.cloudName,
//       api_key: Meteor.settings.public.cloudinary.apiKey
//     },*/
//     buttonHTML: '<i class="fa fa-upload"> 업로드',
//     showProgress: true,
//     options: {
//       multiple: true
//     },
//     addons: {
//       eager: { crop: "crop", x: 200, y: 50, width: 150, height: 150 }
//     }
//   }, function(e, data) {
//     var attributes = {
//       // genreId: instance.data.chapter.genreId,
//       // bookId: instance.data.chapter.bookId,
//       // chapterId: instance.data.chapter._id,
//       url: data.result.url,
//       surl: data.result.secure_url,
//       size: data.result.bytes,
//       width: data.result.width,
//       height: data.result.height,
//       urlFit: data.result.eager[0].url,
//       surlFit: data.result.eager[0].secure_url,
//       widthFit: data.result.eager[0].width,
//       heightFit: data.result.eager[0].height,
//       ext: data.result.format,
//       mime: data.originalFiles[0].type,
//       original: data.originalFiles[0].name,
//       repoId: data.result.public_id
//     };
//     Meteor.call('cImageUploadSave', attributes, function(error, id) {
//       if (error) {
//         //Alerts.error(error.reason);
//         console.log(error.reason)
//       }

//       attributes._id = id;

//       var source = '<p class="image"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></p>';

//       $('#editor p.is-selected').after(source);

//       console.log('upload done');
//     });

//   });
// });
