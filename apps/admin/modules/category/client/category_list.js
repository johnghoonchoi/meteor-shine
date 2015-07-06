Template.categoriesList.onCreated(function() {
  var instance = this;

  instance.autorun(function() {
    instance.subscribe('categoriesList', {},
      { sort: { seq: 1 }});
  });

  instance.categoriesCount = function() {
    return Counts.get('categoriesListCount');
  };

  instance.categories = function() {
    return Categories.find({}, { sort: { seq: 1 }});
  };
});

Template.categoriesList.onDestroyed(function() {
  this.categoriesCount = null;
  this.categories = null;
});

Template.categoriesList.onRendered(function() {
  this.$('.categories').sortable({
    stop: function(e, ui) {
      // get the dragged html element and the one before
      //   and after it
      var seq,
        el = ui.item.get(0),
        before = ui.item.prev().get(0),
        after = ui.item.next().get(0);

      // Here is the part that blew my mind!
      //  Blaze.getData takes as a parameter an html element
      //    and will return the data context that was bound when
      //    that html element was rendered!
      if (! before) {
        //if it was dragged into the first position grab the
        // next element's data context and subtract one from the rank
        seq = Blaze.getData(after).seq - 1;
      } else if(! after) {
        //if it was dragged into the last position grab the
        //  previous element's data context and add one to the rank
        seq = Blaze.getData(before).seq + 1;
      } else {
        //else take the average of the two ranks of the previous
        // and next elements
        seq = (Blaze.getData(after).seq + Blaze.getData(before).seq)/2;
      }

      //update the dragged Item's rank
      Categories.update({ _id: Blaze.getData(el)._id }, { $set: { seq: seq }});
    }
  });

});

Template.categoriesList.helpers({
  categoriesCount: function() {
    return Template.instance().categoriesCount();
  },

  categories: function() {
    return Template.instance().categories();
  }
});


Template.categoriesListItem.helpers({
  isOn: function() {
    return this.state === 'ON';
  }
});
