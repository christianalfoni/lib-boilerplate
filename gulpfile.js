var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var packageJson = require('./package.json');
var shell = require('gulp-shell');

// Create array of dependencies
var deps = Object.keys(packageJson.dependencies || []).map(function (key) {
  return key;
});

// Used in requirejs fix
var depsStringArray = deps.map(function (dep) {
  return '"' + dep + '"';
});

// The task that handles both development and deployment
var runBrowserifyTask = function (options) {

  // Add external dependencies to their own bundle, for testing
  // purposes
  if (options.dev) {
    var vendorBundler = browserify({
      debug: true,
      require: deps
    });
  }

  // This bundle is for our application
  var bundler = browserify({
    debug: options.debug, // Need that sourcemapping
    entries: ['./src/main.js'],
    standalone: packageJson.name,
    // These options are just for Watchify
    cache: {}, packageCache: {}, fullPaths: true
  });

  // Add external dependencies to avoid including them in the build
  deps.forEach(function (dep) {
    bundler.external(dep);
  });

  // The actual rebundle process
  var rebundle = function () {
    var start = Date.now();
    bundler.bundle()
      .on('error', gutil.log)
      .pipe(source(options.name))
      .pipe(gulpif(options.uglify, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {

        // Fix for requirejs
        var fs = require('fs');
        var file = fs.readFileSync(options.dest + '/' + options.name).toString();
        file = file.replace('define([],e)', 'define([' + depsStringArray.join(',') + '],e)');
        fs.writeFileSync(options.dest + '/' + options.name, file);

        console.log('Built in ' + (Date.now() - start) + 'ms');

      }));

  };

  // Fire up Watchify when developing and run the
  // vendor bundler
  if (options.dev) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);

    vendorBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('vendors.js'))
      .pipe(gulp.dest(options.dest));   
  }

  return rebundle();

};

gulp.task('default', function () {

  runBrowserifyTask({
    dev: true,
    dest: './build',
    uglify: false,
    debug: true,
    name: 'main.js'
  });

});

gulp.task('deploy', function () {

  runBrowserifyTask({
    dev: false,
    dest: './releases/' + packageJson.version,
    uglify: true,
    debug: false,
    name: packageJson.name + '-' + packageJson.version + '.min.js'
  });

  runBrowserifyTask({
    dev: false,
    dest: './releases/' + packageJson.version,
    uglify: false,
    debug: false,
    name: packageJson.name + '-' + packageJson.version + '.js'
  });

});

gulp.task('test', shell.task([
    './node_modules/.bin/jasmine-node ./specs --autotest --watch ./src --color'
]));