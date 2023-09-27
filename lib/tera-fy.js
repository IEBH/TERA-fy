/**
* Main Tera-Fy class singleton to be used in a frontend browser
*/
export class TeraFy {

	/**
	* Various settings to configure behaviour
	* @type {Object}
	* @property {String} siteUrl The TERA URL to connect to
	*/
	settings = {
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
	* Main contentDocument element of the (eventually) created iframe
	* @type {DOMElement}
	*/
	teraFrame = null;


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
		this.dom.iframe.src = this.settings.siteUrl;
		this.dom.el.append(this.dom.iframe);
		this.teraFrame = this.dom.iframe.contentDocument;
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

export default new TeraFy();
