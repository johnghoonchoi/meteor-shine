
Template.postView.onCreated(function() {
  //var data = Template.currentData();
	// { postId }
	this.data = Template.currentData();

  //this.editMode = new ReactiveVar(false);

	this.data.changeMode = new ReactiveVar("postViewTemp");
	this.data.reactiveTextarea = new ReactiveVar("");

	this.data.setPreview = () => {
		var $contentWrap = $('#contentWrapper');
		var $textBlock = $contentWrap.find('.textarea-block');
		var compiledHtml = marked($textBlock.val());

		if ($textBlock && compiledHtml) {
			this.data.reactiveTextarea.set(compiledHtml);
		}
	};

	this.data.insertContent = (mode) => {
		
		console.log('mode: ', mode);
		
		var $contentWrap = $('#contentWrapper');
		var post = this.data.post();
		var leng = post.content.length;
		var item, markdown, html;

		for (var i = 0; i < leng; i++) {
			item = post ? post.content[i] : '';
			if (item.type && item.type === 'markdown') {
				if (mode === 'postEditTemp') {
					$textBlock = $contentWrap.find('.textarea-block').eq(i);
					$textBlock.val(item.content).tabOverride(true).flexText();
					return
				}
				$contentWrap.append(marked(item.content));
			} else {
				if (mode === 'postEditTemp') {
					$contentWrap.append(EditableComp);
					return
				}
				$contentWrap.append(item.content);
			}
		}
	};

	this.data.titleText = () => {
		var post = Template.instance().data.post();
		var title = (post) ? post.title : '';
		return title;
	};

	this.data.titleAttrs = (editable) => {
		var attrs = {
			id: "title",
			class: "title-editable block-wrapper",
			contenteditable: editable
		};
		return attrs;
	};



  //this.setEditMode = (edit) => {
  //  this.$('#title').attr('contenteditable', edit);
	 // this.editMode.set(edit);
  //  //this.$('#content').attr('contenteditable', edit);
  //
  //
	 // // edit mode
  //  if (edit) {
  //    //this.$('#content').wysiwyg();
  //    this.$('#title').focus();
  //
  //    var post = this.post();
  //    if (post && ! _.isEmpty(post.draft)) {
  //      this.$('#title').html(post.draft.title);
  //      //this.$('#content').html(post.draft.content);
  //    }
  //  }
  //};

  this.autoSave = new Autosave();

	// Read data from minimongo
  this.data.post = () => {
    return Posts.findOne(this.data.postId);
  };
  this.data.like = () => {
    return PostLikes.findOne({ postId: this.data.postId });
  };
});

Template.postView.onDestroyed(function() {
  this.autoSave = null;
  this.data = null;
});

Template.postView.onRendered(function() {
	//this.viewModeContent();
	//var test = Template.instance().changeMode.get() || 'postViewTemp';
	console.log('postView: ', this.data);

});

Template.postView.helpers({

	switchMode: function() {
		return Template.instance().data.changeMode.get() || 'postViewTemp';
	},

	canEdit () {
		return Template.instance().data.changeMode.get() === "postEditTemp";
	},

  post () {
    return Template.instance().data.post();
  },

  like () {
    return Template.instance().data.like();
  }

});


Template.postView.events({
	'click [data-edit=plus]' (e, instance) {
		var $block, $nextBlock, $textBlock, index;

		$block = instance.$(e.target).closest('.content-block');
		$block.after(PostMarkdownToolbarComb);
		index = $block.index();
		$nextBlock = $block.next();
		$textBlock = $nextBlock.find('.textarea-block');
		$nextBlock.attr('data-sequence', ++index);
		$textBlock.tabOverride(true).flexText().val('').focus();
	},
	'click [data-edit=fullscreen]' (e, instance) {
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

  'click #edit' (e, instance) {
    //instance.setEditMode(true);
	  //instance.editModeContent();

	  var template = instance.data.changeMode.get();

	  console.log('template: ', template);


	  if (template === 'postEditForm') {
		  instance.data.changeMode.set('postViewTemp');
		  console.log('Mode changed..: view mode');
	  }
	  else {
		  instance.data.changeMode.set('postEditTemp');
		  console.log('Mode changed..: edit mode');
	  }


  },

  'click #delete' (e, instance) {
    e.preventDefault();

    var self = this;

    Alerts.dialog('confirm', 'delete?', function(confirm) {
      if (confirm) {
        Meteor.call('postRemove', self.postId, function(error, result) {
          if (error) {
            Alerts.notify('error', error.message);
          } else {
            Alerts.notify('success', 'post_remove_success');
            history.go(-1);
          }
        });
      }
    });
  },

  'input #content' (e, instance) {
    e.preventDefault();

    var self = this;

    instance.autoSave.clear();
    instance.autoSave.set(function() {
      var object = {
        title: instance.$('#title').html(),
        content: instance.$('#content').html()
      };

      Meteor.call('postSaveDraft', self.postId, object, function(error) {
        if (! error) {
          Alerts.notify('success', 'draft_saved');
        }
      });
    });
  },

  'click #save' (e, instance) {
	  e.preventDefault();

	  var $arrayContents = instance.$('#contentWrapper').children('.content-block');
	  var arrayLeng = $arrayContents.length;
	  var type, item, obj, newContent = [];

	  for (var i = 0; i < arrayLeng; i++) {
		  item = $arrayContents.eq(i);
		  type = item.attr('data-type');
		  console.log('type: ', type);
		  if (type === 'markdown') {
			  obj = {
				  'type': 'markdown',
				  'content': item.find('.textarea-block').val()
			  };
			  newContent[i] = obj;
		  } else {
			  obj = {
				  'type': 'html',
				  'content': item.html()
			  };
			  newContent[i] = obj;
		  }
	  }
	  //console.log('newContent: ', newContent);

	  var object = {
		  category: $(e.target).find('[name=category]').val(),
		  title: $('#title').html(),
		  content: newContent
	  };

    if (! object.content) {
      Alerts.notify('error', 'input content');
      return;
    }

    Meteor.call('postUpdate', this.postId, object, function(error, result) {
      if (error) {
        Alerts.notify('error', error.message);
      } else {

        Alerts.notify('success', 'post_insert_success');
        instance.data.changeMode.set('postViewTemp');
      }
    });
  },

  'click #like' (e, instance) {
    e.preventDefault();

    Meteor.call('postLikeInsert', this.postId, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  },

  'click #unlike' (e, instance) {
    e.preventDefault();

    Meteor.call('postLikeRemove', this.postId, function(error) {
      if (error) {
        Alerts.notify('error', error.reason);
      }
    });
  },

  'click .load-more' (e, instance) {
    e.preventDefault();
    instance.limit.set(instance.limit.get() + instance.increment);
  },

	'keydown [data-type], focus [data-type]' (e, instance) {
		var $self = $(e.target);
		var $block = $self.closest('.content-block');
		var $textBlock = $self.closest('.textarea-block');

		var code = (e.keyCode ? e.keyCode : e.which);
		var count = $('#contentWrapper').find('.content-block').length;

		var origin = $block.find('.textarea-block');
		var cursorPositionStart = origin.prop("selectionStart");
		var textLength = origin.val().split("\n").join("").length;
		var $prevBlock = $block.prev();
		var isTextarea = $prevBlock.children().hasClass('flex-text-wrap');

		//console.log('non trim..: ', $textBlock.val());
		//console.log('trim..: ', $textBlock.val().trim());

		// delete key
		if (code === 8 && count !== 1 && cursorPositionStart === 0 && $textBlock.val().trim() === '' ){
			e.preventDefault();

			//var $prevBlock = $block.prev();
			//var isTextarea = $prevBlock.children().hasClass('flex-text-wrap');
			console.log('$textBlock: ', !! $textBlock);

			if (isTextarea) {
				$block.remove();
				$prevBlock.find('.textarea-block').focus();
				console.log('delete..');
				return
			}

			$prevBlock = $prevBlock.prev();
			$textBlock = $prevBlock.find('.textarea-block');
			isTextarea = $prevBlock.children().hasClass('flex-text-wrap');
			if (isTextarea) {
				$block.remove();
				$prevBlock.find('.textarea-block').focus();
			}
		}

		// up arrow key
		if (code === 38 && cursorPositionStart === 0) {
			var $prevBlock = $block.prev();
			var isTextarea = $prevBlock.children().hasClass('flex-text-wrap');

			if (isTextarea) {
				$prevBlock.find('.textarea-block').focusEnd();
			}
			console.log('up arrow..');
		}

		// down arrow key
		if (code === 40 && cursorPositionStart === textLength) {
			var $nextBlock = $block.next();
			var isTextarea = $nextBlock.children().hasClass('flex-text-wrap');

			if (isTextarea) {
				$nextBlock.find('.textarea-block').focusStart();
			}
			console.log('down arrow..');
		}

		// return(enter) key
		if (code == 13 && e.shiftKey) {
			e.preventDefault();
			console.log('shift: ');
			var $nextBlock, $textBlock;

			$block.after(PostMarkdownToolbarComb);
			$nextBlock = $block.next();
			$textBlock = $nextBlock.find('.textarea-block');
			$textBlock.tabOverride(true).flexText().val('').focus();
		}
	}
});
