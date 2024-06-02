import TeraProxy from '../lib/terafy.proxy.js';

/**
* Setup a Vite local loopback
*
* @see lib/terafy.proxy.js
*
* @returns {VitePlugin}
*/
export default function vitePluginTeraFy(options) {
	TeraProxy(options);

	// Vite output
	return {
		name: 'tera-fy',
		apply: 'dev', // Only run on dev-serve-mode rather than each build
	}
}
