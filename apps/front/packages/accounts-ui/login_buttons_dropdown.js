
var changePassword = function () {
  loginButtonsSession.resetMessages();

  // notably not trimmed. a password could (?) start or end with a space
  var oldPassword = elementValueById('login-old-password');

  // notably not trimmed. a password could (?) start or end with a space
  var password = elementValueById('login-password');
  if (!validatePassword(password))
    return;

  if (!matchPasswordAgainIfPresent())
    return;

  Accounts.changePassword(oldPassword, password, function (error) {
    if (error) {
      loginButtonsSession.errorMessage(error.reason || "Unknown error");
    } else {
      loginButtonsSession.set('inChangePasswordFlow', false);
      loginButtonsSession.set('inMessageOnlyFlow', true);
      loginButtonsSession.infoMessage("Password changed");
    }
  });
};

var matchPasswordAgainIfPresent = function () {
  // notably not trimmed. a password could (?) start or end with a space
  var passwordAgain = elementValueById('login-password-again');
  if (passwordAgain !== null) {
    // notably not trimmed. a password could (?) start or end with a space
    var password = elementValueById('login-password');
    if (password !== passwordAgain) {
      loginButtonsSession.errorMessage("Passwords don't match");
      return false;
    }
  }
  return true;
};

var correctDropdownZIndexes = function () {
  // IE <= 7 has a z-index bug that means we can't just give the
  // dropdown a z-index and expect it to stack above the rest of
  // the page even if nothing else has a z-index.  The nature of
  // the bug is that all positioned elements are considered to
  // have z-index:0 (not auto) and therefore start new stacking
  // contexts, with ties broken by page order.
  //
  // The fix, then is to give z-index:1 to all ancestors
  // of the dropdown having z-index:0.
  for(var n = document.getElementById('login-dropdown-list').parentNode;
      n.nodeName !== 'BODY';
      n = n.parentNode)
    if (n.style.zIndex === 0)
      n.style.zIndex = 1;
};
