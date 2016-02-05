Template.added_date.helpers({
	addedDate: function() {
		return moment(this.createdOn).format("LLL");
	}
});