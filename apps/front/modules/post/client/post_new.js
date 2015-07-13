//Template.postNew.helpers({
//  reactiveTextarea = function() {
//  return Template.instance().reactiveTextarea.get();
//},
//
//categoriesCount = function() {
//  return Template.instance().categoriesCount();
//},
//
//categories = function() {
//  return Template.instance().categories();
//},
//
//titleEditable = function() {
//  var attrs = {
//    id: 'title',
//    class: 'title-editable',
//    editable: 'true',
//    holder: 'Title..'
//  };
//
//  return `<h3 id=${attrs.id} class=${attrs.class} contenteditable=${attrs.editable} placeholder=${attrs.holder}></h3>`;
//}
//
////contentEditable: function() {
////	return '<div id="content" class="content-editable" data-seq="1" contenteditable="true" ' +
////		'placeholder="Enter here..."></div>';
////},
////
////insertImage: function(url) {
////	var img, range, selection;
////	console.log(url + " insert");
////	img = document.createElement('img');
////	img.setAttribute('src', url);
////	img.setAttribute('style', 'width: 50px;');
////	if (window.getSelection) {
////		selection = window.getSelection();
////		if (selection.getRangeAt && selection.rangeCount) {
////			range = selection.getRangeAt(0);
////			range.deleteContents();
////			return range.insertNode(img);
////		}
////	}
////}
//
//});

//Template.postNew.events({
//  'click [data-edit=delete]': function(e, instance) {
//    var $this = $(e.target);
//    var ancestor = $this.parent().parent();
//    if (ancestor.next() && ancestor.next().find('#textareaDesc')[0]) {
//      ancestor.next().find('#textareaDesc')[0].focus();
//    } else if (ancestor.prev() && ancestor.prev().find('#textareaDesc')[0]) {
//      ancestor.prev().find('#textareaDesc')[0].focus();
//    }
//
//    ancestor.remove();
//  },
//  'click [data-edit=image]': function(e, instance) {
//    var $this = $(e.target);
//    var ancestor = $this.parent().parent();
//    var cloneTemp = ancestor.clone();
//    console.log('ancestor: ', ancestor);
//    var source = '<div class="image"><div class="btn-group"><a class="btn" data-edit="delete" title="Delete" data-original-title="">삭제</a></div><img src="/images/test.gif" data-id="" /></div>';
//    ancestor.after(cloneTemp);
//    ancestor.after(source);
//    ancestor.next().next().find('#textareaDesc')[0].focus();
//  },
//
//  'click [data-edit=plus]': function(e, instance) {
//    instance.$('.textarea-box').index();
//
//    var index = $('.content-wrapper').find('.content-block').length;
//    console.log('index: ', index);
//
//    var $this = $(e.target);
//    var ancestor = $this.parent().parent();
//    console.log('ancestor: ', ancestor);
//
//    var seq = ancestor.find('#textareaDesc').attr('data-sequence');
//
//    console.log('seq: ', seq);
//
//    var cloneTemp = ancestor.clone();
//
//    cloneTemp.find('#textareaDesc').attr('data-sequence', '2');
//
//    if (ancestor.next() && ancestor.next().hasClass('image')) {
//      ancestor.next().after(cloneTemp);
//      ancestor.next().next().find('#textareaDesc')[0].focus();
//      return;
//    }
//    ancestor.after(cloneTemp);
//    ancestor.next().find('#textareaDesc')[0].focus();
//  },
//
//  'click [data-edit=fullscreen]': function(e, instance) {
//    var target = $('#articleWrap')[0];
//    console.log('target: ', target);
//
//    if (BigScreen.enabled) {
//      BigScreen.request(target, BigScreen.onEnter, BigScreen.onExit, BigScreen.onError);
//      // You could also use .toggle(element, onEnter, onExit, onError)
//    }
//    else {
//      alert('해당 브라우저는 전체화면을 지원하지 않습니다.');
//      // fallback for browsers that don't support full screen
//    }
//  },
//
//  'keydown [data-sequence], focus [data-sequence]': function (e, instance) {
//    setTimeout(function(){
//      e.preventDefault();
//      var textarea = $('[data-sequence=1]').val();
//      instance.reactiveTextarea.set(textarea);
//    },1);
//
//    var code = (e.keyCode ? e.keyCode : e.which);
//    var $self = $(e.target);
//    var leng = $('.content-wrapper').find('.content-block').length;
//    console.log('leng: ', typeof leng);
//
//    var ancestor = $self.parent().parent();
//    if (code === 8 && leng !== 1 && $self.val() === '') {
//      e.preventDefault();
//      console.log('delete: ');
//      if (ancestor.prev() && ancestor.prev().hasClass('image')) {
//        if (ancestor.prev().prev() && ancestor.prev().prev().find('#textareaDesc')[0])
//          ancestor.prev().prev().find('#textareaDesc')[0].focus();
//      } else {
//        ancestor.prev().find('#textareaDesc')[0].focus();
//      }
//
//      $self.parent().parent().remove();
//    }
//
//  },
//
//  //'click [data-edit=after]': function() {
//  //  var sel = document.getSelection();
//  //  var container = sel.getRangeAt(0);
//  //  console.log('container: ', container);
//  //  var sequence = $(container).attr('data-seq');
//  //  console.log('sequence: ', sequence);
//  //  newSeq = parseInt(sequence) + 1;
//  //  var textCell = '<div class="content-cell content-editable" contenteditable="true" data-seq="' +newSeq+
//  //    '" placeholder="Enter here..."></div>';
//  //
//  //  $(container).after(textCell);
//  //},
//
//
//  'input focus #content': function(e, instance) {
//    e.preventDefault();
//    e.stopPropagation();
//    //console.log('input event');
//    console.log('e: ', e);
//    instance.autoSave.clear();
//    instance.autoSave.set(function() {
//      var object = {
//        title: instance.$('#title').val(),
//        content: instance.$('.content-preview').html()
//      };
//
//      if (! instance.draftId) {
//        if (_.isEmpty(object.content)) {
//          return;
//        }
//
//        Meteor.call('postDraftInsert', object, function(error, id) {
//          if (error) {
//            Alerts.notify('error', error.reason);
//          } else {
//            instance.draftId = id;
//            Alerts.notify('success', 'draft_inserted');
//          }
//        });
//      } else {
//        if (! _.isEmpty(object.content)) {
//          Meteor.call('postDraftUpdate', instance.draftId, object, function(error) {
//            if (error) {
//              Alerts.notify('error', error.reason);
//            } else {
//              Alerts.notify('success', 'draft_saved');
//            }
//          });
//        } else {
//          Meteor.call('postDraftRemove', instance.draftId, function(error) {
//            if (! error) {
//              Alerts.notify('success', 'draft_removed');
//              instance.draftId = null;
//            }
//          });
//        }
//      }
//    });
//  },
//
//  'submit #formPostNew': function(e, instance) {
//    e.preventDefault();
//    var object = {
//      category: $(e.target).find('[name=category]').val(),
//      title: instance.$('#title').html(),
//      content: instance.$('#textareaDesc').val()
//    };
//
//    if (! object.content) {
//      Alerts.notify('error', 'input content');
//      return;
//    }
//
//    Meteor.call('postInsert', object, function(error, result) {
//      if (error) {
//        Alerts.notify('error', error.message);
//      } else {
//        if (instance.draftId) {
//          Meteor.call('postDraftRemove', instance.draftId, function() {
//            console.log('draft removed...');
//          });
//        }
//        Alerts.notify('success', 'post_insert_success');
//        Router.go('postView', { _id: result });
//      }
//    });
//  },
//
//  //'click [data-edit="code"]': function(e) {
//  //  e.preventDefault();
//  //  e.stopPropagation();
//  //  var getFirstRange = function() {
//  //    var sel = rangy.getSelection();
//  //    return sel.rangeCount ? sel.getRangeAt(0) : null;
//  //  };
//  //
//  //  var range = getFirstRange();
//  //  if (range) {
//  //    var pre = document.createElement("pre");
//  //    //pre.className = 'pre-styling';
//  //    var br = document.createElement("br");
//  //    pre.appendChild(br);
//  //    range.insertNode(pre);
//  //    rangy.getSelection().setSingleRange(range);
//  //  }
//  //}
//
//});
