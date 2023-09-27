/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
	],
	core: {
		disableWhatsNewNotifications: true,
	},
	docs: {
		autodocs: 'tag',
	},
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	stories: [
		'../**/*.story.js',
	],
};
export default config;
