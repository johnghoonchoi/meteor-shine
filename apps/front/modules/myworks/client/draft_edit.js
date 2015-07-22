Template.draftEdit.onCreated(function() {
  var instance = this;
  this.data = Template.currentData();

  instance.data.draft = function() {
    return PostDrafts.findOne({ _id: instance.data.draftId });
  };

  instance.data.mode = 'draft';
});

Template.draftEdit.onRendered(function() {
  console.log('draftEdit this.data: ', this.data);
});
