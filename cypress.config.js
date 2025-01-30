const webpackPreprocessor = require('@cypress/webpack-preprocessor')
const { defineConfig } = require('cypress')

module.exports = defineConfig({
	fixturesFolder: 'server/assets/',
	videosFolder: 'src/tests/utils/videos/',
	screenshotsFolder: 'src/tests/utils/screenshots/',
	viewportWidth: 375,
	viewportHeight: 1500,
	e2e: {
		setupNodeEvents(on, config) {
			const options = webpackPreprocessor({
				webpackOptions: {
					resolve: {
						extensions: ['.js', '.jsx', '.ts', '.tsx'],
					},
					module: {
						rules: [
							{
								test: /\.svg$/,
								use: 'raw-loader',
							},
						],
					},
				},
			})

			on('file:preprocessor', options)

			return require('./src/tests/utils/plugins/index.js')(on, config)
		},
		baseUrl: 'http://localhost:3000',
		specPattern: 'src/tests/e2e/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: 'src/tests/utils/support/',
	},
})
