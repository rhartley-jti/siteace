Template.search_form.helpers({
	hasSearchText: function() {
		return Session.get("hasSearchText");
	}
});

Template.search_form.events({
	"keyup #search-box": _.throttle(function(event) {
		var text = event.target.value.trim();
		Session.set("hasSearchText", text.length > 0);
		WebsiteSearch.search(text);
	}, 200),
	"click .js-search-clear": function(event) {
		$("#search-box").val("");
		Session.set("hasSearchText", false);
		WebsiteSearch.search("");
	}
});