Template.website_item.helpers({
	totalVoteCount: function() {
		return this.upVotes.length - this.downVotes.length;
	},
	hasUpVotes: function() {
		return this.upVotes.length > 0;
	},
	upVoteCount: function() {
		return this.upVotes.length;
	},
	hasDownVotes: function() {
		return this.downVotes.length > 0;
	},
	downVoteCount: function() {
		return this.downVotes.length;
	},
	iUpVoted: function() {
		return valueInArray(this.upVotes, Meteor.userId());
	},
	iDownVoted: function() {
		return valueInArray(this.downVotes, Meteor.userId());
	},
	addedDate: function() {
		return moment(this.createdOn).format("LL");
	}
});

Template.website_item.events({
	"click .js-upvote":function(event){
		Websites.methods.upVote.call(this._id, err => {
			if (err) {
				if (err.error === Websites.messages.upVoteUnauthorized.errorCode) {
					console.log(err.reason);
				}
			}
		});
		return false;// prevent the button from reloading the page
	},
	"click .js-downvote":function(event){
		Websites.methods.downVote.call(this._id, err => {
			if (err) {
				if (err.error === Websites.messages.downVoteUnauthorized.errorCode) {
					console.log(err.reason);
				}
			}
		});
		return false;// prevent the button from reloading the page
	}
});
