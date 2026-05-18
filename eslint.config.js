import {globalIgnores} from 'eslint/config';
import RulesMFDC from '@momsfriendlydevco/eslint-config';
import globals from 'globals';

export default [
	globalIgnores([
		'.*',
		'docs/',
		'dist/',
		'node_modules/',
		'public/',
		'**/.wrangler/',
	]),
	{
		// Generic globals
		languageOptions: {
			globals: {
				console: 'readonly',
				fetch: 'readonly',
			},
		},
	},

	// Include the base configuration from MFDC
	...RulesMFDC,

	// Add browser globals to lib files
	{
		files: ['lib/**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},

	// Global overrides
	{
		rules: {
			'unicorn/prefer-global-this': 'off',
		},
	},
];
