import RulesMFDC from '@momsfriendlydevco/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: [
			'.*', // Ignore dotfiles/folders
			'docs/', // Ignore documentation output
			'dist/', // Ignore build output
			'node_modules/', // Ignore dependencies
			'api.md', // Ignore generated markdown API file
		],
	},

	// Include the base configuration from MFDC
	...RulesMFDC,
	// Add TypeScript specific configurations
	{
		// Apply these settings ONLY to .ts files
		files: ['**/*.ts'],
		// Use recommended TypeScript rules (includes parser/plugin setup)
		// Using recommendedTypeChecked enables rules that require type information
		extends: [
			...tseslint.configs.recommendedTypeChecked,
		],
		// Configure the parser to find your tsconfig.json for type-aware linting
		languageOptions: {
			parserOptions: {
				project: true, // Tells TS ESLint to find and use tsconfig.json
				tsconfigRootDir: import.meta.dirname, // Helps ESLint find tsconfig.json relative to eslint.config.js
			},
		},
		rules: {
			// Add any TypeScript specific rule overrides here if needed
			// For example:
			// '@typescript-eslint/no-explicit-any': 'warn',
			// '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
		},
	},

	// Your existing global override - this will apply to both JS and TS files
	// If you only want this for JS, you could add `files: ['**/*.js']` here.
	{
		rules: {
			'unicorn/prefer-global-this': 'off', // Keep your specific override
		},
	},
);
