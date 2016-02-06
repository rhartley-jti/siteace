Template.website_list.helpers({
	websites: function(){
		return WebsiteSearch.getData({
			transform: function(matchText, regExp) {
				return matchText.replace(regExp, "<b>$&</b>")
			},
			sort: {rank: -1, title: 1}
		}, true);
	}
});

Template.website_list.rendered = function() {
	WebsiteSearch.search("");
}
