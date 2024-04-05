# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.0.24](https://github.com/IEBH/TERA-fy/compare/v1.0.23...v1.0.24) (2024-04-05)


### Bug Fixes

* Yet another fix for setProjectState() throwing when trying to save + remove defunct {sync:Boolean} option ([4e320ec](https://github.com/IEBH/TERA-fy/commit/4e320ec8f171237387db7404a7209b4ca51898c8))

## [1.0.23](https://github.com/IEBH/TERA-fy/compare/v1.0.22...v1.0.23) (2024-04-04)

## <small>1.0.22 (2024-04-04)</small>

* chore(release): 1.0.21 ([9da4c7d](https://github.com/IEBH/TERA-fy/commit/9da4c7d))
* chore(release): 1.0.22 ([2ae789a](https://github.com/IEBH/TERA-fy/commit/2ae789a))
* fix: Missing Promise chain response during setProjectState() ([1fb7f29](https://github.com/IEBH/TERA-fy/commit/1fb7f29))



## <small>1.0.21 (2024-04-03)</small>

* 1.0.21 ([7c78b7e](https://github.com/IEBH/TERA-fy/commit/7c78b7e))
* docs: Rebuild ([080a0d2](https://github.com/IEBH/TERA-fy/commit/080a0d2))
* feat: More edits to <tera-file-select/> ([efc49f7](https://github.com/IEBH/TERA-fy/commit/efc49f7))
* feat: Moved ProjectLibrary file into its own classdef + added more file setter methods ([6c8eac3](https://github.com/IEBH/TERA-fy/commit/6c8eac3))
* feat: Stash + retrieve login data from LocalStorage when using embed + popup window workaround metho ([e9ec32c](https://github.com/IEBH/TERA-fy/commit/e9ec32c))
* refactor: Seperate Embed workaround code into its own function ([984c37a](https://github.com/IEBH/TERA-fy/commit/984c37a))
* fix: Added projectFile class build to frontend scripts ([b21fe29](https://github.com/IEBH/TERA-fy/commit/b21fe29))
* fix: Missing dep ([9bf58e4](https://github.com/IEBH/TERA-fy/commit/9bf58e4))



## <small>1.0.20 (2024-04-02)</small>

* 1.0.20 ([5c20b5c](https://github.com/IEBH/TERA-fy/commit/5c20b5c))
* docs: Doc rebuild ([841f04f](https://github.com/IEBH/TERA-fy/commit/841f04f))
* fix: Yet more $auth screw-around with window.opener magic ([d140da1](https://github.com/IEBH/TERA-fy/commit/d140da1))



## <small>1.0.19 (2024-04-02)</small>

* 1.0.19 ([0593adb](https://github.com/IEBH/TERA-fy/commit/0593adb))
* docs: Docs rebuild ([0c39fa2](https://github.com/IEBH/TERA-fy/commit/0c39fa2))
* feat: Start on <tera-library-select/> Vue component ([aa42855](https://github.com/IEBH/TERA-fy/commit/aa42855))
* devops: Added sanity check for $auth sticking in a loop on the server ([23f197d](https://github.com/IEBH/TERA-fy/commit/23f197d))
* devops: Disabled sourcemapping as its too much of a headfuck when its not mapping correctly ([f9f6b76](https://github.com/IEBH/TERA-fy/commit/f9f6b76))



## <small>1.0.18 (2024-04-02)</small>

* 1.0.18 ([fa9d2db](https://github.com/IEBH/TERA-fy/commit/fa9d2db))
* docs: Misc comment / code cleanup ([b1e0e38](https://github.com/IEBH/TERA-fy/commit/b1e0e38))
* docs: Rebuild all files + docs ([a73a69a](https://github.com/IEBH/TERA-fy/commit/a73a69a))
* docs: Rebuild docs ([623c4e4](https://github.com/IEBH/TERA-fy/commit/623c4e4))
* feat: Added method to try authenticating locally via a popup when in embedded mode ([7286958](https://github.com/IEBH/TERA-fy/commit/7286958))
* feat: Added prototype window mode for client ([9241854](https://github.com/IEBH/TERA-fy/commit/9241854))
* feat: Added subclassable {has,get,set}Path methods to client for state setting ([a4acedf](https://github.com/IEBH/TERA-fy/commit/a4acedf))
* feat: Button selection when using uiAlert() ([118223f](https://github.com/IEBH/TERA-fy/commit/118223f))
* feat: getUser({forceRetry:Boolean}) ([15b8efd](https://github.com/IEBH/TERA-fy/commit/15b8efd))
* feat: uiSplat() + uiWindow() ([a72fc33](https://github.com/IEBH/TERA-fy/commit/a72fc33))
* refactor: Juggle various {,peer,optional}depedencies config ([aee116a](https://github.com/IEBH/TERA-fy/commit/aee116a))
* refactor: Promise Deferred util ([8e4f1a8](https://github.com/IEBH/TERA-fy/commit/8e4f1a8))
* refactor: Stepped auth when calling requireUser() ([562798a](https://github.com/IEBH/TERA-fy/commit/562798a))
* devops: Added `npm run watch` script to main to rebuild client libraries on change ([48fa42a](https://github.com/IEBH/TERA-fy/commit/48fa42a))
* fix: Auto call to requireProject() in Vue2 mode ([f592cfb](https://github.com/IEBH/TERA-fy/commit/f592cfb))
* fix: Dont rely on server auth populating $auth.user.id ([73f8c85](https://github.com/IEBH/TERA-fy/commit/73f8c85))
* fix: Logic error when setting project state ([7fcd826](https://github.com/IEBH/TERA-fy/commit/7fcd826))
* fix: Subclass _pathSet() when in Vue2 mode ([ea5537e](https://github.com/IEBH/TERA-fy/commit/ea5537e))



## <small>1.0.17 (2024-03-14)</small>

* 1.0.17 ([51c98a7](https://github.com/IEBH/TERA-fy/commit/51c98a7))
* refactor: getProjectLibrary() -> parseProjectLibrary() ([f477c9d](https://github.com/IEBH/TERA-fy/commit/f477c9d))
* refactor: Split selectProjectLibrary() -> selectProjectFile() + selectProjectLibrary() + added stub  ([1e3d517](https://github.com/IEBH/TERA-fy/commit/1e3d517))
* fix: Typo ([98fad09](https://github.com/IEBH/TERA-fy/commit/98fad09))
* docs: Added File Hints reference ([bfbeb24](https://github.com/IEBH/TERA-fy/commit/bfbeb24))
* docs: Rebuild docs ([954d7b9](https://github.com/IEBH/TERA-fy/commit/954d7b9))
* feat: Filled out stubs for {get,set,select}ProjectLibrary() ([0bdbfd9](https://github.com/IEBH/TERA-fy/commit/0bdbfd9))



## <small>1.0.16 (2024-03-06)</small>

* 1.0.16 ([dcd0fe0](https://github.com/IEBH/TERA-fy/commit/dcd0fe0))
* feat: getLibraryFile() now supports multiple file transforms before handing contents to requester ([e413bd9](https://github.com/IEBH/TERA-fy/commit/e413bd9))
* fix: Dont try to inject undef values when devmode is enabled but the site URL isnt a string ([47598b2](https://github.com/IEBH/TERA-fy/commit/47598b2))



## <small>1.0.15 (2024-02-29)</small>

* 1.0.15 ([9e4e450](https://github.com/IEBH/TERA-fy/commit/9e4e450))
* docs: Rebuild docs ([83e9ddc](https://github.com/IEBH/TERA-fy/commit/83e9ddc))
* feat: requireUser() + call to it from requireProject() ([d4eedfa](https://github.com/IEBH/TERA-fy/commit/d4eedfa))
* feat: uiAlert() ([09da928](https://github.com/IEBH/TERA-fy/commit/09da928))
* ux: Bypass requestFocus() actions when already operating as top-level TERA ([9e2515d](https://github.com/IEBH/TERA-fy/commit/9e2515d))



## <small>1.0.14 (2024-02-27)</small>

* 1.0.14 ([fd53cdc](https://github.com/IEBH/TERA-fy/commit/fd53cdc))
* fix: yet more fixes to Live version of TERA-fy deployed to Live TERA ([f72fb8d](https://github.com/IEBH/TERA-fy/commit/f72fb8d))



## <small>1.0.13 (2024-02-27)</small>

* 1.0.13 ([be6b15f](https://github.com/IEBH/TERA-fy/commit/be6b15f))
* task: Rebuild /dist ([09fa084](https://github.com/IEBH/TERA-fy/commit/09fa084))
* feat: Added @vue/cli-service compatible version (ESM + ES2019 spec) ([56501c9](https://github.com/IEBH/TERA-fy/commit/56501c9))
* feat: TERA-fy client can now opt-in to sandbox overrides in dev mode ([550ac9c](https://github.com/IEBH/TERA-fy/commit/550ac9c))
* fix: Wrong DOM reference when searching for external iFrame from top-level TERA window ([51a0ab8](https://github.com/IEBH/TERA-fy/commit/51a0ab8))
* fix: Wrong external referencing for Vue2 plugin ([ddd7068](https://github.com/IEBH/TERA-fy/commit/ddd7068))
* ux: Provide each plugin with a copy of the TERA-fy client settings during init ([705ac7b](https://github.com/IEBH/TERA-fy/commit/705ac7b))



## <small>1.0.12 (2024-02-22)</small>

* 1.0.12 ([4b6a9a8](https://github.com/IEBH/TERA-fy/commit/4b6a9a8))
* docs: Docs rebuild ([ac52784](https://github.com/IEBH/TERA-fy/commit/ac52784))
* docs: Rebuild docs ([b95d407](https://github.com/IEBH/TERA-fy/commit/b95d407))
* feat: Added setProjectStateDefaults() to make priming defaults easier ([55a6ce8](https://github.com/IEBH/TERA-fy/commit/55a6ce8))
* test: Dropped the defunct terafy.subscribeProjectState demo ([01e585b](https://github.com/IEBH/TERA-fy/commit/01e585b))
* refactor: Various misc cleanup ([7c19c26](https://github.com/IEBH/TERA-fy/commit/7c19c26))
* fix: Tweaks to what is included in the NPM tarball ([e2cf7e0](https://github.com/IEBH/TERA-fy/commit/e2cf7e0))



## <small>1.0.11 (2024-02-21)</small>

* 1.0.11 ([d5638b8](https://github.com/IEBH/TERA-fy/commit/d5638b8))
* fix: Added @mfdc/supabase-reactive as a dep for the Vue plugins ([2f7900d](https://github.com/IEBH/TERA-fy/commit/2f7900d))
* feat: Added events / EventEmitter pattern to accept flushed updates from server ([458ce79](https://github.com/IEBH/TERA-fy/commit/458ce79))
* feat: Client can now tell server where its loaded from via setServerMode() ([b7c5fc0](https://github.com/IEBH/TERA-fy/commit/b7c5fc0))
* feat: Updated Vue plugins (2+3) to handle remote project state changes ([0abf7b4](https://github.com/IEBH/TERA-fy/commit/0abf7b4))
* docs: Updated function signatures between client & server ([dc1117a](https://github.com/IEBH/TERA-fy/commit/dc1117a))
* refactor: Move horrible mixin() handler into its own utility library ([713e26b](https://github.com/IEBH/TERA-fy/commit/713e26b))



## <small>1.0.10 (2024-02-18)</small>

* 1.0.10 ([bac8908](https://github.com/IEBH/TERA-fy/commit/bac8908))
* docs: Added API docs for TERA-fy client ([ca34abf](https://github.com/IEBH/TERA-fy/commit/ca34abf))
* docs: Added example invocation for Vue plugins ([5205235](https://github.com/IEBH/TERA-fy/commit/5205235))
* docs: Added header area to playground + fixed TeraFy JS url ([2fdd565](https://github.com/IEBH/TERA-fy/commit/2fdd565))
* docs: Added link to generated docs pages ([7670ff9](https://github.com/IEBH/TERA-fy/commit/7670ff9))
* docs: Added stub functions to client so that JSDoc can pick them up ([371a18e](https://github.com/IEBH/TERA-fy/commit/371a18e))
* docs: API doc build process + first generation build ([81c7ff4](https://github.com/IEBH/TERA-fy/commit/81c7ff4))
* docs: Documentation compiler is now more specific about doc listing order ([6353f15](https://github.com/IEBH/TERA-fy/commit/6353f15))
* docs: Dont allow project changing if there are no projects listed ([3aff5dc](https://github.com/IEBH/TERA-fy/commit/3aff5dc))
* docs: More API adjustment options ([1cd8a1d](https://github.com/IEBH/TERA-fy/commit/1cd8a1d))
* docs: More docs tidying ([1d2911f](https://github.com/IEBH/TERA-fy/commit/1d2911f))
* docs: More links in README + small cleanup ([6729637](https://github.com/IEBH/TERA-fy/commit/6729637))
* docs: Move playground into docs folder ([07d5d45](https://github.com/IEBH/TERA-fy/commit/07d5d45))
* docs: Rebuild docs ([709241c](https://github.com/IEBH/TERA-fy/commit/709241c))
* docs: Reformat links to TERA-Explorer ([8d2242a](https://github.com/IEBH/TERA-fy/commit/8d2242a))
* docs: Various docs fixups ([4add13a](https://github.com/IEBH/TERA-fy/commit/4add13a))
* docs: Yet more import nonsense with ESM files ([5c41b6b](https://github.com/IEBH/TERA-fy/commit/5c41b6b))
* fix: Better reaction when there is no active user login ([48bd61f](https://github.com/IEBH/TERA-fy/commit/48bd61f))
* fix: Debugging artefacts ([61d559b](https://github.com/IEBH/TERA-fy/commit/61d559b))
* fix: Dont allow plugins to override the main init() function - instead call them after that function ([7db3ba0](https://github.com/IEBH/TERA-fy/commit/7db3ba0))
* fix: Plugins init() functions are now called AFTER all other init functionaly has finished + they ar ([4757597](https://github.com/IEBH/TERA-fy/commit/4757597))
* fix(plugins/vue2): Handle Vue2 giving us a broken diff on Observable write ([d72a143](https://github.com/IEBH/TERA-fy/commit/d72a143))
* feat: createProjectStatePatch() to avoid having to do this manually in each plugin ([5414a22](https://github.com/IEBH/TERA-fy/commit/5414a22))
* feat: init() can now accept an options object ([0ee55b7](https://github.com/IEBH/TERA-fy/commit/0ee55b7))
* feat: Prototype project subscription process (untested) ([f13b957](https://github.com/IEBH/TERA-fy/commit/f13b957))
* feat: Various project-state patch handling functionality now implemented ([8260808](https://github.com/IEBH/TERA-fy/commit/8260808))
* feat(vue2): Largish refactor to support Vue2 + Vue3 plugins ([2abcecc](https://github.com/IEBH/TERA-fy/commit/2abcecc))
* task: Rebuild ([19766d7](https://github.com/IEBH/TERA-fy/commit/19766d7))
* task: Rebuild package-lock ([a83e654](https://github.com/IEBH/TERA-fy/commit/a83e654))
* task: Update API playground to match API signatures ([d483ec3](https://github.com/IEBH/TERA-fy/commit/d483ec3))
* refactor: Swap NPM:jsdoc -> NPM:documentation ([212ed1a](https://github.com/IEBH/TERA-fy/commit/212ed1a))



## <small>1.0.9 (2023-11-09)</small>

* 1.0.9 ([d06538c](https://github.com/IEBH/TERA-fy/commit/d06538c))
* feat: getProjectLibrary() now working ([019dacd](https://github.com/IEBH/TERA-fy/commit/019dacd))
* feat(getProjectFiles): Added getProjectFiles() ([b3804a5](https://github.com/IEBH/TERA-fy/commit/b3804a5))



## <small>1.0.8 (2023-11-02)</small>

* 1.0.8 ([b248a04](https://github.com/IEBH/TERA-fy/commit/b248a04))
* fix(plugins/vue): Various load race conditions for the Vue loader ([aa9c77c](https://github.com/IEBH/TERA-fy/commit/aa9c77c))
* feat: Tera-Fy can now communicate upwards (window.parent) or downwards (via iFrame) depending on its ([0c8d30d](https://github.com/IEBH/TERA-fy/commit/0c8d30d))



## <small>1.0.7 (2023-11-02)</small>

* 1.0.7 ([f95e0d4](https://github.com/IEBH/TERA-fy/commit/f95e0d4))
* refactor(plugins/vue): Move project list to $tera.list -> $tera.projects ([2b01e24](https://github.com/IEBH/TERA-fy/commit/2b01e24))
* feat(plugins/vue): Better project + project list binding ([2d46189](https://github.com/IEBH/TERA-fy/commit/2d46189))
* fix: Misc fixes ([2bd5e03](https://github.com/IEBH/TERA-fy/commit/2bd5e03))



## <small>1.0.6 (2023-11-01)</small>

* 1.0.6 ([eaf435a](https://github.com/IEBH/TERA-fy/commit/eaf435a))
* fix: Better error tracking methods with CLIENT|SERVER.debug() + try barriers around sendRaw() ([b4062b3](https://github.com/IEBH/TERA-fy/commit/b4062b3))
* fix: client.init() now returns its own instance in the promise payload so it can be awaited ([05d6611](https://github.com/IEBH/TERA-fy/commit/05d6611))
* fix: Minor typo in package when generating docs ([626a7fc](https://github.com/IEBH/TERA-fy/commit/626a7fc))
* fix: Placehoder in Vue plugin to load basic project skeleton ([f530e51](https://github.com/IEBH/TERA-fy/commit/f530e51))
* refactor: Code tidy + injectComms() now waits o the frame responding ([14491d3](https://github.com/IEBH/TERA-fy/commit/14491d3))
* docs: Added example to README ([40a564b](https://github.com/IEBH/TERA-fy/commit/40a564b))



## <small>1.0.5 (2023-10-31)</small>

* 1.0.5 ([33ab63e](https://github.com/IEBH/TERA-fy/commit/33ab63e))
* fix: Change default tera-tools endpoint to live site ([ca4a595](https://github.com/IEBH/TERA-fy/commit/ca4a595))
* fix: Various fixes to the mixin infrastructure ([27ce126](https://github.com/IEBH/TERA-fy/commit/27ce126))
* refactor: Moved plugins to a more logical location ([67821c5](https://github.com/IEBH/TERA-fy/commit/67821c5))
* refactor: Reuse this.set() in constructor if handed options ([c02a51b](https://github.com/IEBH/TERA-fy/commit/c02a51b))



## <small>1.0.4 (2023-10-27)</small>

* 1.0.4 ([92f418b](https://github.com/IEBH/TERA-fy/commit/92f418b))
* docs: Updated API docs ([ed2d934](https://github.com/IEBH/TERA-fy/commit/ed2d934))
* refactor: getProjectStateSnapshot() -> getProjectState() ([5939df2](https://github.com/IEBH/TERA-fy/commit/5939df2))
* refactor: Move API generation to a single file ([5039530](https://github.com/IEBH/TERA-fy/commit/5039530))
* refactor: Moved NPM:just-diff back to peerDeps as its likely to be needed anyway ([37e1235](https://github.com/IEBH/TERA-fy/commit/37e1235))
* feat: Added TeraFy.set() + minor fixes ([ccf2221](https://github.com/IEBH/TERA-fy/commit/ccf2221))
* feat: Implemented prototype plugin structure ([4a35743](https://github.com/IEBH/TERA-fy/commit/4a35743))
* task: rebuild ([e4fc5b8](https://github.com/IEBH/TERA-fy/commit/e4fc5b8))
* devops: Ignore dist/ when tooling/grepping ([d303385](https://github.com/IEBH/TERA-fy/commit/d303385))



## <small>1.0.3 (2023-10-26)</small>

* 1.0.3 ([391bb97](https://github.com/IEBH/TERA-fy/commit/391bb97))
* fix: getProjectStateSnapshot() wasnt actually returning a result ([db1c572](https://github.com/IEBH/TERA-fy/commit/db1c572))



## <small>1.0.2 (2023-10-26)</small>

* 1.0.2 ([1141bc4](https://github.com/IEBH/TERA-fy/commit/1141bc4))
* task: Rebuild ([4d8dda2](https://github.com/IEBH/TERA-fy/commit/4d8dda2))
* feat: Ping-pong RPC support with server<->client, added support for contexts to carry messages on se ([15b970d](https://github.com/IEBH/TERA-fy/commit/15b970d))
* feat: setActiveProject() ([c24158a](https://github.com/IEBH/TERA-fy/commit/c24158a))



## <small>1.0.1 (2023-10-26)</small>

* 1.0.1 ([637c256](https://github.com/IEBH/TERA-fy/commit/637c256))
* feat: DevMode toggling + better stylesheet handling + toggleFullscreen() ([cc96e76](https://github.com/IEBH/TERA-fy/commit/cc96e76))
* docs: Added LICENSE file ([5fa0933](https://github.com/IEBH/TERA-fy/commit/5fa0933))
* docs: Basic README ([749d8d6](https://github.com/IEBH/TERA-fy/commit/749d8d6))
* docs: Misc package.json fix ([c5b4ae4](https://github.com/IEBH/TERA-fy/commit/c5b4ae4))
* task: Added dist + docs auto-gen ([af4b6c1](https://github.com/IEBH/TERA-fy/commit/af4b6c1))
* task: Basic proof-of-concept ([835e175](https://github.com/IEBH/TERA-fy/commit/835e175))
* task: Cleanup package*.json ([9c3732c](https://github.com/IEBH/TERA-fy/commit/9c3732c))
* task: iFrame example (non-functional) ([d0b3b36](https://github.com/IEBH/TERA-fy/commit/d0b3b36))
* task: Initial commit + hello world demo ([b9559b5](https://github.com/IEBH/TERA-fy/commit/b9559b5))
* task: Proof-of-concept using iFrame + postMessage ([47c9af8](https://github.com/IEBH/TERA-fy/commit/47c9af8))
* task: Prototype app ([69b14c2](https://github.com/IEBH/TERA-fy/commit/69b14c2))
* task: Various cleanups now the solution has settled ([52fcc61](https://github.com/IEBH/TERA-fy/commit/52fcc61))
* fix: Comms now working ([74610c8](https://github.com/IEBH/TERA-fy/commit/74610c8))
* fix: Misc fixes ([8826eb4](https://github.com/IEBH/TERA-fy/commit/8826eb4))
* refactor: File rename ([79ab1cc](https://github.com/IEBH/TERA-fy/commit/79ab1cc))
