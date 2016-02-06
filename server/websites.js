Meteor.publish("websites", function() {
	return Websites.find();
});

SearchSource.defineSource('websites', function(searchText, options) {
	var options = {sort: {rank: -1, title: 1}};

	if (searchText) {
		var regExp = buildRegExp(searchText);
		var selector = {$or: [{title: regExp}, {description: regExp}]};
		return Websites.find(selector, options).fetch();
	}
	else {
		return Websites.find({}, options).fetch();
	}
});

function buildRegExp(searchText) {
	var words = searchText.trim().split(/[ \-\:]+/);
	var exps = _.map(words, function(word) {
		return "(?=.*" + word + ")";
	});
	var fullExp = exps.join('') + ".+";
	return new RegExp(fullExp, "i");
}
