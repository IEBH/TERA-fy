import {globalIgnores} from 'eslint/config';
import RulesMFDC from '@momsfriendlydevco/eslint-config';

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

	// Global overrides
	{
		rules: {
			'unicorn/prefer-global-this': 'off',
		},
	},
];
