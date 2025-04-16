import TeraProxy from '../lib/terafy.proxy.js';
/**
* Setup a Vite local loopback
*
* @see lib/terafy.proxy.js
*
* @param {Object} [options] Options to pass to the Proxy module
* @returns {VitePlugin}
*/
export default function vitePluginTeraFy(options) {
    // Vite plugin config
    return {
        name: 'tera-fy',
        apply(config, { command }) {
            // Don't run when building
            if (command == 'build')
                return false;
            TeraProxy(options);
        },
    };
}
//# sourceMappingURL=vite.js.map