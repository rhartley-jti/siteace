Template.search_form.events({
	"keyup #search-box": _.throttle(function(event) {
		var text = event.target.value.trim();
		WebsiteSearch.search(text);
	}, 200)
});