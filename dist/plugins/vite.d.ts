/**
* Setup a Vite local loopback
*
* @see lib/terafy.proxy.js
*
* @param {Object} [options] Options to pass to the Proxy module
* @returns {VitePlugin}
*/
export default function vitePluginTeraFy(options: any): {
    name: string;
    apply(config: any, { command }: any): false | undefined;
};
