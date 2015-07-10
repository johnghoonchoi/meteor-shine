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

  instance.reactiveTextarea = new ReactiveVar('');

  this._postCodeView = Blaze.render(Template.postCode, document.body);

});

Template.postNew.onDestroyed(function() {
  this.autoSave = null;
  this.draftId = null;
  this.categoriesCount = null;
  this.categories = null;
  this.leftCaret = null;

  if (this._postCodeView) {
    console.log('Destroyed post code view');
    Blaze.remove(this._postCodeView);
    this._postCodeView = null;
  }


});

Template.postNew.onRendered(function() {
  this.$('#content').wysiwyg();

  this.$('#textareaDesc').tabOverride(true);
  this.$('#textareaDesc').val('');
  this.$('#textareaDesc').focus();
  this.nodeTextarea = $('#textareaDesc')[0];
  this.leftCaret = getCaretCoordinates(this.nodeTextarea, this.nodeTextarea.selectionEnd).left;


  //$("#content").on('keydown',function(e)
  //{
  //  console.log('keydown: ');
  //  if(e.keyCode == 13 && e.shiftKey) {
  //    e.preventDefault();
  //    console.log("combi");
  //    document.execCommand('insertParagraph',false,'p');
  //    document.execCommand('formatBlock', false, 'p');
  //  } else if(e.keyCode == 13) {
  //    e.preventDefault();
  //    console.log("key", e.keyCode);
  //
  //    var getFirstRange = function() {
  //      var sel = rangy.getSelection();
  //      return sel.rangeCount ? sel.getRangeAt(0) : null;
  //    };
  //
  //    var range = getFirstRange();
  //
  //    console.log('range: ', range);
  //
  //    console.log('commonAncestorContainer: ',typeof range.commonAncestorContainer);
  //
  //
  //
  //    if (range) {
  //      //pre.className = 'pre-styling';
  //      var br = document.createElement("br");
  //      range.insertNode(br);
  //      rangy.getSelection().setSingleRange(range);
  //    }
  //
  //    //document.execCommand('insertHTML', false, '<br></br>');
  //  } else if(e.keyCode == 9) {
  //    console.log("key", e.keyCode);
  //    e.preventDefault();
  //  }
  //
  //  //if (keyCode === 13)
  //  //{
  //  //  e.preventDefault();
  //  //  e.stopPropagation();
  //  //  document.execCommand('styleWithCSS',true,null);
  //  //  document.execCommand('insertParagraph',false,'p');
  //  //  document.execCommand('formatBlock', false, 'p');
  //  //}
  //
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
  reactiveTextarea: function() {
    return Template.instance().reactiveTextarea.get();
  },

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
    return '<div id="content" class="content-editable" data-seq="1" contenteditable="true" ' +
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
  'click [data-edit=fullscreen]': function(e, instance) {
    var target = $('#articleWrap')[0];
    console.log('target: ', target);

    if (BigScreen.enabled) {
      BigScreen.request(target, BigScreen.onEnter, BigScreen.onExit, BigScreen.onError);
      // You could also use .toggle(element, onEnter, onExit, onError)
    }
    else {
      alert('해당 브라우저는 전체화면을 지원하지 않습니다.');
      // fallback for browsers that don't support full screen
    }
  },
  //  Control enter key & return key for dynamic height of textarea
  'keydown #textareaDesc': function(e, instance) {
    //console.log('instance.leftCaret: ', instance.leftCaret);
    var code = (e.keyCode ? e.keyCode : e.which);

    if (code === 13 || code === 8) {
      var self = e.target;
      var $self = $(self);
      // typeof number
      var height = $self[0].offsetHeight;

      if (code === 13) {
        $self.css('height', height+20);
        return;
      }

      var coordinates = getCaretCoordinates(self, self.selectionEnd);

      if (height >= 62 && coordinates.left === instance.leftCaret)
        $self.css('height', height-20);
    }
  },

  'keyup #textareaDesc': function (e, instance) {
    setTimeout(function(){
      e.preventDefault();
      var textarea =  $(e.target).val();
      instance.reactiveTextarea.set(textarea);
    },100);
  },

  'click [data-edit=before]': function() {
    var textCell = '<div class="content-cell content-editable" contenteditable="true" draggable="true" ' +
    'placeholder="Enter here..."></div>';
    var sel = document.getSelection();
    var container = sel.getRangeAt(0).commonAncestorContainer;
    $(container).before(textCell);
  },
  'click [data-edit=after]': function() {
    var sel = document.getSelection();
    var container = sel.getRangeAt(0);
    console.log('container: ', container);
    var sequence = $(container).attr('data-seq');
    console.log('sequence: ', sequence);
    newSeq = parseInt(sequence) + 1;
    var textCell = '<div class="content-cell content-editable" contenteditable="true" data-seq="' +newSeq+
      '" placeholder="Enter here..."></div>';

    $(container).after(textCell);
  },


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
      content: instance.$('.epic').html()
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
    var getFirstRange = function() {
      var sel = rangy.getSelection();
      return sel.rangeCount ? sel.getRangeAt(0) : null;
    };

    var range = getFirstRange();
    if (range) {
      var pre = document.createElement("pre");
      //pre.className = 'pre-styling';
      var br = document.createElement("br");
      pre.appendChild(br);
      range.insertNode(pre);
      rangy.getSelection().setSingleRange(range);
    }

    //var source = '<pre><code>&nbsp;</code></pre>';
    //contenteditable.innerHTML += '<div id="startHere">Start Here</div>';

    //$('#content').prop('contenteditable', false);

    //console.log('code modal..');
    //$('#codeModal').modal('show');

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
