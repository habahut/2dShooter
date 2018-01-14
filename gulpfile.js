var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
        pages: ['html/**']
};

var watchedBrowserify = watchify(browserify({
        basedir: '.',
        debug: true,
            // need to include all the files we'll want here i think....
            // not sure how that will work with bundle.js if there are multiple files...
            // do mutliple entries end up in the same bundle? or do they make multiple somehow?
         entries: ['ts/test.ts'],
        cache: {},
        packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
        return gulp.src(paths.pages)
            .pipe(gulp.dest("dist"));
});

function bundle() {
        return watchedBrowserify
            .bundle()
            .pipe(source('bundle.js'))
            .pipe(gulp.dest("dist/js"));
}

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
