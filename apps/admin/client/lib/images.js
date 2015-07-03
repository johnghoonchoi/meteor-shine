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
