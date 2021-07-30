// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
	config.set({
		basePath: 'src',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-junit-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, './coverage'),
			reports: ['lcov', 'text-summary'],
			fixWebpackSourcePaths: true,
			'report-config': {
				// Put all HTML files in the ./coverage/html directory
				html: {
					subdir: 'html'
				}
			}
		},
		junitReporter: {
			outputDir: require('path').join(__dirname, './test-report')
		},
		reporters: ['progress', 'kjhtml', 'junit', 'coverage-istanbul'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['ChromeHeadless'],
		singleRun: false,
		restartOnFileChange: true
	});
};
