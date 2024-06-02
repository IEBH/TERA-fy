import Proxy from 'http-proxy';

/**
* Default options used in vitePluginTeraFy()
* @see vitePluginTeraFy()
* @type {Object}
*/
export let defaults = {
	force: false,
	host: '0.0.0.0',
	port: 7334,
	targetProtocol: 'https',
	targetHost: 'tera-tools.com',
	targetPort: 443,
};


/**
* Eventual proxy server when the plugin has booted
* @type {ProxyServer}
*/
export let proxyServer;


/**
* Setup a Vite local loopback
*
* @param {Object} [options] Additional options to mutate behaviour
* @param {Boolean} [options.force=false] Restart the server even if its apparently running
* @param {String} [options.host='0.0.0.0'] Host IP to listen on
* @param {Number} [options.port=7334] Host port to listen on
* @param {String} [options.targetProtocol='https'] Target protocol to forward to
* @param {String} [options.targetHost='tera-tools.com'] Target host to forward to
* @param {Number} [options.targetPort=443] Target port to forward to
*
* @returns {VitePlugin}
*/
export default function vitePluginTeraFy(options) {
	let settings = {
		...defaults,
		...options,
	};

	if (proxyServer && !settings.force) return; // Server already running skip

	// Create proxy pass-thru
	proxyServer = Proxy.createProxyServer({
		changeOrigin: true,
		target: {
			protocol: settings.targetProtocol + ':',
			host: settings.targetHost,
			port: settings.targetPort,
		},
	});

	proxyServer.listen(settings.port, ()=> {
		console.log('Routing TERA traffic from', `http://${settings.host}:${settings.port}`, '→', `${settings.targetProtocol}://${settings.targetHost}:${settings.targetPort}`);
	});

	// Vite output
	return {
		name: 'tera-fy',
		apply: 'dev', // Only run on dev-serve-mode rather than each build
	}
}
