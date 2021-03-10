const { series, parallel, src, dest } = require('gulp');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

// assim tbm realiza o build, aqui utiliza callback para p gulp saber que a task terminou
// porém as funções não realizam nada neste momento
/* function limparDist(cb) {
    cb();
}

function copiarHTML(cb) {
    cb();
}

function gerarJS(cb) {
    cb();
} */

function limparDist() {
   return del(['dist']);
}

function copiarHTML() {
    /* return src('public/*') */
    // neste caso serão copiados todos os arquivos e hierarquia de diretórios
    return src('public/**/*')
        .pipe(dest('dist'));
}

function gerarJS() {
    return browserify({
        basedir: '.',
        entries: ['src/main.ts']
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(dest('dist'));
}

function gerarJSProducao() {
    return src('dist/app.js')
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(dest('dist'));
}

exports.default = series(
    limparDist,
    parallel(copiarHTML, gerarJS),
    gerarJSProducao
) 
