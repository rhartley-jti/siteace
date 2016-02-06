Template.website_form.onCreated(function() {
	this.errors = new ReactiveDict();
});

Template.website_form.helpers({
	errors(fieldName) {
		return Template.instance().errors.get(fieldName);
	}
});

Template.website_form.events({
	"click .js-toggle-website-form": event => {
   		$("#website_form").toggle('slow');
   	},
   	"submit .js-save-website-form": event => {
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
   				$("#website_form").toggle('slow');
   				event.target.reset();
   				WebsiteSearch.search($("#search-box").val());
   			}
   		});


   		return false;// stop the form submit from reloading the page
   	}
});