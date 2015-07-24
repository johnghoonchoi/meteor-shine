TempImages = new Mongo.Collection(null);

imageUrlFit = function(image) {
  return (Meteor.absoluteUrl().indexOf("https://") > -1) ?
    image.surlFit : image.urlFit;
};

Template.registerHelper('imageUrlFit', imageUrlFit);

emptyImageUrl = function() {
  return Meteor.absoluteUrl("images/empty-image.png");
};

Template.registerHelper('emptyImageUrl', emptyImageUrl);


flagUrl = function(lang) {
  return Meteor.absoluteUrl('/images/flags/' + this.lang + '.png');
};

Template.registerHelper('flagUrl', flagUrl);

var pictureStatus = function(user) {
  if (user.profile && user.profile.picture) {
    if (user.profile.picture.origin) {
      if (user.profile.picture.temp) {
        return 'PICTURE_BOTH';
      }
      return 'PICTURE_ORIGIN';
    }
    return 'PICTURE_TEMP';
  }

  return 'PICTURE_DEFAULT';
};

/**
 * return '<img ...>' element to draw user's profile picture
 *
 * @param user
 */
accountPicture = function(user) {
  if (! user) { return ''; }

  var src;
  var status = pictureStatus(user);
  switch (status) {
    case 'PICTURE_BOTH':
    case 'PICTURE_ORIGIN':
      src = "<img src='" + url + "' alt='Profile image' class='img-circle'>";
      break;

    case 'PICTURE_TEMP':
      break;

    default:

  }

};
