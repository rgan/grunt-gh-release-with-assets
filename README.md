# grunt-gh-release-with-assets

> Create releases with an asset on Github.

## Getting Started
This plugin requires Grunt `~0.4.5`

```shell
npm install grunt-gh-release-with-assets --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gh-release-with-assets');
```

Run the task with ```grunt gh_release_with_asset```

### Options

#### options.token
Type: `String`

The github token for authentication.

#### options.repo
Type: `String`

The name of the git repo (e.g. grunt-gh-release-with-assets)

#### options.owner
Type: `String`

The owner of the git repo.

#### options.assetfilepath
Type: `String`

The paths to file to attach to the release, relative to your grunt root.

#### options.tag
Type: `String`

The git tag for which to create the release.

### Usage Examples

```js
grunt.initConfig({
  gh_release_with_asset: {
    options: {
        token: process.env.GITHUB_TOKEN,
        repo: 'grunt-gh-release-with-assets',
        owner: 'rgan',
        assetfilepath: 'dist.zip',
        tag:  '0.1.0'
    },
  },
});
```
