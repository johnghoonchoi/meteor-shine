inlineEditor = {
  init : function (editor, title) {
    var editor = editor;
    var title  = title;
    var self   = this;
    console.log('Inline Editor Initiated');

    // Editor Events
    editor.addEventListener('keyup', self.events.keyup);
    editor.addEventListener('keydown', self.events.keydown);
    editor.addEventListener('click', self.events.click);

    // Title Events
    title.addEventListener('keydown', self.events.titleKeydown);

    // Paste
    title.addEventListener('paste', self.events.handlepaste);
    editor.addEventListener('paste', self.events.handlepaste);

    // Title Placeholders
    title.addEventListener('blur', self.events.titleBlur, true);
    title.addEventListener('focus', self.events.titleFocus, true);

    // Editor Placeholders
    // editor.addEventListener('blur', self.events.editorBlur, true);
    // editor.addEventListener('focus', self.events.editorFocus, true);
  },

  events : {
    keyup : function (event) {
      var editor       = this;
      var keycode      = event.keyCode || event.which;
      var focusNode    = window.getSelection().focusNode;
      var selectedNode = $.trim($(focusNode).text()).length;

      $(editor).data('default', false);
      // console.log($(editor).data('default'));

      // onEnter
      if (keycode === 13) {
        document.execCommand('formatBlock', false, 'p');
      };

      // Add 'editor-empty' if P is empty
      if (focusNode && (selectedNode > 0)) {
        $(focusNode.parentNode).removeClass('editor-empty');
      } else {
        $(focusNode).addClass('editor-empty');
      };

      //is Selected
      if ($(editor).is(':focus') && editor.hasChildNodes()) {
        var childNodes = editor.childNodes; // Array of childe nodes
        if (childNodes && $(focusNode).hasClass('editor-empty')) {
          $(childNodes).removeClass('is-selected');
          $(focusNode).addClass('is-selected');
        } else {
          $(childNodes).removeClass('is-selected');
          $(focusNode.parentNode).addClass('is-selected');
        }
      }

      // Detect and change link on Keyup
      // Needs more work
      // if (keycode === 32) {
      //   var regExUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

      //   if (editor.innerHTML.match(regExUrl)) {
      //     st = editor.innerHTML.match(regExUrl);
      //     editor.innerHTML = editor.innerHTML.replace(regExUrl, "<a href='" + st[0] + "'>" + st[0] + "</a>");
      //   }
      //   //   // document.execCommand("CreateLink", false, $.trim(st))
      // }
    },

    keydown: function (event) {
      var editor       = this;
      var keycode      = event.keyCode || event.which;

      // Prevent Backspace
      var dNode = 'P' || 'H3';

      if ((keycode === 8)                        &&
          (editor.childNodes.length === 1)       &&
          (!editor.textContent.length)           &&
          (editor.firstChild.nodeName === dNode)) {
        console.log('Prevent Backspace Conditions met');
        event.preventDefault();
        event.stopPropagation();
        return false;
      };

      if (keycode === 9) {
        // Space for Tab;
      };
    },

    titleKeydown: function (event) {
      var keycode      = event.keyCode || event.which;

      if (keycode === 13) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    },

    click: function (event) {
      var editor    = this;
      var focusNode = window.getSelection().focusNode;

      //is Selected
      if ($(editor).is(':focus') && editor.hasChildNodes()) {
        var childNodes = editor.childNodes; // Array of childe nodes
        if (childNodes && $(focusNode).hasClass('editor-empty')) {
          $(childNodes).removeClass('is-selected');
          $(focusNode).addClass('is-selected');
        } else {
          $(childNodes).removeClass('is-selected');
          $(focusNode.parentNode).addClass('is-selected');
        }
      }
    },

    handlepaste : function (event) {
      document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
      event.preventDefault();
    },

    titleBlur : function (event) {
      var titleLength = $.trim($(event.target).text()).length;

      if (titleLength === 0) {
        $(event.target).append('제목');
        $(event.target).data('default', true);
      } else {
        $(event.target).data('default', false);
      }
    },

    titleFocus : function (event) {
      if ( $(event.target).data('default') === true ) {
        $(event.target).empty();
        // $(event.target).data('default', false);
      } else {

      }
    },

    editorBlur : function (event) {
      var editorLength = $.trim($(event.target).text()).length;

      if (editorLength === 0 && $(event.target).data('default') === false) {
        $(event.target).append('<p class="editor-p is-selected>본문</p>;')
                       .data('default', true);
      } else {
        $(event.target).data('default', false);
      }
    },

    editorFocus : function (event) {
      if ( $(event.target).data('default') === true ) {
        $(event.target).empty()
                       .append('<p class="editor-p is-selected></p>')
                       .data('default', false);
      } else {

      }
    },
  }
};
