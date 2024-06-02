TERA-fy
=======
TERA website worker, intended to be embedded with TERA tools.

* [TERA-fy API (API explorer)](https://iebh.github.io/TERA-fy/)
* [TERA-fy API (Markdown, single page)](./api.md)
* [API playground](https://iebh.github.io/TERA-fy/playground.html)
* [TERA-Explorer](https://github.com/IEBH/TERA-explorer) - A simple example project using TERA-fy
	- [Live standalone version](https://explorer.tera-tools.com/)
	- [Live Embedded version](https://tera-tools.com/explorer)
* [File Hints reference](./hints.md)
* [Changelog](./CHANGELOG.md)

TERA-fy is a add-on module which extends 3rd party tools with functionality from the [TERA](https://tera-tools.com) project. It provides various functionality like data sync with the parent TERA instance, file upload/download, citation library access and other utilities.


Quick Start
-----------

```javascript
import TeraFy from '@iebh/tera-fy';
import TerafyVue from '@iebh/tera-fy/plugins/vue';
let terafy = new TeraFy()
	.set('devMode', true) // Set this option to see debugging messages
	.use(TerafyVue); // Add the Vue plugin

// Initialize everything
await terafy.init();

// Require that the active session has a project selected
await terafy.requireProject();

// Go fetch the state of the active project
let projectState = await terafy.getProjectState(); //= Object representing the active project

// See https://iebh.github.io/TERA-fy/ for a full API list
```

Included Files
--------------
Generally importing the source code TERA-fy client (`import terafy from '@iebh/tera-fy';`) should be sufficient but multiple versions of this client are shipped for compatibility with older or more annoying build systems:

| Import                                     | Standard     | Description                                                        |
|--------------------------------------------|--------------|--------------------------------------------------------------------|
| `@iebh/tera-fy`                            | Source Code  | Basic, plain JS to be transformed however your build path requires |
| `@iebh/tera-fy/dist/terafy.es2019.js`      | ESM + ES2019 | `@vue/cli-service` compatible version for older versions of Babel  |
| `@iebh/tera-fy/dist/plugin.vue2.es2019.js` | ESM + ES2019 | `@vue/cli-service` compatible version of the Vue@2 plugin          |

More versions can be added upon request or PR of the build command in the scripts section of `package.json`.


Plugins
=======
This module exports various plugins which are availble as `import from '@iebh/tera-fy/plugins/*'`.


`@iebh/tera-fy/plugins/vue2`
----------------------------
FIXME: To add documentation


`@iebh/tera-fy/plugins/vue3`
----------------------------
FIXME: To add documentation


`@iebh/tera-fy/plugins/vite`
----------------------------
A plugin for Vite which boots a local proxy server to route traffic to/from `localhost:7334` to tera-tools.com.
This is to work around the issue where a local website is usually forbidden from talking to TERA-tools.com unless its running with a HTTPS context.

Example Usage within `vite.config.js`:

```javascript
// ... Other imports ... //
import pluginTeraFy from '@iebh/tera-fy/plugins/vite';

export default {
	plugins: [
		// ... other plugin config ... //

		pluginTeraFy(), // ... or add an options object to override the defaults
	],
}
```

Configuration options:

| Option           | Type      | Default            | Description                                                    |
|------------------|-----------|--------------------|----------------------------------------------------------------|
| `force`          | `Boolean` | `false`            | Restart the server even if its apparently running              |
| `autoStart`      | `Boolean` | `true`             | Automatically start the proxy without calling `Plugin.start()` |
| `host`           | `String`  | `'0.0.0.0'`        | Host IP to listen on                                           |
| `port`           | `Number`  | `7334`             | Host port to listen on                                         |
| `targetProtocol` | `String`  | `'https'`          | Target protocol to forward to                                  |
| `targetHost`     | `String`  | `'tera-tools.com'` | Target host to forward to                                      |
| `targetPort`     | `Number`  | `443`              | Target port to forward to                                      |
