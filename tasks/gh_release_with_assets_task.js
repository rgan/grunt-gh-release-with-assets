'use strict';

var Releaser = require('./lib/gh_release_with_assets.js');

module.exports = function (grunt) {

    grunt.registerTask('gh_release_with_asset', function(args) {
        var done = this.async();
        var options = this.options();
        grunt.log.ok("Using tag for release:" + options.tag);
        new Releaser().release_with_asset(options, done);
    });
};