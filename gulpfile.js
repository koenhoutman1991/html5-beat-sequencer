var gulp 	= require('gulp'),
	nodemon = require('gulp-nodemon'),
	sass 	= require('gulp-ruby-sass');

gulp.task('css', function() {
	return sass('./scss/app.scss')
		.pipe(gulp.dest('./assets/css'));
});

gulp.task('boot', function() {
	nodemon({
		script: 'server.js',
		ext: 'js',
		ignore: 'assets/*'
	});
});

gulp.task('watch', function() {
	gulp.watch('./scss/**/*.scss', ['css']);
});

gulp.task('default', ['css','boot','watch']);
