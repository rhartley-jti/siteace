describe('websites', function() {
	it('allow logged in user to create with url and description', function() {
		spyOn(Websites, "insert").and.callFake(site => {
			expect(site.title).toBe("TestTitle");
			expect(site.url).toBe("TestUrl");
			expect(site.description).toBe("TestDescription");
			expect(site.upVotes).toEqual([]);
			expect(site.downVotes).toEqual([]);
			expect(site.createdBy).toBe("2");
			expect(site.createdOn).not.toBeUndefined();
			return "1";
		});
		var context = { userId: "2" };

		var result = Websites.methods.add._execute(context, {title: "TestTitle", url: "TestUrl", description: "TestDescription"});

		expect(result).toBe("1");
	});

	it('add fails validation when missing url', function() {
		expectValidationErrorOnSite({title: "TestTitle", description: "Test Description"}, URL_VALIDATION_MESSAGE);
	});

	it("add fails validation when url is empty string", function() {
		expectValidationErrorOnSite({title: "TestTitle", url: "", description: "Test Description"}, URL_VALIDATION_MESSAGE);
	});

	it("add fails validation when missing description", function() {
		expectValidationErrorOnSite({title: "TestTitle", url: "TestURL"}, DESCRIPTION_VALIDATION_MESSAGE);
	});

	it("add fails validation when description is empty string", function() {
		expectValidationErrorOnSite({title: "TestTitle", url: "TestURL", description: ""}, DESCRIPTION_VALIDATION_MESSAGE);
	});

	it("add fails validation when missing title", function() {
		expectValidationErrorOnSite({url: "TestUrl", description: "TestDescription"}, TITLE_VALIDATION_MESSAGE);
	});

	it("add fails validation when title is empty string", function() {
		expectValidationErrorOnSite({title:"", url:"TestURL", description:"Description"}, TITLE_VALIDATION_MESSAGE);
	});

	it("allows logged in user to up vote a site", function() {
		const websiteId = "15";
		const userId = "1-22";
		let wasAddedToUpVotes = false;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			wasAddedToUpVotes = query._id === websiteId
				&& operation.$addToSet
				&& operation.$addToSet.upVotes === userId;
		});
		const context = { userId: userId };

		Websites.methods.addUpVote._execute(context, websiteId);

		expect(wasAddedToUpVotes).toBe(true);
	});

	it("adding up vote throws exception if user is not logged in", function() {
		const context = {};  //No userId in context simulates anonymous user
		expect(function() {
			Websites.methods.addUpVote._execute(context);
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.unauthorized]");
	});

	it("allows logged in user to remove up vote on a site", function() {
		const websiteId = "29";
		const userId = "15";
		let wasRemovedFromUpVotes = false;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			wasRemovedFromUpVotes = query._id === websiteId
				&& operation.$pull
				&& operation.$pull.upVotes === userId;
		});
		const context = { userId: userId }

		Websites.methods.removeUpVote._execute(context, websiteId);

		expect(wasRemovedFromUpVotes).toBe(true);
	});

	it("removing up vote throws exception if user is not logged in", function() {
		const context = {};  //No userId in context simulates anonymous user
		expect(function() {
			Websites.methods.removeUpVote._execute(context);
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.unauthorized]");
	});

	it("allows logged in user to down vote a site", function() {
		const websiteId = "2-238";
		const userId = "29";
		let wasAddedToDownVotes = false;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			wasAddedToDownVotes = query._id === websiteId
				&& operation.$addToSet
				&& operation.$addToSet.downVotes === userId;
		});
		const context = { userId: userId };

		Websites.methods.addDownVote._execute(context, websiteId);

		expect(wasAddedToDownVotes).toBe(true);
	});

	it("down voting throws exception if user is not logged in", function() {
		const context = {};  //No userId in context simulates anonymous user
		expect(function() {
			Websites.methods.addDownVote._execute(context);
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.unauthorized]");
	});

	it("allows logged in user to remove down vote on a site", function() {
		const websiteId = "18";
		const userId = "2993";
		let wasRemovedFromDownVotes = false;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			wasRemovedFromDownVotes = query._id === websiteId
							&& operation.$pull
							&& operation.$pull.downVotes === userId;
		});
		const context = { userId: userId }

		Websites.methods.removeDownVote._execute(context, websiteId);

		expect(wasRemovedFromDownVotes).toBe(true);
	});

	it("removing down vote throws exception if user is not logged in", function() {
		const context = {};  //No userId in context simulates anonymous user
		expect(function() {
			Websites.methods.removeDownVote._execute(context);
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.unauthorized]");
	});

	it("allows logged in user to adjust rank", function() {
		const websiteId = "299";
		const userId = "212";
		let rankAdjustment = 0;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			if (query._id === websiteId && operation.$inc && operation.$inc.rank) {
				rankAdjustment = operation.$inc.rank;
			}
		});
		const context = { userId: userId };

		Websites.methods.adjustRank._execute(context, {id: websiteId, adjustment: -3});

		expect(rankAdjustment).toBe(-3);
	});

	it("adjusting rank throws exception if user is not logged in", function() {
		const context = {};
		expect(function() {
			Websites.methods.adjustRank._execute(context, {id: 1, adjustment: 2});
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.unauthorized]");
	});

	const URL_VALIDATION_MESSAGE = "Url is required [validation-error]";
	const DESCRIPTION_VALIDATION_MESSAGE = "Description is required [validation-error]";
	const TITLE_VALIDATION_MESSAGE = "Title is required [validation-error]";

	function expectValidationErrorOnSite(siteObj, expectedErrorMessage) {
		expect(function () {
			Websites.methods.add.validate(siteObj);
		}).toThrowError(Meteor.Error, expectedErrorMessage);
	}
});