import Proxy from 'http-proxy';
interface TeraProxyOptions {
    force?: boolean;
    autoStart?: boolean;
    host?: string;
    port?: number;
    targetProtocol?: string;
    targetHost?: string;
    targetPort?: number;
    portConflict?: 'ignore' | 'throw';
    onLog?: (level: 'INFO' | 'WARN', ...msg: any[]) => void;
}
export declare class TeraProxy {
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
    settings: {
        autoStart: boolean;
        force: boolean;
        host: string;
        port: number;
        targetProtocol: string;
        targetHost: string;
        targetPort: number;
        portConflict: "ignore" | "throw";
        onLog: (level: "INFO" | "WARN", ...msg: any[]) => void;
    };
    /**
    * Eventual proxy server when the plugin has booted
    * @type {ProxyServer}
    */
    proxyServer: Proxy | undefined;
    /**
    * Boot the proxy
    *
    * @returns {Promise} A promise which resolves when the operation has completed
    */
    start(): Promise<boolean | void>;
    /**
    * Stop the proxy server
    * @returns {Promise} A promise which will resolve when the close operation has completed
    */
    stop(): Promise<void | undefined>;
    constructor(options?: TeraProxyOptions);
}
/**
* Utility function to return a new TeraProxy instance
*
* @param {Object} [options] Options to pass to the Proxy module
* @returns {TeraProxy} A TeraProxy instance
*/
export default function (options?: TeraProxyOptions): TeraProxy;
export {};
