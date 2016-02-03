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
		const expectedId = "15";
		const expectedUserId = "1-22";
		let wasAddedToUpVotes = false;
		let wasRemovedFromDownVotes = false;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			expect(query._id).toBe(expectedId);
			if (operation.$addToSet) {
                expect(operation.$addToSet.upVotes).toBe(expectedUserId);
                wasAddedToUpVotes = true;
			}
			if (operation.$pull) {
				expect(operation.$pull.downVotes).toBe(expectedUserId);
				wasRemovedFromDownVotes = true;
			}
		});
		const context = { userId: expectedUserId };

		Websites.methods.upVote._execute(context, expectedId);

		expect(wasAddedToUpVotes).toBe(true);
		expect(wasRemovedFromDownVotes).toBe(true);
	});

	it("up voting throws exception if user is not logged in", function() {
		const context = {};  //No userId in context simulates anonymous user
		expect(function() {
			Websites.methods.upVote._execute(context);
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.upVote.unauthorized]");
	});

	it("allows logged in user to down vote a site", function() {
		const expectedId = "2-238";
		const expectedUserId = "29";
		let wasAddedToDownVotes = false;
		let wasRemovedFromUpVotes = false;
		spyOn(Websites, "update").and.callFake((query, operation) => {
			expect(query._id).toBe(expectedId);
			if (operation.$addToSet) {
				expect(operation.$addToSet.downVotes).toBe(expectedUserId);
				wasAddedToDownVotes = true;
			}
			if (operation.$pull) {
				expect(operation.$pull.upVotes).toBe(expectedUserId);
				wasRemovedFromUpVotes = true;
			}
		});
		const context = { userId: expectedUserId };

		Websites.methods.downVote._execute(context, expectedId);

		expect(wasAddedToDownVotes).toBe(true);
        expect(wasRemovedFromUpVotes).toBe(true);
	});

	it("down voting throws exception if user is not logged in", function() {
		const context = {};  //No userId in context simulates anonymous user
		expect(function() {
			Websites.methods.downVote._execute(context);
		}).toThrowError(Meteor.Error, "Must be logged in to vote [Websites.methods.downVote.unauthorized]");
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