Template.website_form.onCreated(function() {
	this.errors = new ReactiveDict();
});

Template.website_form.helpers({
	errors(fieldName) {
		return Template.instance().errors.get(fieldName);
	},
	isLoadingSiteData() {
		return true;
//		return Session.get("loadingSiteData");
	},
	siteUrl() {
//		return Session.get("siteUrl");
		return "http://youtube.com";
	},
	siteData() {
//		return Session.get("siteData");
		return {title: "Test Title", description: "Test description"};
	}
});

Template.website_form.events({
	"click .js-submit-form": function(event) {
		$("#add_website_form").submit();
	},
	"click .js-cancel-form": function(event) {
		Template.instance().errors.clear();
		$("#add_website_form").trigger('reset');
	},
   	"submit .js-save-website-form": function(event) {
   		const instance = Template.instance();
		const site = {
			title: event.target.title.value,
			url: event.target.url.value,
			description: event.target.description.value
		};
		var errors = {};

   		Websites.methods.add.call(site, (err) => {
   			const errors = {
				general: [],
				url: [],
				title: [],
				description: []
			};
   			if (err) {
   				if (err.error === "Websites.methods.add.unauthorized") {
   					errors.general.push(err.reason);
   				}
   				else if (err.error === "validation-error") {
					err.details.forEach((fieldError) => {
						errors[fieldError.name].push(fieldError.type);
					});
   				}
   				else {
   					console.log("Unknown error submitting form");
   					console.log(err);
   				}
   				instance.errors.set(errors);
   			}
   			else {
   				$("#website_form_dialog").modal('hide');
   				event.target.reset();
   				WebsiteSearch.search($("#search-box").val());
   			}
   		});


   		return false;// stop the form submit from reloading the page
   	}
});