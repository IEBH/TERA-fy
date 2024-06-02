import Proxy from 'http-proxy';

export class TeraProxy {
	/**
	* Setup a local loopback proxy for TERA-tools.com
	*
	* @param {Object} [options] Additional options to mutate behaviour
	* @param {Boolean} [options.force=false] Restart the server even if its apparently running
	* @param {Boolean} [options.autoStart=true] Automatically start the proxy without calling `Plugin.start()`
	* @param {String} [options.host='0.0.0.0'] Host IP to listen on
	* @param {Number} [options.port=7334] Host port to listen on
	* @param {String} [options.targetProtocol='https'] Target protocol to forward to
	* @param {String} [options.targetHost='tera-tools.com'] Target host to forward to
	* @param {Number} [options.targetPort=443] Target port to forward to
	*
	* @returns {VitePlugin}
	*/
	settings = {
		autoStart: true,
		force: false,
		host: '0.0.0.0',
		port: 7334,
		targetProtocol: 'https',
		targetHost: 'tera-tools.com',
		targetPort: 443,
	}


	/**
	* Eventual proxy server when the plugin has booted
	* @type {ProxyServer}
	*/
	proxyServer;


	/**
	* Boot the proxy
	*/
	start() {
		if (this.proxyServer && !this.settings.force) return; // Server already running skip

		// Create proxy pass-thru
		this.proxyServer = Proxy.createProxyServer({
			changeOrigin: true,
			target: {
				protocol: this.settings.targetProtocol + ':',
				host: this.settings.targetHost,
				port: this.settings.targetPort,
			},
		});

		this.proxyServer.listen(this.settings.port, ()=> {
			console.log('Routing TERA traffic from', `http://${this.settings.host}:${this.settings.port}`, '→', `${this.settings.targetProtocol}://${this.settings.targetHost}:${this.settings.targetPort}`);
		});
	}


	/**
	* Stop the proxy server
	* @returns {Promise} A promise which will resolve when the close operation has completed
	*/
	async stop() {
		if (this.proxyServer) await new Promise(resolve => this.proxyServer.close(()=> resolve()));
	}


	constructor(options) {
		if (options) Object.assign(this.settings, options);

		// Auto start?
		if (options?.autoStart ?? true) this.start();
	}
}


/**
* Utility function to return a new TeraProxy instance
*/
export default function(options) {
	return new TeraProxy(options);
}
