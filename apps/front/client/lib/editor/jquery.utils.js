///*https://richonrails.com/articles/text-area-manipulation-with-jquery*/
///*global jQuery, $*/
//(function ($) {
//  $.fn.extend({
//    setCursorPosition: function(position){
//      if(this.length == 0) return this;
//      return $(this).setSelection(position, position);
//    },
//
//    setSelection: function(selectionStart, selectionEnd) {
//      if(this.length == 0) return this;
//      input = this[0];
//
//      if (input.createTextRange) {
//        var range = input.createTextRange();
//        range.collapse(true);
//        range.moveEnd('character', selectionEnd);
//        range.moveStart('character', selectionStart);
//        range.select();
//      } else if (input.setSelectionRange) {
//        input.focus();
//        input.setSelectionRange(selectionStart, selectionEnd);
//      }
//
//      return this;
//    },
//
//    focusEnd: function() {
//      //this.setCursorPosition(this.val().length);
//      this.setCursorPosition(this.val().length);
//    },
//
//    focusStart: function() {
//      this.setCursorPosition(0);
//    },
//
//    getCursorPosition: function() {
//      var el = $(this).get(0);
//      var pos = 0;
//      if('selectionStart' in el) {
//        pos = el.selectionStart;
//      } else if('selection' in document) {
//        el.focus();
//        var Sel = document.selection.createRange();
//        var SelLength = document.selection.createRange().text.length;
//        Sel.moveStart('character', -el.value.length);
//        pos = Sel.text.length - SelLength;
//      }
//      return pos;
//    },
//
//    insertAtCursor: function(myValue) {
//      return this.each(function(i) {
//        if (document.selection) {
//          //For browsers like Internet Explorer
//          this.focus();
//          sel = document.selection.createRange();
//          sel.text = myValue;
//          this.focus();
//        }
//        else if (this.selectionStart || this.selectionStart == '0') {
//          //For browsers like Firefox and Webkit based
//          var startPos = this.selectionStart;
//          var endPos = this.selectionEnd;
//          var scrollTop = this.scrollTop;
//          this.value = this.value.substring(0, startPos) + myValue +
//            this.value.substring(endPos,this.value.length);
//          this.focus();
//          this.selectionStart = startPos + myValue.length;
//          this.selectionEnd = startPos + myValue.length;
//          this.scrollTop = scrollTop;
//        } else {
//          this.value += myValue;
//          this.focus();
//        }
//      })
//    },
//
//    getInputSelection: function(el) {
//      var start = 0, end = 0, normalizedValue, range,
//        textInputRange, len, endRange;
//
//      if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
//        start = el.selectionStart;
//        end = el.selectionEnd;
//      } else {
//        range = document.selection.createRange();
//
//        if (range && range.parentElement() == el) {
//          len = el.value.length;
//          normalizedValue = el.value.replace(/\r\n/g, "\n");
//
//          // Create a working TextRange that lives only in the input
//          textInputRange = el.createTextRange();
//          textInputRange.moveToBookmark(range.getBookmark());
//
//          // Check if the start and end of the selection are at the very end
//          // of the input, since moveStart/moveEnd doesn't return what we want
//          // in those cases
//          endRange = el.createTextRange();
//          endRange.collapse(false);
//
//          if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
//            start = end = len;
//          } else {
//            start = -textInputRange.moveStart("character", -len);
//            start += normalizedValue.slice(0, start).split("\n").length - 1;
//
//            if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
//              end = len;
//            } else {
//              end = -textInputRange.moveEnd("character", -len);
//              end += normalizedValue.slice(0, end).split("\n").length - 1;
//            }
//          }
//        }
//      }
//
//      return {
//        start: start,
//        end: end
//      };
//    },
//
//    replaceSelectedText: function(el, text) {
//      var sel = this.getInputSelection(el);
//      var val = el.value;
//      el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
//    }
//  })
//}(window.jQuery));
