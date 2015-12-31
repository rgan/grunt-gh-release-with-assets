var expect = require('chai').expect;
var Octokat = require('octokat');
var Releaser = require('../tasks/lib/gh_release_with_assets.js');

describe('releaser', function() {

    var releaser_instance = null;
    beforeEach(function () {
        releaser_instance = new Releaser();
    });

    afterEach(function () {
    });

    it('should have error if repo is not provided', function() {
        var errors = releaser_instance.validate({});
        expect(errors).to.include("Invalid repo in options.");
    });

    it('should have error if owner is not provided', function() {
        var errors = releaser_instance.validate({});
        expect(errors).to.include("Owner must be provided in options");
    });

    it('should have error if token is not provided', function() {
        var errors = releaser_instance.validate({});
        expect(errors).to.include("Token must be provided in options");
    });

    it('should have error if tag is not provided', function() {
        var errors = releaser_instance.validate({});
        expect(errors).to.include("Tag must be provided in options");
    });

    it('should have error if assetfilepath is not provided', function() {
        var errors = releaser_instance.validate({});
        expect(errors).to.include("assetfilepath not provided");
    });

    it('should have error if assetfilepath is not readable', function() {
        var errors = releaser_instance.validate({assetfilepath: "doesnotexist.zip"});
        expect(errors).to.include("assetfilepath is not readable");
    });

    it('should default prerelease to false', function() {
        options = {}
        var errors = releaser_instance.validate(options);
        expect(options.prerelease).to.be.false;
    });

    it('should set prerelease to as specified', function() {
        options = {prerelease: true}
        var errors = releaser_instance.validate(options);
        expect(options.prerelease).to.be.true;
    });

    it('should set name as specified', function() {
        options = {name: "test"}
        var errors = releaser_instance.validate(options);
        expect(options.name).to.equal("test");
    });

    it('should default name to tag', function() {
        options = {tag: "1.0.1-test"}
        var errors = releaser_instance.validate(options);
        expect(options.name).to.equal("1.0.1-test");
    });

    it('should not have error if everything is provided', function() {
        var errors = releaser_instance.validate(
            {tag: "tag", owner: "rgan", repo: "grunt-gh-release-with-assets",
             token: "token", assetfilepath: "test/test.zip"});
        expect(errors).to.deep.equal([]);
    });

    it('should raise error when trying to create a release without asset file', function() {
        options = {
            owner: "rgan",
            repo: "grunt-gh-release-with-assets",
            token: "abc",
            tag: "0.0.0-test"
        };
        expect((function() { new Releaser().release_with_asset(options)} )).to.throw(Error);
    });

    it('should create a release with asset file', function(done) {
        options = {
            owner: "rgan",
            repo: "grunt-gh-release-with-assets",
            token: process.env.GITHUB_TOKEN,
            tag: "0.0.1-test",
            assetfilepath: "test/test.zip",
            prerelease: true
        };

        new Releaser().release_with_asset(options, function(error) {
            if (error) {
                done(error);
            }
            var octo = new Octokat({token: options.token});
            octo.repos(options.owner, options.repo).releases.tags(options.tag).fetch()
                .then(function(release) {
                    expect(release.assets.length).to.equal(1);
                    expect(release.assets[0].name).to.equal("test.zip");
                    release.remove().then(function() {
                        done();
                    }, done);
                }, done);
        });
    })
});