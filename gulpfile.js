const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;

gulp.task('sass', function(){
    return gulp.src('src/stylesheets/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('static'))
});

gulp.task('watch', function() {

    gulp.watch('src/stylesheets/style.scss', ['sass']);

    let b = browserify({
        entries: ['src/app.js'],
        cache: {}, packageCache: {},
        plugin: ['watchify']
    });

    b.on('update', makeBundle)

    function makeBundle() { 
        
        b.transform('babelify', { presets: 'react' })
        .bundle()
        .on('error', (err) => {
            console.error(err.message);
            console.error(err.codeFrame);
        }) 
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('static/'));
    }
    makeBundle();
    return b;
});

gulp.task('build', () => {
    process.env.NODE_ENV = 'production';
    browserify({
        entries: ['src/app.js'],
        cache: {}, packageCache: {},
    })
    .transform('babelify', { presets: 'react' })
    .bundle()
    .on('error', (err) => {
            console.error(err.message);
            console.error(err.codeFrame);
        })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('static/')); 
});

gulp.task("uglify", function () {
    
    return gulp.src("static/bundle.js")
        .pipe(uglify())
        .pipe(gulp.dest("static/"));
});