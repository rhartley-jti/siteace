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
			createdBy: this.userId,
			createdOn: new Date()
		});
	}
});

Websites.messages = {
	upVoteUnauthorized: {
		errorCode: "Websites.methods.upVote.unauthorized",
		reason: "Must be logged in to vote"},
	downVoteUnauthorized: {
		errorCode: "Websites.methods.downVote.unauthorized",
		reason: "Must be logged in to vote"}
	};

Websites.methods.upVote = new ValidatedMethod({
	name: 'Websites.methods.upVote',
	validate: null,
	run(id) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.upVoteUnauthorized.errorCode,
				Websites.messages.upVoteUnauthorized.reason);
		}
		let site = Websites.findOne({_id: id});
		if (valueInArray(site.upVotes, this.userId)) {
			Websites.update({_id: id}, {$pull: {upVotes: this.userId}});
		}
		else {
			Websites.update({_id: id}, {$addToSet: {upVotes: this.userId}, $pull: {downVotes: this.userId}});
		}
	}
});

Websites.methods.downVote = new ValidatedMethod({
	name: 'Websites.methods.downVote',
	validate: null,
	run(id) {
		if (!this.userId) {
			throw new Meteor.Error(Websites.messages.downVoteUnauthorized.errorCode,
			 	Websites.messages.downVoteUnauthorized.reason);
		}
		let site = Websites.findOne({_id: id});
		if (valueInArray(site.downVotes, this.userId)) {
			Websites.update({_id: id}, {$pull: {downVotes: this.userId}});
		}
		else {
			Websites.update({_id: id}, { $addToSet: {downVotes: this.userId}, $pull: {upVotes: this.userId}});
		}
	}
});