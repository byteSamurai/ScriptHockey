/**
 * Created by: Alfred Feldmeyer
 * Date: 19.04.2015
 * Time: 18:27
 */
/**
 * ACHTUNG: BEI REMOTE_SERVER AN PORT WEITERLEITUNG DENKEN MITTELS
 * netsh interface portproxy add v4tov4 listenport=35729 listenaddress=127.0.0.1 connectport=35729 connectaddress=192.168.0.254
 */

//Configuration
var jsOutput = ['./build/**/*.js'];
var cssFiles = ['./css/**/*.css'];
var htmlFiles = ['./**/*.html'];
var jsBrowserifyFiles = ['./src/main.js', 'src/**/*.js'];
/**
 * Setz produktiv-Umgebung
 * zu setzen bei Aufruf
 * <pre>
 *     PRODUCTION=1 gulp
 */
var production = process.env.PRODUCTION == 1;

//Required by Gulp
var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    through2 = require('through2'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    run = require('gulp-run');
/**
 * Fügt module zusammen
 */
gulp.task('browserify', function() {
    return gulp.src(jsBrowserifyFiles[0])
        .pipe(through2.obj(function (file, enc, next) {
            browserify(file.path, {debug: !production})
                .transform(babelify)
                .bundle(function (err, res) {
                    if (err) {
                        return next(err);
                    }
                    file.contents = res;
                    next(null, file);
                });
        }))
        .on('error', function (err) {
            console.log("\033[41m   " + err.message + "   \033[49m");
            this.emit("end");
        })
        .pipe(rename("main.dist.js"))
        .pipe(gulpif(production, uglify({preserveComments: "some"})))
        .pipe(gulp.dest("./build"));
});

/**
 * Startet Server
 */
gulp.task("server", function () {
    require("./app");
});

//Refresh
var refresh = function (f) {
    livereload.changed(f);
};


/**
 * Watchers
 */
gulp.task('watch', ["server"], function () {
    livereload.listen({
        start: true,
        quiet:false
    });

    //Starte Compass
    run("compass watch").exec();

    // Watch any files in dist/, reload on change
    gulp.watch(cssFiles, refresh);
    gulp.watch(htmlFiles, refresh);
    gulp.watch(jsOutput, refresh);
    gulp.watch(jsBrowserifyFiles, ['browserify']);

});

/**
 * Default-task:
 */
gulp.task("default",["browserify"]);
