Template.postNew.onCreated(function() {
  var instance = this;

  instance.autoSave = new Autosave();
  instance.draftId = null;

  instance.autorun(function() {
    instance.subscribe('postCategoriesList',
      { state: 'ON' }, { sort: { seq: 1 }});
  });

  instance.categoriesCount = function() {
    return Counts.get('categoriesListCount');
  };

  instance.categories = function() {
    return Categories.find({ state: 'ON' }, { sort: { seq: 1 }});
  };

  this._postCodeView = Blaze.render(Template.postCode, document.body);
});

Template.postNew.onDestroyed(function() {
  this.autoSave = null;
  this.draftId = null;
  this.categoriesCount = null;
  this.categories = null;
  if (this._postCodeView) {
    console.log('Destroyed post code view');

    Blaze.remove(this._postCodeView);
    this._postCodeView = null;
  }
});

Template.postNew.onRendered(function() {
  this.$('#content').wysiwyg();

  //this.$('#content').focus();

  //$('#codeModal').on('hide.bs.modal', function() {
  //  $('#content').prop('contenteditable', true);
  //});

  //$('#content').on("paste", function() {
  //  var selection = rangy.getSelection();
  //  var range = selection.getRangeAt(0);
  //  console.log('range.endContainer.wholeText: ', range.endContainer.wholeText);
  //});

  // Set clipboard event listeners on the document.
  //['cut', 'copy', 'paste'].forEach(function(event) {
  //  document.addEventListener(event, function(e) {
  //    //console.log(event);
  //    if (isIe) {
  //      ieClipboardEvent(event);
  //    } else {
  //      var plainText = standardClipboardEvent(event, e);
  //      focusHiddenArea();
  //      e.preventDefault();
  //      //alert(plainText);
  //      //var span = $("<span>" + plainText + "</span>");
  //      //selection.insertNode(span[0]);
  //      // pass the first node in the jQuery object
  //      //$(selection).append(plainText);
  //      var source = '<pre data-enlighter-language="js">'+plainText+'</pre>';
  //
  //      var insertTextAtCursor = function(plainText) {
  //        var sel, range, html;
  //        if (window.getSelection) {
  //          sel = window.getSelection();
  //          if (sel.getRangeAt && sel.rangeCount) {
  //            range = sel.getRangeAt(0);
  //            range.deleteContents();
  //            range.insertNode( document.createTextNode(plainText) );
  //          }
  //        } else if (document.selection && document.selection.createRange) {
  //          document.selection.createRange().plainText = plainText;
  //        }
  //      };
  //      //insertTextAtCursor(plainText);
  //
  //      var hightlight = Prism.highlight(plainText, Prism.languages.css);
  //
  //      console.log('hightlight: ', hightlight);
  //
  //
  //      var changedThat = '<pre class="language-css"><code class="language-css">'
  //        +hightlight+'</code></pre>';
  //      //
  //      $('#content').append(changedThat);
  //
  //      var nextCell = "<p>&nbsp;</p>";
  //      $('#content').append(nextCell);
  //      $('#content').children().last().remove();
  //      $('#content').append(nextCell);
  //
  //
  //
  //      //console.log('changedThat: ', changedThat);
  //      //insertTextAtCursor(plainText);
  //    }
  //
  //  });
  //});


});

Template.postNew.helpers({
  categoriesCount: function() {
    return Template.instance().categoriesCount();
  },

  categories: function() {
    return Template.instance().categories();
  },

  titleEditable: function() {
    return '<h3 id="title" class="title-editable" contenteditable="true" ' +
      'placeholder="Title..."></div>';
  },

  contentEditable: function() {
    return '<div id="content" class="content-editable" contenteditable="false" ' +
      'placeholder="Enter here..."></div>';
  },

  insertImage: function(url) {
    var img, range, selection;
    console.log(url + " insert");
    img = document.createElement('img');
    img.setAttribute('src', url);
    img.setAttribute('style', 'width: 50px;');
    if (window.getSelection) {
      selection = window.getSelection();
      if (selection.getRangeAt && selection.rangeCount) {
        range = selection.getRangeAt(0);
        range.deleteContents();
        return range.insertNode(img);
      }
    }
  },

  plainText: function() {

  }
});

Template.postNew.events({
  'input focus #content': function(e, instance) {
    e.preventDefault();
    e.stopPropagation();
    //console.log('input event');
    console.log('e: ', e);
    instance.autoSave.clear();
    instance.autoSave.set(function() {
      var object = {
        title: instance.$('#title').val(),
        content: instance.$('#content').html()
      };

      if (! instance.draftId) {
        if (_.isEmpty(object.content)) {
          return;
        }

        Meteor.call('postDraftInsert', object, function(error, id) {
          if (error) {
            Alerts.notify('error', error.reason);
          } else {
            instance.draftId = id;
            Alerts.notify('success', 'draft_inserted');
          }
        });
      } else {
        if (! _.isEmpty(object.content)) {
          Meteor.call('postDraftUpdate', instance.draftId, object, function(error) {
            if (error) {
              Alerts.notify('error', error.reason);
            } else {
              Alerts.notify('success', 'draft_saved');
            }
          });
        } else {
          Meteor.call('postDraftRemove', instance.draftId, function(error) {
            if (! error) {
              Alerts.notify('success', 'draft_removed');
              instance.draftId = null;
            }
          });
        }
      }
    });
  },

  'submit #formPostNew': function(e, instance) {
    e.preventDefault();

    var object = {
      category: $(e.target).find('[name=category]').val(),
      title: instance.$('#title').html(),
      content: instance.$('#content').html()
    };

    if (! object.content) {
      Alerts.notify('error', 'input content');
      return;
    }

    Meteor.call('postInsert', object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {
        if (instance.draftId) {
          Meteor.call('postDraftRemove', instance.draftId, function() {
            console.log('draft removed...');
          });
        }
        Alerts.notify('success', 'post_insert_success');
        Router.go('postView', { _id: result });
      }
    });
  },

  'click [data-edit="code"]': function(e) {

    e.preventDefault();
    e.stopPropagation();

    //$('#content').prop('contenteditable', false);

    console.log('code modal..');
    $('#codeModal').modal('show');
    setTimeout(function(){
      console.log('key press: ');
      $('.code-area').focus();
    }, 500);



    //var source = '<pre class=" language-javascript"><code class=" language-javascript">&nbsp;</code></pre>';
    //$('#content').append(source);
    //source = "<p>&nbsp;</p>";
    //$('#content').append(source);
  }


  //$('code').on('keypress', function(event) {
  //  if (event.keyCode === 13) {
  //    alert('test');
      //console.log('range.endContainer.wholeText: ', range.endContainer.wholeText);
      //
      //var targetUrl = range.endContainer.wholeText;
      //
      //// http://, https://, ftp://
      //var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
      //// www. sans http:// or https://
      //var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      //var attributesString = 'target="_blank"';
      //
      //var test = targetUrl
      //  .replace(urlPattern, '<a ' + attributesString + ' href="$&">$&</a>')
      //  .replace(pseudoUrlPattern, '$1<a ' + attributesString + ' href="http://$2">$2</a>')
      //
      //
      //console.log('replace ', test);

    //}

  //})

});
