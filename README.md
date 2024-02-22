TERA-fy
=======
TERA website worker, intended to be embedded with TERA tools.

* [TERA-fy API (API explorer)](https://iebh.github.io/TERA-fy/)
* [TERA-fy API (Markdown, single page)](./api.md)
* [API playground](https://iebh.github.io/TERA-fy/playground.html)
* [TERA-Explorer](https://github.com/IEBH/TERA-explorer) - A simple example project using TERA-fy
 	- [Live standalone version](https://explorer.tera-tools.com/)
  	- [Live Embedded version](https://tera-tools.com/explorer)

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
