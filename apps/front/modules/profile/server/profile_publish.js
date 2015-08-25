Meteor.publish("profileView", function () {
  return Meteor.users.find({_id: this.userId},
        {fields: {'profile': 1}});
});


// Possibly publish more user data in order to be able to show add/remove
// buttons for 3rd-party services

// If autopublish is on, publish these user fields.
// Login service packages (eg accounts-google) add to these by calling Accounts.
// addAutopublishFields Notably, this isn't implemented with
// multiple publishes since DDP only merges only across top-level fields,
// not subfields (such as 'services.facebook.accessToken')

// Publish additional current user info to get the list of registered services
// XXX TODO: use
// Accounts.addAutopublishFields({
//   forLoggedInUser: ['services.facebook'],
//   forOtherUsers: [],
// })


// ...adds only user.services.*.id
Meteor.publish("userRegisteredServices", function() {
  var userId = this.userId;
  //Meteor._sleepForMs(2000);
  return Meteor.users.find(userId, {fields: {services: 1}});

  /*
   if (userId) {
   var user = Meteor.users.findOne(userId);
   var services_id = _.chain(user.services)
   .keys()
   .reject(function(service) {return service === "resume";})
   .map(function(service) {return "services." + service + ".id";})
   .value();

   var projection = {};
   _.each(services_id, function(key) { projection[key] = 1; });
   return Meteor.users.find(userId, {fields: projection});
   }

   */
});
