// Karma configuration
// Generated on Fri May 15 2015 16:18:39 GMT+0200 (Mitteleuropäische Sommerzeit)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify','jasmine','sinon'],


        // list of files / patterns to load in the browser
        files: [
            'public/vendors/jquery-2.1.3.min.js',
            'public/vendors/jquery_throttle-debounce.js',
            'public/css/basic.css',
            //'public/javascripts/src/**/*.js',
            'test/**/*Spec.js'
        ],


        // list of files to exclude
        exclude: [
            'public/javascripts/src/main.js',
            'public/vendors/socket.io-1.2.0.js',
            'public/javascripts/**/__*'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'public/javascripts/src/**/*.js':["browserify"],
            'test/**/*Spec.js':["browserify"]
        },
        browserify: {
            debug: true,
            transform: [ 'babelify' ]
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
