Template.navbar.helpers({
	canAddSite: function() {
		return Meteor.userId();
	}
});

Template.navbar.events({
	"submit .js-add-site-submit": function(event) {
		var url = $("#navUrl").val();
		//Session.set("siteUrl", $("#navUrl").val());
		//Session.set("loadingSiteData", true);
		$("#website_form_dialog").modal("show");
		Websites.methods.getWebsiteData.call(url, function(error, result) {
			if (!error) {
				console.log(result);
				//Session.set("siteData", result)
			}
			else {
				console.log(error);
			}
			//Session.set("loadingSiteData", false);
		});

		return false;
	}
});

