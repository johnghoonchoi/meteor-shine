END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space

Template.registerHelper("linkify", function () {
  var view = this;
  var content = '';
  if (view.templateContentBlock) {
    content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
  }
  content = 'www.naver.com';

  var source = HTML.Raw(linkify(content));

  console.log('source: ', source);


});

linkify = function (string) {
  if (!string) return '';

  console.log('string: ', string);

  // http://, https://, ftp://
  var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

  // www. sans http:// or https://
  var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

  // Email addresses
  var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

  var attributesString = 'target="_blank"';

  var test = string
    .replace(urlPattern, '<a ' + attributesString + ' href="$&">$&</a>')
    .replace(pseudoUrlPattern, '$1<a ' + attributesString + ' href="http://$2">$2</a>')
    .replace(emailAddressPattern, '<a  ' + attributesString + ' href="mailto:$&">$&</a>');

  console.log('test: ', test);

  return test;
};



saveSelection = function(containerEl) {
  var selectedTextRange = document.selection.createRange();
  var preSelectionTextRange = document.body.createTextRange();
  preSelectionTextRange.moveToElementText(containerEl);
  preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
  var start = preSelectionTextRange.text.length;

  return {
    start: start,
    end: start + selectedTextRange.text.length
  }
};

restoreSelection = function(containerEl, savedSel) {
  var textRange = document.body.createTextRange();
  textRange.moveToElementText(containerEl);
  textRange.collapse(true);
  textRange.moveEnd("character", savedSel.end);
  textRange.moveStart("character", savedSel.start);
  textRange.select();
};


createLink = function(matchedTextNode) {
  var el = document.createElement("a");
  el.href = matchedTextNode.data;
  el.appendChild(matchedTextNode);
  return el;
};

shouldLinkifyContents = function(el) {
  return el.tagName != "A";
};

surroundInElement = function(el, regex, surrounderCreateFunc, shouldSurroundFunc) {
  var child = el.lastChild;
  while (child) {
    if (child.nodeType == 1 && shouldSurroundFunc(el)) {
      surroundInElement(child, regex, createLink, shouldSurroundFunc);
    } else if (child.nodeType == 3) {
      surroundMatchingText(child, regex, surrounderCreateFunc);
    }
    child = child.previousSibling;
  }
};

surroundMatchingText = function(textNode, regex, surrounderCreateFunc) {
  var parent = textNode.parentNode;
  var result, surroundingNode, matchedTextNode, matchLength, matchedText;
  while ( textNode && (result = regex.exec(textNode.data)) ) {
    matchedTextNode = textNode.splitText(result.index);
    matchedText = result[0];
    matchLength = matchedText.length;
    textNode = (matchedTextNode.length > matchLength) ?
      matchedTextNode.splitText(matchLength) : null;
    surroundingNode = surrounderCreateFunc(matchedTextNode.cloneNode(true));
    parent.insertBefore(surroundingNode, matchedTextNode);
    parent.removeChild(matchedTextNode);
  }
};


var urlRegex = /http(s?):\/\/($|[^ ]+)/;

updateLinks = function(textBox) {

  var savedSelection = saveSelection(textBox);

  console.log('savedSelection: ', savedSelection);

  surroundInElement(textBox, urlRegex, createLink, shouldLinkifyContents);

  restoreSelection(textBox, savedSelection);
};


//getFirstRange = function() {
//  var sel = rangy.getSelection();
//  return sel.rangeCount ? sel.getRangeAt(0) : null;
//};



