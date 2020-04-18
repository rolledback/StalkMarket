const gulp = require("gulp");

function copyGyp() {
    return gulp.src("*.gyp")
        .pipe(gulp.dest("dist/"));
}

function copyPkgJson() {
    return gulp.src("package.json")
        .pipe(gulp.dest("dist/"));
}

function copyCpp() {
    return gulp.src("src/cpp/*.+(cpp|h)")
        .pipe(gulp.dest("dist/src/cpp/"));
}

function copyScript() {
    return gulp.src("out/src/ts/*.+(js|d.ts)")
        .pipe(gulp.dest("dist/src/js/"));
}

function copyReadme() {
    return gulp.src("README.MD")
        .pipe(gulp.dest("dist/"));
}

exports.pack = gulp.parallel(
    copyGyp,
    copyPkgJson,
    copyReadme,
    copyCpp,
    copyScript
);
