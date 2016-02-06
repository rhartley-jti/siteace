Template.navbar.events({
	"click .js-add-website": function(event) {
		$("#url").val($("#navUrl").val());
		$("#website_form_dialog").modal("show");
	}
});