Template.blogNew.onCreated( function () {
  Session.set('currentDraft', null);
  Session.set('draftsLimit', 5);
});

Template.blogNew.onDestroyed( function () {
  delete Session.keys['draftsLimit'];
  delete Session.keys['currentDraft'];
});

Template.blogNew.events({
  'submit #formBlog': function(e) {
    e.preventDefault();

    var currentContent = $('[name=content]');
    var finalContent = stripTags(currentContent).parent().html();


    // var finalContent = stripTags(currentContent).html();

    // get inputs
    var object = {
      title: $(e.target).find('[name=title]').html(),
      content: finalContent
      //content: $(e.target).find('[name=content]').html()
    };

    // validate inputs
    /*
    var validation = BlogValidator.validateInsert(object);
    if (! _.isEmpty(validation.errors())) {
      showValidationErrors(e, validation.errors());
      return;
    }
    */

    // method call 'blogInsert'
    Meteor.call('blogInsert', object, function(error, result) {
      if (error) {
        alert(error.reason);
      } else {
        alert('insert success');
        var getDraft = Session.get('currentDraft');
        if (getDraft !== null) {
          Meteor.call('draftRemove', getDraft, function(error, result) {
            if (error) {
              console.log(error.reason);
            } else {
              window.clearInterval(Autoupdate);
              console.log('Draft Removed');
            }
          });
        }
        Router.go('myBlogsList');
      }
    });
  }

});

// Template.blogNew.onRendered( function (){

// Template.blogNew.created = function() {
//   TempImages.remove({});

//   // Reset Draft Session
//   Session.set('currentDraft', null);
// };

// Template.blogNew.destroyed = function() {
//   TempImages.remove({});

//   if (Session.get('currentDraft') !== null) {
//     // Destroy Autoupdate
//     window.clearInterval(Autoupdate);
//   }

//   // Reset Draft Session
//   Session.set('currentDraft', null);

//   $('.cloudinary-uploader input').off('click');
// };

// //--------------------------------------------------------
// //
// //  TEMPLATE CALL BACKS FROM HERE
// //
// //--------------------------------------------------------

// Template.blogNew.helpers({
//   editable: function() {
//     // +Added id="editor"
//     return '<div class="editable" contenteditable="true" name="content" id="editor" data-default="true"><p class="is-selected">본문</p></div>';
//   },
//   title: function() {
//     return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="true" data-default="true">제목</h2>';
//   },
//   draftCount: function () {
//     return Drafts.find({'user._id': Meteor.userId()}).count();
//   }
// });

//   // Define Editor Element
//   var editor = document.getElementById('editor');

//   // Define Title Element
//   var editorTitle = document.getElementById('newTitle');

//   // Initiate Editor
//   inlineEditor.init(editor, editorTitle);

//   // Draft Auto-Save (First Time)
//   this.autorun( function () {
//     if (Session.get('currentDraft') === null) {

//       var editor = $('#editor');
//       var title  = $('#newTitle');
//       Autosave = window.setInterval( function () {
//         if ((editor.data('default') === false) || (title.data('default') === false)) {
//           var object = {
//             title: $('#newTitle').html(),
//             content: $('#editor').html()
//           };

//           Meteor.call('draftAutosave', object, function(error, result) {
//             if (error) {
//               console.log(error.reason);
//             } else {
//               console.log('Initial Draft is Saved');
//               window.clearInterval(Autosave);
//               Session.set('currentDraft', result);
//             }
//           });
//         }
//       }, 5000);
//     }
//   });

//   this.autorun( function () {

//     if (Session.get('currentDraft') != null) {
//       Autoupdate = window.setInterval( function () {

//         var draft = Session.get('currentDraft');
//         var draftContent = Drafts.findOne({_id: draft});

//         var title = $('#newTitle').html();
//         var content =  $('#editor').html();

//         var object = {
//           title: title,
//           content: content
//         };

//         if ((draftContent.content !== content) || (draftContent.title !== title)) {
//           Meteor.call('draftAutoupdate', draft, object, function(error, result) {
//             if (error) {
//               console.log(error.reason);
//             } else {
//               console.log('Draft Autosaved');

//               // Session.set('currentDraft', result);
//             }
//           });
//         }
//       }, 5000);
//     }
//   });

// /*
//   // Cloudinary Upload Image
//   Cloudinary.uploadImagePreset(
//     {
//       cloud_name: Meteor.settings.public.cloudinary.cloudName,
//       preset: Meteor.settings.public.cloudinary.presets.blogs,
//       progress_bar_selecter: '.progress-wrapper'
//     },
//     { multiple: true },
//     function (e, data) {
//       var attributes = {
//         // genreId: instance.data.chapter.genreId,
//         // bookId: instance.data.chapter.bookId,
//         // chapterId: instance.data.chapter._id,
//         url: data.result.url,
//         surl: data.result.secure_url,
//         size: data.result.bytes,
//         width: data.result.width,
//         height: data.result.height,
//         urlFit: data.result.eager[0].url,
//         surlFit: data.result.eager[0].secure_url,
//         widthFit: data.result.eager[0].width,
//         heightFit: data.result.eager[0].height,
//         ext: data.result.format,
//         mime: data.originalFiles[0].type,
//         original: data.originalFiles[0].name,
//         repoId: data.result.public_id
//       };
//     Meteor.call('cImageUploadSave', attributes, function(error, id) {
//         if (error) {
//           //Alerts.error(error.reason);
//           console.log(error.reason)
//         }

//         attributes._id = id;

//         var source = '<p class="image"><img class="img-responsive" src="' + imageUrlFit(attributes) + '" data-id="' + id + '" /></p>';

//         $('#editor p.is-selected').after(source);

//         console.log('upload done');
//       });
//     }
//   );
// */


//  // Draft Auto-Update
//   /*
//    this.autorun( function () {
//     console.log('this.autorun in editor is running');
//     if (Session.get('currentDraft') != null) {
//       Autosave = window.setInterval( function () {
//         console.log('Autosave is running now');
//         var draft = Session.get('currentDraft');
//         var draftContent = Drafts.findOne({_id: draft});
//         var content =  $('#editor-content').val();

//         if (draftContent.content !== content) {
//           console.log('content has been changed');
//           Drafts.update(draft, {$set: { content: content}}, function (error) {
//             if (error) {
//               console.log(error.reason);
//             } else {
//               console.log('updated draft');
//             }
//           });
//         }
//       }, 5000);
//     }
//   });
//   */

// });
