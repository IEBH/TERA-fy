TERA-fy
=======
TERA website worker, intended to be embedded with TERA tools.

* [TERA-fy API (API explorer)](https://iebh.github.io/TERA-fy/)
* [TERA-fy API (Markdown, single page)](./api.md)
* [API playground](https://iebh.github.io/TERA-fy/playground.html)
* [TERA-Explorer](https://github.com/IEBH/TERA-explorer) [[Live standalone version](https://explorer.tera-tools.com/), [Live Embedded version](https://tera-tools.com/explorer)] - A simple example project using TERA-fy

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
