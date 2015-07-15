Template.postViewTemp.onDestroyed(function() {
	$('#contentWrapper').empty();
});

Template.postViewTemp.onRendered(function() {
	this.data.insertContent(this.data.changeMode.get());
});

Template.postViewTemp.helpers({
	titleText () {
		return Template.instance().data.titleText();
	},

	titleAttrs (editable) {
		return Template.instance().data.titleAttrs(editable);
	}
});



Template.postEditTemp.onDestroyed(function() {
	$('#contentWrapper').empty();
});

Template.postEditTemp.onRendered(function() {
	this.data.insertContent(this.data.changeMode.get());
	this.data.setPreview();
});

Template.postEditTemp.helpers({
	titleText () {
		return Template.instance().data.titleText();
	},

	titleAttrs (editable) {
		return Template.instance().data.titleAttrs(editable);
	},

	reactiveTextarea () {
		return Template.instance().data.reactiveTextarea.get();
	}

});

Template.postEditTemp.events({
	'keyup .textarea-block, focus .textarea-block' (e, instance) {
		instance.data.setPreview();

		//console.log('keydown or focus..: ');
	}
});