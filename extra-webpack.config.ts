import * as webpack from 'webpack';

export default {
	plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)]
} as webpack.Configuration;
