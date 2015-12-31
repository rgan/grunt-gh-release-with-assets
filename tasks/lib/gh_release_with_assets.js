var Octokat = require('octokat');
var fs = require('fs');

module.exports = function Releaser() {

    return {

        validate: function(options) {
            var errors = [];
            if (!options.repo) {
                errors.push("Invalid repo in options.");
            }
            if (!options.tag) {
                errors.push("Tag must be provided in options");
            }
            if (!options.owner) {
                errors.push("Owner must be provided in options");
            }
            if (!options.token) {
                errors.push("Token must be provided in options");
            }
            if (!options.assetfilepath) {
                errors.push("assetfilepath not provided");
            }
            try {
                fs.accessSync(options.assetfilepath, fs.R_OK);
            } catch (ex) {
                errors.push("assetfilepath is not readable");
            }
            return errors;
        },

        release_with_asset: function (options, doneFn) {
            var errors = this.validate(options);
            if (errors.length > 0) {
                throw new Error(errors.join(","));
            }
            var params = {
                "tag_name": options.tag, // tag should exist
                "name": options.name ? options.name : options.tag,
                "body": options.description,
                "draft": false,
                "prerelease": false
            };
            var octo = new Octokat({token: options.token});
            var contents = fs.readFileSync(options.assetfilepath);
            octo.repos(options.owner, options.repo).releases.create(params)
                .then(function (release) {
                    return release.upload(options.assetfilepath.split('/').pop(), 'application/octet-stream', contents)
                        .then(function (resp) {
                            doneFn();
                        }, function (reason) {
                            doneFn(new Error(reason));
                        });
                }, function (reason) {
                    doneFn(reason);
                });
        }
    }
};