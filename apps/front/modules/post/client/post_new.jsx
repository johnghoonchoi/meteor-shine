Template.postNew.onCreated(function() {
	this.autoSave = new Autosave();
	this.draftId = null;
	this.autorun(() => {
		this.subscribe('postCategoriesList',
			{ state: 'ON' }, { sort: { seq: 1 }});
		// Define	reactive variables
		this.reactiveTextarea = new ReactiveVar;
	});

	this.categoriesCount = () => {
		return Counts.get('categoriesListCount');
	};

	this.categories = () => {
		return Categories.find({ state: 'ON' }, { sort: { seq: 1 }});
	};

	// for modal
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
	//this.$('#content').wysiwyg();
	//this.$('.textarea-block').val('').tabOverride(true).flexText().focus();
	this.$("[data-provide=markdown]").markdown({autofocus:false,savable:false});
	this.$("[data-provide=markdown]").tabOverride().flexText();
	//this.$(".md-header").children().append

	//var $contents = this.$('[data-provide]');
	//var dataType = $contents.attr('data-provide');
	//console.log('dataType: ', dataType);

});

Template.postNew.helpers({
	categoriesCount () { return Template.instance().categoriesCount(); },
	categories () { return Template.instance().categories() },
	reactiveTextarea () { return Template.instance().reactiveTextarea.get() },

	titleEditable () {
		let attrs = {
			id: 'title',
			class: 'title-editable',
			isEdit: 'true',
			pHolder: 'Title..'
		};

		return `<h3 id=${attrs.id} class=${attrs.class} contenteditable=${attrs.isEdit} placeholder=${attrs.pHolder}></h3>`;
	}

});

Template.postNew.events({
	'click [data-handler=bootstrap-markdown-cmdUpload]' () {
		$('input.cloudinary_fileupload').trigger('click');
		console.log('trigger: ');
	},

	'click [data-handler=bootstrap-markdown-cmdPreview]' (e) {
		var $pre = $('.flex-text-wrap>pre');
		$pre.toggleClass('hidden');
	},

	'click .md-control-fullscreen' () {
		var wrapper = $('#wrapper');

		if (! wrapper.hasClass('aside-right-set'))
			wrapper.addClass('aside-left-set');
	},

	'click [data-edit=bold]' (e, instance) {
		var $block = instance.$(e.target).closest('.content-block');
		var $textBlock = $block.find('.textarea-block');
		console.log('$textBlock: ', $textBlock.length);

		var textNode = $textBlock[0];
		$textBlock.focus();

		var selectPosition = $textBlock.selection('getPos');
		var selectionStart = selectPosition.start;
		var selectionEnd = selectPosition.end;
				
		if (selectionStart === selectionEnd) {

			$textBlock.selection('insert', {
				text: '**텍스트**'
			});
			textNode.selectionStart = selectionStart + 2;
			textNode.selectionEnd   = selectionStart + 5;

		} else {
			var selText = $textBlock.selection();
			var modifiedSelText = "**" + selText + "**";

			$textBlock.selection('replace', {
				text: modifiedSelText,
				caret: 'end'/* start, keep, end */
			});
		}
	},

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

	'click [data-edit=html]' (e, instance) {

		var $block, $nextBlock, $textBlock, index;
		$block = instance.$(e.target).closest('.content-block');
		$block.after(EditableComp);
		index = $block.index();
		console.log('index: ', index);
		$nextBlock = $block.next();
		$nextBlock.after(PostMarkdownToolbarComb);
		$textBlock = $nextBlock.next().find('.textarea-block');
		$textBlock.tabOverride(true).flexText().val('').focus();
	},

	'click [data-edit=delete]' (e, instance) {
		var $block = instance.$(e.target).closest('.content-block');
		var $prevBlock = $block.prev();
		var $nextBlock = $block.next();

		if ($prevBlock) {
			$block.remove();
			$prevBlock.find('.textarea-block').focus();
		}
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

	'focus [data-sequence]' (e, instance) {
		var $self = $(e.target);

		setTimeout(function() {
			$self.parent().prev().addClass('active');
		}, 1);

		console.log('focus..');
		
	},
	'blur [data-sequence]' (e, instance) {
		var $self = $(e.target);

		setTimeout(function() {
			$self.parent().prev().removeClass('active');
		}, 1);

		console.log('focus..');

	},

	'keydown [data-provide=markdown]' (e, instance) {
		var $self = $(e.target);
		var $block = $self.closest('.content-block');
		var $textBlock = $self.closest('.textarea-block');
		var textVal, compiledHtml;


		// 미리보기
		//setTimeout(() => {
		//	textVal = $textBlock.val();
		//	console.log('textVal: ', textVal);
		//	if ($textBlock) {
		//		compiledHtml = marked(textVal);
		//		console.log('compiledHtml: ', compiledHtml);
		//		instance.reactiveTextarea.set(compiledHtml);
		//	}
		//}, 1);


		var code = (e.keyCode ? e.keyCode : e.which);
		
		console.log('what\'s code: ', code);
		//
		//var count = $('#contentWrapper').find('.content-block').length;
		//
		//console.log('non trim..: ', $textBlock.val());
		//
		//
		//var origin = $block.find('.textarea-block');
		//var cursorPositionStart = origin.prop("selectionStart");
		//var textLength = origin.val().split("\n").join("").length;
		//var $prevBlock = $block.prev();
		//var isTextarea = $prevBlock.children().hasClass('flex-text-wrap');
		//
		//
		//// delete key
		//if (code === 8 && count !== 1 && cursorPositionStart === 0 && $textBlock.val().trim() === '' ){
		//	e.preventDefault();
		//
		//	//var $prevBlock = $block.prev();
		//	//var isTextarea = $prevBlock.children().hasClass('flex-text-wrap');
		//	console.log('$textBlock: ', !! $textBlock);
		//
		//	if (isTextarea) {
		//		$block.remove();
		//		$prevBlock.find('.textarea-block').focus();
		//		console.log('delete..');
		//		return
		//	}
		//
		//	$prevBlock = $prevBlock.prev();
		//	$textBlock = $prevBlock.find('.textarea-block');
		//	isTextarea = $prevBlock.children().hasClass('flex-text-wrap');
		//	if (isTextarea) {
		//		$block.remove();
		//		$prevBlock.find('.textarea-block').focus();
		//	}
		//}
		//
		//// up arrow key
		//if (code === 38 && cursorPositionStart === 0) {
		//	var $prevBlock = $block.prev();
		//	var isTextarea = $prevBlock.children().hasClass('flex-text-wrap');
		//
		//	if (isTextarea) {
		//		$prevBlock.find('.textarea-block').focusEnd();
		//	}
		//	console.log('up arrow..');
		//}
		//
		//// down arrow key
		//if (code === 40 && cursorPositionStart === textLength) {
		//	var $nextBlock = $block.next();
		//	var isTextarea = $nextBlock.children().hasClass('flex-text-wrap');
		//
		//	if (isTextarea) {
		//		$nextBlock.find('.textarea-block').focusStart();
		//	}
		//	console.log('down arrow..');
		//}
		//
		//// return(enter) key
		//if (code == 13 && e.shiftKey) {
		//	e.preventDefault();
		//	console.log('shift: ');
		//	var $nextBlock, $textBlock;
		//
		//	$block.after(PostMarkdownToolbarComb);
		//	$nextBlock = $block.next();
		//	$textBlock = $nextBlock.find('.textarea-block');
		//	$textBlock.tabOverride(true).flexText().val('').focus();
		//}
		//
		//if (e.metaKey && code === 66) {
		//	console.log('bold..: ');
		//	var $block = instance.$(e.target).closest('.content-block');
		//	var $textBlock = $block.find('.textarea-block');
		//	console.log('$textBlock: ', $textBlock.length);
		//
		//	var textNode = $textBlock[0];
		//	$textBlock.focus();
		//
		//	var selectPosition = $textBlock.selection('getPos');
		//	var selectionStart = selectPosition.start;
		//	var selectionEnd = selectPosition.end;
		//
		//	if (selectionStart === selectionEnd) {
		//
		//		$textBlock.selection('insert', {
		//			text: '**텍스트**'
		//		});
		//		textNode.selectionStart = selectionStart + 2;
		//		textNode.selectionEnd   = selectionStart + 5;
		//
		//	} else {
		//		var selText = $textBlock.selection();
		//		var modifiedSelText = "**" + selText + "**";
		//
		//		$textBlock.selection('replace', {
		//			text: modifiedSelText,
		//			caret: 'end'/* start, keep, end */
		//		});
		//	}
		//}

	},

	'input focus #content' (e, instance) {
		e.preventDefault();
		e.stopPropagation();
		//console.log('input event');
		console.log('e: ', e);
		instance.autoSave.clear();
		instance.autoSave.set(function() {
			var object = {
				title: instance.$('#title').val(),
				content: instance.$('.content-preview').html()
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

	//
	'submit #formPostNew' (e, instance) {
		e.preventDefault();

		var $contents = instance.$('[data-provide]');
		var dataType = $contents.attr('data-provide');

		var obj = {};
		if (dataType === 'markdown') {
			obj['type'] = dataType;
			obj['version'] = '0.0.1';
			obj['data'] = $contents.val();
		} else if (dataType === 'wyswig') {

		} else {

		}

		var object = {
			category: $(e.target).find('[name=category]').val(),
			title: instance.$('#title').html(),
			content: obj
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
