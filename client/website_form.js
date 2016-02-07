Template.website_form.onCreated(function() {
	this.errors = new ReactiveDict();
});

Template.website_form.helpers({
	errors(fieldName) {
		return Template.instance().errors.get(fieldName);
	},
	getDisabled() {
		return Session.get("loadingSiteData") ? "disabled" : "";
	},
	isLoadingSiteData() {
		return Session.get("loadingSiteData");
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
   	},
   	"click .js-load-site": function(event) {
   		loadWebSite($("#url").val());
   	},
   	"shown.bs.modal #website_form_dialog": function(event) {
   		$("#url").focus();
   		var url = $("#url").val();
   		if (url) {
   			loadWebSite(url);
   		}
   	},
   	"blur #url": function(event) {
   		loadWebSite($("#url").val());
   	}
});

function loadWebSite(url) {
   	const instance = Template.instance();
	Session.set("loadingSiteData", true);
	Websites.methods.getWebsiteData.call(url, function(error, result) {
		const errors = {
			general: [],
			url: [],
			title: [],
			description: []
		};
		if (!error) {
			$("#title").val(result.title);
			$("#description").val(result.description);
			$("#submitButton").focus();
		}
		else {
			errors.general.push("Error loading site data");
            instance.errors.set(errors);
			setTimeout(function() {
				if ($("#url").val()) {
					$("#title").focus();
				}
				else {
					$("#url").focus();
				}
			}, 500);
			setTimeout(function() {
				instance.errors.set({general: [],url: [],title: [],description: []});
			}, 2000);
		}
		Session.set("loadingSiteData", false);
	});
}