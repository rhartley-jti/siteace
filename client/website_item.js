Template.website_item.helpers({
	votes: function() {
		return this.upVotes.length - this.downVotes.length;
	}
});

Template.website_item.events({
	"click .js-upvote":function(event){
		Websites.methods.upVote.call(this._id);
		return false;// prevent the button from reloading the page
	},
	"click .js-downvote":function(event){
		Websites.methods.downVote.call(this._id);
		return false;// prevent the button from reloading the page
	}
});
