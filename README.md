lib-boilerplate
===============

A boilerplate for creating any JavaScript frontend, or frontend+backend, library

## What it handles

- Common JS syntax for building your lib
- Lib loads both in browser and in Node JS
- Supports requirejs
- Loads globally
- Bundles your external dependencies while developing
- Jasmine test suite with watching
- Deploys and minifies your lib

## How it works

#### 1. Name your lib and set version in package.json
This will also be the name of your file. The released library will also include version number in filename.

##### 2. When adding external dependencies use: `npm install whatever --save`
The dependencies map in package.json is used to bundle external dependencies for testing and make sure requirejs loads external dependencies before running your lib.

##### 3. Run `gulp` to start developing
The build will be put into `build/ `. Open the index.html file to test your lib.

##### 4. Run `gulp test` to start the tests
Jasmine will watch any changes and automatically rerun the tests

## Deploying
Run `gulp deploy` to deploy with current name and version number. The compressed and uncompressed version are put into `releases/{version}/`. 

When pushing to git:

###### Commit your changes:
`git commit -am "Made some awesome new changes, now its even awesomer"`

###### Tag the commit if you want to support bower:
`git tag -a v0.0.2 -m "Release version 0.0.2"`

###### Push to GitHub:
`git push origin master --tags`

### Deploying to NPM
Run `npm publish` and your lib is available on NPM. Be sure to change version number when deploying changes.

### Deploying to bower
The bower.json file also needs a name and a version for your lib. It also needs a map of the dependencies. So when using f.ex. `npm install jquery --save`, you also have to use `bower install jquery --save`.

You only need to register your library once at bower: `bower register {myLibName} {myRepoCloneUrl}"`. After that you just have to make sure your `bower.json` file version matches a tag you have comitted to your repo.