Websites = new Mongo.Collection("websites");

Websites.methods = {};

Websites.methods.add = new ValidatedMethod({
	name: 'Websites.methods.add',
	validate: new SimpleSchema({
		title: { type: String },
		url: { type: String },
		description: { type: String }
	}).validator({clean: true}),
	run({ title, url, description }) {
		if (!this.userId) {
			throw new Meteor.Error("Websites.methods.add.unauthorized", "Must be logged in to add websites");
		}
		return Websites.insert({
			title: title,
			url: url,
			description: description,
			upVotes: [],
			downVotes: [],
			rank: 0,
			createdBy: this.userId,
			createdOn: new Date()
		});
	}
});

Websites.messages = {
	unauthorized: {
		errorCode: "Websites.methods.unauthorized",
		reason: "Must be logged in to vote"}
	};

Websites.methods.addUpVote = new ValidatedMethod({
	name: 'Websites.methods.addUpVote',
	validate: null,
	run(id) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.unauthorized.errorCode,
				Websites.messages.unauthorized.reason);
		}
		Websites.update({_id: id}, {$addToSet: {upVotes: this.userId}});
	}
});

Websites.methods.removeUpVote = new ValidatedMethod({
	name: 'Websites.methods.removeUpVote',
	validate: null,
	run(id) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.unauthorized.errorCode,
				Websites.messages.unauthorized.reason);
		}
		Websites.update({_id: id}, {$pull: {upVotes: this.userId}});
	}
});

Websites.methods.addDownVote = new ValidatedMethod({
	name: 'Websites.methods.addDownVote',
	validate: null,
	run(id) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.unauthorized.errorCode,
			 	Websites.messages.unauthorized.reason);
		}
		Websites.update({_id: id}, { $addToSet: {downVotes: this.userId}});
	}
});

Websites.methods.removeDownVote = new ValidatedMethod({
	name: 'Websites.methods.removeDownVote',
	validate: null,
	run(id) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.unauthorized.errorCode,
				Websites.messages.unauthorized.reason);
		}
		Websites.update({_id: id}, {$pull: {downVotes: this.userId}});
	}
});

Websites.methods.adjustRank = new ValidatedMethod({
	name: 'Websites.methods.adjustRank',
	validate: null,
	run({id, adjustment}) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.unauthorized.errorCode,
				Websites.messages.unauthorized.reason);
		}
		Websites.update({_id: id}, {$inc: {rank: adjustment}});
	}
});

Websites.methods.getWebsiteData = new ValidatedMethod({
	name: 'Websites.methods.getWebsiteData',
	validate: null,
	run(url) {
		if (!this.isSimulation) {
			if (url.length > 0) {
				try {
					var result = HTTP.call("GET", url, {});
					return parsePage(result.content);
				}
				catch (exception) {
					throw new Meteor.Error(exception.message, exception.reason, exception);
				}
			}
			else {
				throw new Meteor.Error("Invalid Url");
			}
		}
	}
});

function parsePage(html) {
    if (!html) {
        return {};
    }
    else {
    	var $ = cheerio.load(html);
    	var description = $("meta").filter(function() {
    		return $(this).attr("name") === "description";
    	}).attr("content");
		return {title: $('title').text(), description: description}
    }
}
