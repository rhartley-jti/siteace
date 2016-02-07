Template.navbar.helpers({
	canAddSite: function() {
		return Meteor.userId();
	}
});

Template.navbar.events({
	"submit .js-add-site-submit": function(event) {
		$("#url").val($("#navUrl").val());
		$("#website_form_dialog").modal("show");
		return false;
	}
});

