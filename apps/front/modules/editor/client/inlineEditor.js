//Template.inlineEditor.onCreated( function () {
//
//  Session.set('currentDraft', null);
//
//});
//
//Template.inlineEditor.onDestroyed( function () {
//  delete Session.keys['currentDraft'];
//  window.clearInterval(Autosave);
//  window.clearInterval(Autoupdate);
//});
//
//Template.inlineEditor.events({
//  'click #editor a': function (event) {
//    event.preventDefault();
//    // $('.edit-link-wrapper').css('display', 'inline-block');
//    // $('.edit-link').val(event.target);
//  },
//
//  'click .save-edit-link': function (event) {
//
//  }
//
//});
//
//Template.inlineEditor.helpers({
//  editable: function() {
//    return '<div class="editable" contenteditable="true" name="content" id="editor" data-default="true"><p class="is-selected">본문</p></div>';
//  },
//  title: function() {
//    return '<h2 class="newTitle" id="newTitle" name="title" contenteditable="true" data-default="true">제목</h2>';
//  }
//});
//
//Template.inlineEditor.onRendered( function () {
//  var self = this;
//
//  // Define Editor Element
//  var editor = document.getElementById('editor');
//
//  // Define Title Element
//  var editorTitle = document.getElementById('newTitle');
//
//  // Initiate Editor
//  inlineEditor.init(editor, editorTitle);
//
//  // Save last cursor position to blurSavedSel (global var)
//  // saveSelection() defined at selection_restore.js
//  $(editor).on('blur', function () {
//    blurSavedSel = saveSelection();
//  });
//
//  // Nasty hack to create Default Selection
//  // Focus and then Blur to save first selection
//
//  /**
//   * Autosave Feature
//   */
//
//  self.autorun( function () {
//
//
//    $(editor).focus();
//    setTimeout( function () {
//      $(editor).blur();
//    }, 1);
//
//
//    // Draft Auto-Save (First Time)
//    if (Session.get('currentDraft') === null) {
//
//      var editor = $('#editor');
//      var title  = $('#newTitle');
//      Autosave = window.setInterval( function () {
//        if ((editor.data('default') === false) || (title.data('default') === false)) {
//          var object = {
//            title: $('#newTitle').html(),
//            content: $('#editor').html()
//          };
//
//          Meteor.call('draftAutosave', object, function(error, result) {
//            if (error) {
//              console.log(error.reason);
//            } else {
//              console.log('Initial Draft is Saved');
//              window.clearInterval(Autosave);
//              Session.set('currentDraft', result);
//            }
//          });
//        }
//      }, 5000);
//    } else {
//
//      Autoupdate = window.setInterval( function () {
//        console.log('Autoupdate running')
//        var draft = Session.get('currentDraft');
//        var draftContent = Drafts.findOne({_id: draft});
//
//        var title = $('#newTitle').html();
//        var content =  $('#editor').html();
//
//        var object = {
//          title: title,
//          content: content
//        };
//
//        if ((draftContent.content !== content) || (draftContent.title !== title)) {
//          Meteor.call('draftAutoupdate', draft, object, function(error, result) {
//            if (error) {
//              console.log(error.reason);
//            } else {
//              console.log('Draft updated');
//
//              // Session.set('currentDraft', result);
//            }
//          });
//        }
//
//      }, 5000);
//    }
//  });
//
//
//
//  /**
//   * Cloudinary Upload
//   */
//
//  // Cloudinary Upload Here
//});
