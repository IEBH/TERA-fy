import { globalIgnores} from "eslint/config";
import RulesMFDC, {JSCommon} from '@momsfriendlydevco/eslint-config';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
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

	// Add browser defs to typescript
	{
		files: ['lib/**/*.ts'], // Apply this only to files in the 'lib' directory
		languageOptions: {
			globals: {
				...globals.browser, // Adds all browser globals like 'window', 'document', etc.
			},
		},
	},

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
			// Not needed with TS
			'jsdoc/require-returns-type': 'off',
			// This rule sometimes gives worse syntax
			'unicorn/prefer-ternary': 'off',
			// Loosen rules until proper TS annotation
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/prefer-promise-reject-errors': 'off',
			...JSCommon,
		},
	},

	// Your existing global override - this will apply to both JS and TS files
	// If you only want this for JS, you could add `files: ['**/*.js']` here.
	{
		rules: {
			'unicorn/prefer-global-this': 'off',
		},
	},

	// MC overrides so the TypeScript linter can STFU
	...(['rhino', 'slab', 'snow'].includes(process.env.NODE_ENV) ? [{
		rules: {
			'no-undef': 'warn',
			'no-unused-vars': 'off', // Dupe of '@typescript-eslint/no-unused-vars'
			'prefer-const': 'off',
			'@typescript-eslint/ban-ts-comment': 'off', // Allow `// @ts-ignore`
			'@typescript-eslint/no-explicit-any': 'off', // Stop complaining about `:any` definitions
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-unnecessary-type-assertion': 'warn',
			'unicorn/numeric-separators-style': 'warn',
		},
	}] : []),
);
