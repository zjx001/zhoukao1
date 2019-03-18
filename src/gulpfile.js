const gulp = require('gulp')
const Sass = require('gulp-sass')
const mincss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const webserver = require('gulp-webserver')
const fs = require('fs')
const path = require('path')
const url = require('url')

//编译sass
gulp.task("sass", () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(Sass())
        .pipe(gulp.dest('./src/css'))
})

//监听编译sass
gulp.task("watch", () => {
    return gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
})

//压缩css
gulp.task("devcss", () => {
    return gulp.src('./src/scss/**/*.css')
        .pipe(mincss())
        .pipe(gulp.dest('./list/css'))
})

//压缩js
gulp.task("devjs", () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./list/js'))
})

//起服务
gulp.task("server", () => {
    return gulp.src('./src')
        .pipe(webserver({
            port: 8080,
            livereload: true,
            middleware: function(req, res) {
                if (req.url === '/favicon.ico') {
                    return res.end()
                }
                let pathname = url.parse(req.url, true)
                if (pathname === '/api') {
                    res.end()
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname
                    const file = fs.readFileSync('./src/index.html')
                    res.end(file)
                }
            }
        }))

})

//监听css，js，watch，server
gulp.task('default', gulp.parallel('watch', 'devcss', 'devjs', 'server'))