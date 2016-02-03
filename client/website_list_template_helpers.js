Meteor.subscribe("websites");

Template.website_list.helpers({
	websites:function(){
		return Websites.find({});
	}
});