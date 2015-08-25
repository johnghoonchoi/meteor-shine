/**
 * Created by ProgrammingPearls on 15. 8. 20..
 */

ScrollToBottom = function (selector) {
  // scroll to bottom of element
  var element = $(selector)[0];
  console.log('element', element);
  console.log('element.scrollTop_before', element.scrollTop);
  console.log('element.scrollHeight', element.scrollHeight);
  element.scrollTop = 999999;
  console.log('element.scrollTop_after', element.scrollTop);
};
