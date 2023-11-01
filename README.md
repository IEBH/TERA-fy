TERA-fy
=======
TERA website worker, intended to be embedded with TERA tools.

* [API workbench](https://iebh.github.io/TERA-fy/)
* [TERA-fy Class API](./api.md)


TERA-fy is a component intended to be dropped into a sub-site / tool used with in the main [TERA](https://tera-tools.com) project. It provides various functionality like data sync with the parent TERA instance.


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
```
