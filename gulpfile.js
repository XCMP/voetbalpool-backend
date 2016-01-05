
// USED MODULES
var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    handlebars = require('gulp-handlebars'),
    livereload = require('gulp-livereload'),
    shell      = require('gulp-shell'),
    war        = require('gulp-war'),
    zip        = require('gulp-zip'),
    del        = require('del');

// CONSTANTS
var paths = {
  scripts: {
    libs: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/underscore/underscore.js',
      'node_modules/backbone/backbone.js',
      'node_modules/handlebars/dist/handlebars.runtime.js'
    ],
    app: [
      'src/app/voetbalpool-app.js',
      'src/app/common/utils.js',
      'src/app/common/validation.js',
      'src/app/models/voetbalpool.js',
      'src/app/collections/poolplayers.js',
      'src/app/views/menu.js',
      'src/app/views/modal_window.js',
      'src/app/views/addpoolplayer_view.js',
      'src/app/views/poolplayers_view.js',
      'src/app/router/router.js'
    ]
  },
  styles: 'src/css/*.css',
  templates: 'src/hbs/*.hbs',
  images: 'src/images/*.*'
};

// TASKS
gulp.task('clean', function() {
  del(['dist']);
});

gulp.task('clean-war', function() {
  del(['war']);
});

gulp.task('base', function() {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

gulp.task('scripts-libs', function() {
  return gulp.src(paths.scripts.libs)
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-app', function() {
  return gulp.src(paths.scripts.app)
    //.pipe(uglify())
    .pipe(concat('voetbalpool-app.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src(paths.styles)
    .pipe(concat('voetbalpool-app.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('dist/images'))
    .pipe(livereload());
});

gulp.task('templates', function() {
  /* use shell to compile, so we can use latest version of Handlebars */
  return gulp.src('')
    .pipe(shell([
      'rm -rf dist/js/templates',
      'mkdir -p dist/js/templates',
      'handlebars src/hbs/*.hbs -f dist/js/templates/hbs-templates.js'
    ]))
    .pipe(livereload());
});

gulp.task('war', ['build', 'clean-war'], function () {
    gulp.src(['dist/**/*.*'])
        .pipe(war({
            welcome: 'index.html',
            displayName: 'voetbalpool',
        }))
        .pipe(zip('voetbalpool.war'))
        .pipe(gulp.dest("war"));
 });

gulp.task('build', ['clean', 'base', 'scripts-libs', 'scripts-app', 'styles', 'images', 'templates'], function() {
  console.log('Build done.')
});

gulp.task('watch', ['build'], function() {
  livereload.listen();
  gulp.watch(paths.scripts.lib, ['scripts-libs']);
  gulp.watch(paths.scripts.app, ['scripts-app']);
  gulp.watch(['index.html'], ['base']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.images, ['images']);
});

// DEFAULT TASK
gulp.task('default', ['watch'], function(){
  console.log('Watching...');
});


