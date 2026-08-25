TERA-fy
=======
TERA website worker, intended to be embedded with TERA tools.

* [TERA-fy API (API explorer)](https://iebh.github.io/TERA-fy/)
* [TERA-fy API (Markdown, single page)](./api.md)
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
import TerafyVue from '@iebh/tera-fy/plugins/vue3';
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


Syncro
======
Syncro is the data sync engine used by TERA + TERA-fy. Each Syncro instance mounts one remote TERA entity (a Supabase row exposed via the tera-io worker) as a local-first RxDB document (persisted to IndexedDB via Dexie) with a framework-native reactive mirror of its `data` payload. Changes replicate both ways - live over a shared multiplexed WebSocket (with polling fallback + cross-tab leader election) with conflicts resolved via a field-level three-way merge.

Most consumers should use the framework plugins below (which wire Syncro up automatically) but the class is importable directly:

```javascript
import Syncro from '@iebh/tera-fy/syncro';

// One-off global configuration
Syncro.setup({
  url: 'https://io.example.com', // Base URL of the tera-io worker
  getToken: ()=> myAuth.getToken(), // Async function resolving with an auth bearer token
  getReactive, // Framework reactive adapter, e.g. `import {getReactive} from '@iebh/tera-fy/plugins/vue3'`
});

// Mount a document + use its reactive `value`
let syncro = await Syncro.mount('projects::SOME-UUID');
syncro.value.title = 'Hello'; // Mutations replicate automatically (debounced)

await syncro.set({color: 'blue'}); // ...or merge + flush immediately
await syncro.flush(); // Force a replication cycle
await syncro.destroy(); // Unmount (local copy is retained in IndexedDB to warm-start the next mount)
```

Other useful APIs (see the source JSDoc in `lib/syncro/syncro.js` for the full set):

| API                               | Type     | Description                                                                         |
|-----------------------------------|----------|-------------------------------------------------------------------------------------|
| `Syncro.setup(options)`           | Static   | Merge global engine configuration (URLs, auth, reactivity adapter, timing tunables) |
| `Syncro.mount(path)`              | Static   | Mount (or reuse) the Syncro for a given `ENTITY::ID` path                           |
| `Syncro.destroy(path)`            | Static   | Unmount the Syncro at a given path                                                  |
| `Syncro.getSnapshot(path)`        | Static   | One-off fetch of a paths server state                                               |
| `Syncro.setSnapshot(path, state)` | Static   | One-off merge against a paths server state                                          |
| `Syncro.events`                   | Static   | Mitt emitter signalling `socketState` / `socketSession` / `pathState` / `leader`    |
| `Syncro.states`                   | Static   | Per-path stream state (`'local'` / `'polling'` / `'live'`)                          |
| `syncro.value`                    | Instance | The mounted reactive document mirror                                                |
| `syncro.set(key, val)`            | Instance | Merge one or more values then flush                                                 |
| `syncro.flush()`                  | Instance | Commit pending writes + wait for the replication to settle in-sync                  |
| `syncro.destroy()`                | Instance | Unmount this instance                                                               |


Plugins
=======
This module exports various plugins which are availble as `import from '@iebh/tera-fy/plugins/*'`.


`@iebh/tera-fy/plugins/syncro`
------------------------------
The base Syncro plugin which wires the Syncro engine into the TeraFy client - providing namespace mounting (`mountNamespace()` / `unmountNamespace()`) backed by RxDB replication, with auth tokens fetched over the TeraFy RPC bridge.

This plugin is framework agnostic (documents mount as plain POJOs) - usually you want one of the framework plugins below instead, which extend it with a proper reactivity adapter.



`@iebh/tera-fy/plugins/vue2`
----------------------------
Extends the Syncro plugin with a Vue@2 reactivity adapter (via `Vue.observable` + `Vue.set`/`Vue.delete`).

```javascript
// Somewhere in your boot process - usually src/main.js
import TeraFy from '@iebh/tera-fy';
import TerafyVue from '@iebh/tera-fy/plugins/vue2';
let terafy = new TeraFy()
  .set('devMode', false) // Uncomment this line if you want TeraFy to be chatty and use all `setIfDev` settings
  .setIfDev('siteUrl', 'http://localhost:7334/embed')
  .use(TerafyVue, { // Add the Vue plugin
    Vue: window.Vue, // Assumes Vue is available on the window object
  })

// Include after app boot
const app = new Vue({ /* ... */ })
app.$mount("#app");
await terafy.init({app});
```


`@iebh/tera-fy/plugins/vue3`
----------------------------
Extends the Syncro plugin with a Vue@3 reactivity adapter. The adapter is also exported standalone as `getReactive` for direct use with `Syncro.setup()`.

```javascript
// Somewhere in your boot process - usually src/main.js
import TeraFy from '@iebh/tera-fy';
import TerafyVue from '@iebh/tera-fy/plugins/vue3';
let terafy = new TeraFy()
  .set('devMode', import.meta.env.DEV) // TeraFy should be chatty and use all `setIfDev` settings
  .setIfDev('siteUrl', 'http://localhost:7334/embed')
  .use(TerafyVue) // Add the Vue plugin

terafy.init(); // Initialize everything

app.use(terafy.vuePlugin({
  globalName: '$tera', // Install as vm.$tera into every component
}));
```


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
