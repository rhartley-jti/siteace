Meteor.subscribe("websites");

Router.configure({
	layoutTemplate: "ApplicationLayout"
});

Router.route('/', function () {
	this.render('navbar', { to: "navbar" });
	this.render('main', { to: "main" });
});

Router.route('/site/:_id', function () {
	this.render('navbar', { to: "navbar" });
	this.render('website_details', { to: "main", data: function() {
  	return Websites.findOne({_id: this.params._id});
  }});
});