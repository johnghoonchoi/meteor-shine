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
});

Template.postNew.onDestroyed(function() {
  this.autoSave = null;
  this.draftId = null;
  this.categoriesCount = null;
  this.categories = null;
});

Template.postNew.onRendered(function() {
  this.$('#content').wysiwyg();
  this.$('#content').focus();


  $('#content').on('focus', function() {
    console.log('event fire..');
    var $this = $(this);

    $this.data('before', $this.html());

    //console.log('$this: ', $this);

    return $this;
  }).on('blur keyup paste input', function() {
    console.log('compared to.. ');

    var $this = $(this);

    var first = $this.data('before');
    var second = $this.html();

    //console.log('first: ', first);
    //console.log('second: ', second);


    if ($this.data('before') !== $this.html()) {
      $this.data('before', $this.html());
      $this.trigger('change');
    }

    //console.log('$this: ', $this);

    return $this;
  });

  $('#content').on("keyup", function(event) {
    var textBox = document.getElementById("content");
    var keyTimer = null, keyDelay = 3000;

    if (keyTimer) {
      window.clearTimeout(keyTimer);
    }
    keyTimer = window.setTimeout(function() {
      //alert('test');
      //updateLinks(textBox);
      keyTimer = null;
    }, keyDelay);

  });

  $('#content').on('keypress', function(event) {
    if (event.keyCode === 13) {
      var selection = rangy.getSelection();
      var range = selection.getRangeAt(0);

      console.log('selection: ');

      console.log('range.endContainer.wholeText: ', range.endContainer.wholeText);

      var targetUrl = range.endContainer.wholeText;

      // http://, https://, ftp://
      var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
      // www. sans http:// or https://
      var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      var attributesString = 'target="_blank"';

      var test = targetUrl
        .replace(urlPattern, '<a ' + attributesString + ' href="$&">$&</a>')
        .replace(pseudoUrlPattern, '$1<a ' + attributesString + ' href="http://$2">$2</a>')


      console.log('replace ', test);

    }

  });




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
    return '<div id="content" class="content-editable" contenteditable="true" ' +
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
  }
});

Template.postNew.events({
  'input, focus #content': function(e, instance) {
    console.log('input event');

    e.preventDefault();

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
  }
});
