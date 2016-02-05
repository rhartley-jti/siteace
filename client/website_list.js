Meteor.subscribe("websites");

Template.website_list.helpers({
	websites:function(){
		return Websites.find({},{sort: {rank: -1, title: 1}});
	}
});