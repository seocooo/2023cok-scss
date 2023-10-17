import gulp from "gulp";
import path from "path";
import plugins from "gulp-load-plugins";
import dartSass from "sass";
import gulpSass from "gulp-sass";
// css sort setting file import
import cssSortOrder from "./css-sorting.json";
const $sass = gulpSass(dartSass);

const $ = plugins({
	pattern: ["*", "!sass", "!gulp-sass", "!postcss"],
	scope: ["devDependencies"],
});

const onError = (err) => console.log(err);

/*! 폴더 구조 */
const basePath = {
	src: "./pub",
	dist: "./content"
};

const paths = {
	src: {
		html: `${basePath.src}/**/!(_)*.{html,ejs}`,
		scss: `${basePath.src}/scss/**/*.scss`,
		//js: `${basePath.src}/js/**/*.js`,
	},
	dist: {
		css: `${basePath.dist}/css/`,
		//js: `${basePath.dist}/js/`
	}
};

const clean = (cb) => {
	$.del([
		`${basePath.dist}/**/*.html`,
		`${paths.dist.css}**/*`,
		//`${paths.dist.js}**/*`
	]);
	cb();
}

/*! HTML */
const html = () => {
	return gulp
		.src([ paths.src.html ])
		.pipe($.plumber({ errorHandler: onError })) // 오류 항목이 있다면 무시.
		.pipe($.data((file) => {
			const files = path.normalize(path.dirname( file.path.replace(path.resolve(__dirname, basePath.src), '') ) + '/');
			// const num = files.split('/').length-2; // mac os 작업환경 일 경우,
			const num = files.split('\\').length-2; // window os 작업환경 일 경우

			let rootPath = num ? '../'.repeat(num) : './';
			const incPath = rootPath + 'inc';
			rootPath = rootPath.slice(0, -1); // 마지막 문자열인 `/` 제거
			return { rootPath, incPath };
			})
		)
		.pipe($.ejs())
		.pipe($.rename({ extname: ".html" }))
		.pipe($.fileInclude({
			prefix: '@@',
			basepath: `${basePath.src}/inc`, // [@file, @root, path/to/dir]
			context: {
				global: {}
			}
		}))
		.pipe($.cached("html-cache"))
		.pipe($.print.default())            // 수정된 항목 터미널에 출력
		.pipe(gulp.dest(basePath.dist))
		.pipe($.connect.reload());
};

/*! Javascript
const js = () => {
	return gulp
		.src([paths.src.js])
		.pipe($.plumber({ errorHandler: onError }))
		.pipe($.babel({	// Babel 7
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest(paths.dist.js))
		.pipe($.connect.reload());
};*/


/*! Css - 작업시 */
const scss = () => {
	return gulp
		.src([paths.src.scss])
		.pipe($.sourcemaps.init())
		.pipe($sass().on("error", $sass.logError))
		.pipe($.postcss([$.autoprefixer()]))
		.pipe($.sourcemaps.write('./source-mpas'))
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest(paths.dist.css))
		.pipe($.connect.reload());
};
/*! Css - 배포시 */
const buildScss = () => {
	return gulp
		.src([paths.src.scss])
		.pipe($sass().on("error", $sass.logError))
		.pipe($.postcss([$.autoprefixer(),$.cssnano()]))
		.pipe($.postcss([$.postcssSorting(cssSortOrder)]))
		.pipe($.replace("{0%", "{\n0%"))
		.pipe($.replace("{to", "{\nto"))
		.pipe($.replace("}", "}\n"))
		.pipe($.replace("*/", "*/\n"))
		.pipe($.replace(":root{--", ":root {\n--"))
		.pipe($.replace(";--", ";\n--"))
		.pipe($.replace('@charset "UTF-8";', '@charset "utf-8";\n\n'))
		.pipe($.replace(';}', '}'))
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest(paths.dist.css))
		.pipe($.connect.reload());
}
const removeSourceMaps = () => $.del([ `${paths.dist.css}**/*` ]);

/*! 웹서버 셋팅 */
const connect = (cb) => {
	$.connect.server({
		root: basePath.dist,
		host: $.ip.address(),
		port: 11423,
		livereload: true,
	});
	cb();
};
/*! watch */
const watchs = (cb) => {
	gulp.watch([`${basePath.src}/**/*.{html,ejs}`], html);
	gulp.watch([paths.src.scss], scss);
	//gulp.watch([paths.src.js], js);

	cb();
};

const buildCss = gulp.series(removeSourceMaps, buildScss);
const dev = gulp.parallel(html, scss); //const dev = gulp.parallel(html, scss);
const build = gulp.parallel(html, buildCss); //const build = gulp.parallel(html, buildCss, js);
const defaults = gulp.series(dev, watchs, connect);

export { clean, html, scss, build, buildCss }; //export { clean, html, scss, js, build, buildCss };
export default defaults;
