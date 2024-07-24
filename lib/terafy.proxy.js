import {create as createDomain} from 'node:domain';
import detectPort from 'detect-port';
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
	* @param {'ignore'|'throw'} [options.portConflict='ignore'] Action to take when something is already listening on the allocated port
	* @param {Function} [options.onLog=console.log] Function to call with any logging output. Defaults to using console.log. Called as `(level:'INFO|'WARN', ...msg:any)`
	*
	* @returns {VitePlugin}
	*/
	settings = {
		autoStart: true,
		force: false,
		host: '0.0.0.0',
		port: 7334,
		targetProtocol: 'https',
		targetHost: 'dev.tera-tools.com',
		targetPort: 443,
		portConflict: 'ignore',
		onLog: (level, ...msg) => console.log(...msg),
	}


	/**
	* Eventual proxy server when the plugin has booted
	* @type {ProxyServer}
	*/
	proxyServer;


	/**
	* Boot the proxy
	*
	* @returns {Promise} A promise which resolves when the operation has completed
	*/
	start() {
		if (this.proxyServer && !this.settings.force) return Promise.resolve(); // Server already running skip

		return Promise.resolve()
			.then(()=> detectPort(this.settings.port))
			.then(gotPort => gotPort != this.settings.port && Promise.reject('PORT-CONFLICT'))
			.then(() => this.proxyServer = Proxy.createProxyServer({ // Create proxy pass-thru
				changeOrigin: true,
				target: {
					protocol: this.settings.targetProtocol + ':',
					host: this.settings.targetHost,
					port: this.settings.targetPort,
				},
			}))
			.then(()=> new Promise((resolve, reject) => {
				// Wrap listener in a domain so we can correctly catch EADDRINUSE
				let domain = createDomain();
				domain.on('error', err => {
					if (err.code == 'EADDRINUSE') {
						throw 'PORT-CONFLICT';
					} else {
						throw err;
					}
				});
				this.proxyServer.listen(this.settings.port, ()=> {
					this.settings.onLog('INFO', 'Routing TERA traffic from', `http://${this.settings.host}:${this.settings.port}`, '→', `${this.settings.targetProtocol}://${this.settings.targetHost}:${this.settings.targetPort}`);
					resolve();
				})
			}))
			.catch(e => {
				if (e === 'PORT-CONFLICT') {
					if (this.settings.portConflict == 'ignore') {
						this.settings.onLog('WARN', 'Port', this.settings.port, 'is already allocated - assuming TERA is already running locally and skipping proxy');
						return false; // Do nothing
					} else {
						throw err;
					}
				} else {
					throw e; // Re-throw everything else
				}
			})
	}


	/**
	* Stop the proxy server
	* @returns {Promise} A promise which will resolve when the close operation has completed
	*/
	stop() {
		return Promise.resolve()
			.then(()=> this.proxyServer && new Promise(resolve => this.proxyServer.close(()=> resolve())))
	}


	constructor(options) {
		if (options) Object.assign(this.settings, options);

		// Auto start?
		if (options?.autoStart ?? true) this.start();
	}
}


/**
* Utility function to return a new TeraProxy instance
*
* @param {Object} [options] Options to pass to the Proxy module
* @returns {TeraProxy} A TeraProxy instance
*/
export default function(options) {
	return new TeraProxy(options);
}
