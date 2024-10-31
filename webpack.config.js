const { Compilation, sources } = require( 'webpack' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const _ = require( 'lodash' );
const path = require( 'path' );
const fs = require( 'fs' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const RemovePlugin = require( 'remove-files-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' ).default
	? require( 'mini-css-extract-plugin' ).default
	: require( 'mini-css-extract-plugin' );

// ======
// CONFIG
// ======

const blocks = fs
	.readdirSync( path.resolve( process.cwd(), 'src/blocks' ) )
	.reduce(
		( e, file ) => ( {
			...e,
			[ `blocks/${ file }` ]: path.resolve(
				process.cwd(),
				`src/blocks/${ file }/index.ts`
			),
			[ `blocks/${ file }/view` ]: path.resolve(
				process.cwd(),
				`src/blocks/${ file }/view.ts`
			),
		} ),
		{}
	);

class NelioAddGutenbergDependencyInBlockEdit {
	apply( compiler ) {
		compiler.hooks.thisCompilation.tap( 'NelioAddGutenbergDependencyInBlockEdit', ( compilation ) => {
			compilation.hooks.processAssets.tap(
				{
					name: 'NelioAddGutenbergDependencyInBlockEdit',
					stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
				},
				() => {
					const from = `'dependencies' => array(`;
					const to = `'dependencies' => array( 'nelio-forms-gutenberg', `;

					const names = _.filter(
						_.map( compilation.getAssets(), 'name' ),
						( n ) => /\bblocks\b.*\bindex.asset.php$/.test( n )
					);
					names.forEach( ( name ) => {
						const file = compilation.getAsset( name );
						compilation.updateAsset(
							name,
							new sources.RawSource(
								file.source.source().replace( from, to )
							)
						)
					} );
				}
			);
		});
	}
} //end NelioAddGutenbergDependencyInBlockEdit()

const config = {
	...defaultConfig,

	resolve: {
		...defaultConfig.resolve,
		alias: {
			'@nelio/forms': path.resolve( __dirname, 'src/common' ),
		},
		extensions: _.union( defaultConfig.resolve.extensions ?? [], [
			'.js',
			'.jsx',
			'.ts',
			'.tsx',
		] ),
	},

	plugins: [
		...removePlugins( defaultConfig.plugins, [ 'MiniCssExtractPlugin' ] ),
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: 'src/blocks/*/block.json',
					to: ( { absoluteFilename: af } ) =>
						`blocks/${
							_.reverse( af.split( '/' ) )[ 1 ]
						}/block.json`,
				},
			],
		} ),
		new MiniCssExtractPlugin( {
			filename: renameStyles,
		} ),
		new NelioAddGutenbergDependencyInBlockEdit(),
		new RemovePlugin( {
			after: {
				log: false,
				test: [
					{
						folder: 'dist',
						method: ( path ) => /nelio-forms-opinionated-style/.test( path ),
					}
        ]
			}
		} ),
	],

	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
};

// =============
// MODULE EXPORT
// =============

module.exports = {
	...config,
	entry: {
		// BASE
		...blocks,
		gutenberg: './src/gutenberg/index.ts',
		'form-editor': './src/form-editor/index.ts',
		'opinionated-style': './src/css/opinionated.scss',

		// PREMIUM
		'premium/updates-page': './premium/src/updates/index.tsx',
		'premium/form-editor': './premium/src/form-editor/index.ts',
	},
	output: {
		filename: renameScripts,
		path: path.resolve( __dirname, 'dist' ),
	},
};

// =======
// HELPERS
// =======

function removePlugins( plugins, pluginsToRemove ) {
	return plugins.filter(
		( p ) => ! pluginsToRemove.includes( p.constructor.name )
	);
} //end removePlugins()

function renameScripts( pathData ) {
	const { name } = pathData.chunk;
	if ( ! name.includes( 'blocks/' ) ) {
		const { name } = pathData.chunk;
		const cleanName = name.replace( 'premium/', '' );
		return name.startsWith( 'premium/' )
			? `../premium/dist/nelio-forms-premium-${ cleanName }.js`
			: 'nelio-forms-[name].js';
	} //end if

	return /blocks\/[a-z-]+\/view/.test( name )
		? `${ name.replace( '/view', '' ) }/view.js`
		: '[name]/index.js';
} //end renameScripts()

function renameStyles( pathData ) {
	const { name } = pathData.chunk;
	if ( ! name.includes( 'blocks/' ) ) {
		return `${ name.replace( 'style-', 'nelio-forms-' ) }.css`;
	} //end if

	return name.includes( 'style-' )
		? `${ name.replace( 'style-', '' ) }/style-index.css`
		: '[name]/index.css';
} //end renameStyles()
