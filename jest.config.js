module.exports = {
	testEnvironment: 'jest-environment-jsdom',
	transform: {
		'^.+\\.[j]sx?$': 'babel-jest',
	},
	collectCoverageFrom: [
		'src/**/*.js',
		'server/**/*.js',
		'!<rootDir>/node_modules/',
		'!<rootDir>/server/node_modules/'
	],
	setupFilesAfterEnv: [
		'<rootDir>/src/tests/app/jest.setup.js',
	],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
};
