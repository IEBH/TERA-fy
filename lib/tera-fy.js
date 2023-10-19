/**
* Main Tera-Fy class singleton to be used in a frontend browser
*/
export class TeraFy {

	/**
	* Various settings to configure behaviour
	* @type {Object}
	* @property {Boolean} devMode Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance
	* @property {String} siteUrl The TERA URL to connect to
	*/
	settings = {
		devMode: true,
		siteUrl: 'http://localhost:5173/remote-control',
	};

	/**
	* DOMElements for this TeraFy instance
	* @type {Object}
	* @property {DOMElement} el The main tera-fy div wrapper
	* @property {DOMElement} iframe The internal iFrame element
	* @property {DOMElement} stylesheet The corresponding stylesheet
	*/
	dom = {
		el: null,
		iframe: null,
		stylesheet: null,
	};


	/**
	* Embedded iFrame app instance obtained from the (eventual) load of the embedded iframe
	* @type {Object}
	*/
	tera = null;


	// Init - init(), injectMain(), injectStylesheet() {{{
	init() {
		this.injectMain();
		this.injectStylesheet();
	}

	injectMain() {
		this.dom.el = document.createElement('div')
		this.dom.el.id = 'tera-fy';
		document.body.append(this.dom.el);

		this.dom.iframe = document.createElement('iframe')

		// Queue up event chain when document loads
		this.dom.iframe.sandbox = 'allow-downloads allow-scripts allow-same-origin';
		this.dom.iframe.addEventListener('load', ()=> {
			console.log('TERA FRAME READY - ASK FOR CONTEXT');
			console.log('WINDOW', this.dom.iframe.contentWindow);
			try {
				this.dom.iframe.contentWindow.postMessage('hello');
			} catch (e) {
				console.log('Failed to POSTMESSAGE', e);
			}
			try {
				console.log('DOCUMENT', this.dom.iframe.contentWindow.document);
			} catch (e) {
				console.log('Failed to access document', e);
			}
			console.log('APP', this.dom.iframe.contentWindow.document.app);
		});

		// Start document load sequence + append to DOM
		this.dom.iframe.src = this.settings.siteUrl;
		this.dom.el.append(this.dom.iframe);
	}

	// injectStylesheet {{{
	injectStylesheet() {
		this.dom.stylesheet = document.createElement('style');
		this.dom.stylesheet.innerHTML =
`
#tera-fy {
	position: fixed;
	left: 50px;
	top: 50px;
	width: 500px;
	height: 300px;

	background: #FFF;
	border: 5px solid blue;
}

#tera-fy > iframe {
	width: 100%;
	height: 100%;
}
`
		document.head.appendChild(this.dom.stylesheet);
	}
	// }}}
}

let teraFy;
/* global globalThis */
if (globalThis.terafy) {
	if (globalThis.terafy.settings.devMode) {
		console.warn('Encountered an existing Tera-Fy instance + in Dev mode - refreshing outer page');
		window.location.reload();
	} else {
		console.warn('Encountered an existing Tera-Fy instance - refusing to dual load');
		teraFy = globalThis.terafy;
	}
} else {
	teraFy = new TeraFy();
}

export default teraFy;
