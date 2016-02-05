Template.website_item.helpers({
	upVoteCount: function() {
		return this.upVotes.length;
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
		return moment(this.createdOn).format("LLL");
	}
});

Template.website_item.events({
	"click .js-upvote": function(event) {
		let adjustment = 0;
		if (valueInArray(this.upVotes, Meteor.userId())) {
			Websites.methods.removeUpVote.call(this._id);
			adjustment--;
		}
		else {
			if (valueInArray(this.downVotes, Meteor.userId())) {
				Websites.methods.removeDownVote.call(this._id);
				adjustment++;
			}

			Websites.methods.addUpVote.call(this._id);
			adjustment++;
		}

		Websites.methods.adjustRank.call({id: this._id, adjustment: adjustment});

		return false;// prevent the button from reloading the page
	},
	"click .js-downvote":function(event){
		let adjustment = 0;
		if (valueInArray(this.downVotes, Meteor.userId())) {
			Websites.methods.removeDownVote.call(this._id);
			adjustment++;
		}
		else {
			if (valueInArray(this.upVotes, Meteor.userId())) {
				Websites.methods.removeUpVote.call(this._id);
				adjustment--;
			}

			Websites.methods.addDownVote.call(this._id);
			adjustment--;
		}

		Websites.methods.adjustRank.call({id: this._id, adjustment: adjustment});

		return false;// prevent the button from reloading the page
	}
});
