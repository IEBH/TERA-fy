# Changelog

# [1.6.0](https://github.com/IEBH/TERA-fy/compare/v1.5.0...v1.6.0) (2024-05-23)


### Bug Fixes

* Also watch plugins/ with `npm run watch` ([30b0f2f](https://github.com/IEBH/TERA-fy/commit/30b0f2f9121b7224ae2c8434ce0d1db62245978d))
* Better is-pojo detection when deep merging with Vue2 / $set ([6f14991](https://github.com/IEBH/TERA-fy/commit/6f149915e9fa995c99aa2406b57c5f6ac8ef87f9))
* Less noisy errors when trying to set the URL on an inactive tool session / embedded TERA iframe ([7a73e32](https://github.com/IEBH/TERA-fy/commit/7a73e329563338f9c4f40b7d77e4dc03fed0f5b3))
* Slight fixes for release-it scripting ([2a1c0b1](https://github.com/IEBH/TERA-fy/commit/2a1c0b120295a1c953ed676fed65d7e4988f7d54))
* Typo when syncing local->remote writes ([aed4511](https://github.com/IEBH/TERA-fy/commit/aed4511f901f3d589cf52603166c9e8adcbb1fc6))
* Vue2 handling for Array syncing ([6449261](https://github.com/IEBH/TERA-fy/commit/6449261aa0e6859aa7963c27ca899be1c31c740f))


### Features

* Much more verbosity during init() if its called for ([1a56267](https://github.com/IEBH/TERA-fy/commit/1a562671cd559948fa7b89fa40da2ee040990e58))
* setProjectState{Flush,Refresh}() ([c404a3d](https://github.com/IEBH/TERA-fy/commit/c404a3d63e1e40ebc9277c34b7e30f295d83fcb2))
* Yet more error reporting during client init() ([930e8cb](https://github.com/IEBH/TERA-fy/commit/930e8cbb4dec5d69e2593f7fb3401f8146cc8cb4))

# [1.5.0](https://github.com/IEBH/TERA-fy/compare/v1.4.4...v1.5.0) (2024-05-07)


### Features

* setPage{Url,Title}() functionality ([bc6d00f](https://github.com/IEBH/TERA-fy/commit/bc6d00f0ea7212587248b49ecefe839c9637ea33))

## [1.4.4](https://github.com/IEBH/TERA-fy/compare/v1.4.3...v1.4.4) (2024-05-07)


### Bug Fixes

* Allow raw access to the /dist/ directory for weirder imports ([42a3a85](https://github.com/IEBH/TERA-fy/commit/42a3a8535980efbed44b25460b37b271be3b818e))
* Mark setPageUrl as fixme ([f481e08](https://github.com/IEBH/TERA-fy/commit/f481e08d2ad3e4c8e78504ca9fa4c54b13ce23f0))

## [1.4.3](https://github.com/IEBH/TERA-fy/compare/v1.4.2...v1.4.3) (2024-05-07)

## [1.4.2](https://github.com/IEBH/TERA-fy/compare/v1.4.1...v1.4.2) (2024-05-02)


### Bug Fixes

* **plugins/vue2:** Deep Vue.set() for recursive objects ([9321d6f](https://github.com/IEBH/TERA-fy/commit/9321d6fbc54e4cf113c6fdce861a4a52d0a4b983))

## [1.4.1](https://github.com/IEBH/TERA-fy/compare/v1.4.0...v1.4.1) (2024-05-02)

# [1.4.0](https://github.com/IEBH/TERA-fy/compare/v1.3.2...v1.4.0) (2024-04-26)


### Bug Fixes

* Let release-it figure out the release increment ([a2be698](https://github.com/IEBH/TERA-fy/commit/a2be698edf902e61139864405fda1a55b764fa34))
* merge() subclassed method should take an iterative, not a single object ([4a33aca](https://github.com/IEBH/TERA-fy/commit/4a33aca4d39191249b7dca3a0a80b65ebdb2a7d2))


### Features

* TeraFy.projectLog() ([6207188](https://github.com/IEBH/TERA-fy/commit/6207188af85b481d020f57b50b103b1785094c10))

## [1.3.2](https://github.com/IEBH/TERA-fy/compare/v1.3.1...v1.3.2) (2024-04-18)


### Bug Fixes

* Various minor tweaks to keep ESLint happy ([c7e7f0d](https://github.com/IEBH/TERA-fy/commit/c7e7f0d26aff283acc85dd9f42f24015194f369d))
* Wrong API endpoint when setting file Blobs ([45aa6df](https://github.com/IEBH/TERA-fy/commit/45aa6df2bc3dafe056dfd9591c8b770bf0f66835))

## [1.3.1](https://github.com/IEBH/TERA-fy/compare/v1.3.0...v1.3.1) (2024-04-16)


### Bug Fixes

* Various missing fields for the ProjectFile interface ([8858a9f](https://github.com/IEBH/TERA-fy/commit/8858a9f1a523a9bb86b74e831b752f3fd562f02a))


### Features

* setProjectStateDefaults() can now accept an entire object to default-merge ([5d9a1f5](https://github.com/IEBH/TERA-fy/commit/5d9a1f5383c2d6de9ffa818b380c9cc669d42b85))

# [1.3.0](https://github.com/IEBH/TERA-fy/compare/v1.2.2...v1.3.0) (2024-04-15)


### Bug Fixes

* Export projectFile ([d4940f3](https://github.com/IEBH/TERA-fy/commit/d4940f3dfcb7c5da5b9a6fbfb2a600be60703ed8))


### Features

* ProjectFile.{serialize,deserialize}() functions ([d6c69f5](https://github.com/IEBH/TERA-fy/commit/d6c69f5a225b819d6fd63e7fc13670cadc8478e9))

## [1.2.2](https://github.com/IEBH/TERA-fy/compare/v1.2.1...v1.2.2) (2024-04-11)

## [1.2.1](https://github.com/IEBH/TERA-fy/compare/v1.2.0...v1.2.1) (2024-04-11)


### Bug Fixes

* Handle file meta data where created/modified/accessed dates are omitted for some reason ([1544723](https://github.com/IEBH/TERA-fy/commit/1544723ec6ce4478541a07baa0e44cb120f7e929))
* Handle nullish errors on RPC calls ([f873029](https://github.com/IEBH/TERA-fy/commit/f8730294e8a7dbf08602edf87ce2926695238592))



# [1.2.0](https://github.com/IEBH/TERA-fy/compare/v1.1.0...v1.2.0) (2024-04-11)


### Bug Fixes

* Wrong inherited argument when running setProjectLibrary() ([aaaca64](https://github.com/IEBH/TERA-fy/commit/aaaca641847aae9e7a72b4423282002e3b125e70))


### Features

* <tera-file-select> now supports save functionality ([e60b63e](https://github.com/IEBH/TERA-fy/commit/e60b63e36a5f757fec74922577ec701ae2f42d5e))
* More fixes and UX for file saving UI/UX ([7c4e1af](https://github.com/IEBH/TERA-fy/commit/7c4e1af0b5569af7a1c1aa1df29f47b24d464dc8))
* setProjectLibrary() can now prompt for a file path if none is specified ([62a5f03](https://github.com/IEBH/TERA-fy/commit/62a5f031c0b6ef9f8b72dfee335e4fa79fdffdfb))



# [1.1.0](https://github.com/IEBH/TERA-fy/compare/v1.0.24...v1.1.0) (2024-04-09)


### Bug Fixes

* Yet more files added to prerelease step ([399c6f8](https://github.com/IEBH/TERA-fy/commit/399c6f8d6c5080238c079c12b16add7eebeb1d7e))


### Features

* File saving UI ([b2f8809](https://github.com/IEBH/TERA-fy/commit/b2f8809a960880b951072127d7492b31aa29b03a))



## [1.0.24](https://github.com/IEBH/TERA-fy/compare/v1.0.23...v1.0.24) (2024-04-05)


### Bug Fixes

* Yet another fix for setProjectState() throwing when trying to save + remove defunct {sync:Boolean} option ([4e320ec](https://github.com/IEBH/TERA-fy/commit/4e320ec8f171237387db7404a7209b4ca51898c8))



## [1.0.23](https://github.com/IEBH/TERA-fy/compare/v1.0.22...v1.0.23) (2024-04-04)



## [1.0.22](https://github.com/IEBH/TERA-fy/compare/v1.0.21...v1.0.22) (2024-04-04)


### Bug Fixes

* Missing Promise chain response during setProjectState() ([1fb7f29](https://github.com/IEBH/TERA-fy/commit/1fb7f29d01103f2396f89dd31928dabb48150328))



## [1.0.21](https://github.com/IEBH/TERA-fy/compare/v1.0.20...v1.0.21) (2024-04-03)


### Bug Fixes

* Added projectFile class build to frontend scripts ([b21fe29](https://github.com/IEBH/TERA-fy/commit/b21fe29cdb20c67307e0c5cd6d4d73d945a33b8e))
* Missing dep ([9bf58e4](https://github.com/IEBH/TERA-fy/commit/9bf58e467a89886ca5c17c3209a503df2c7dba26))


### Features

* More edits to <tera-file-select/> ([efc49f7](https://github.com/IEBH/TERA-fy/commit/efc49f7fc81d02081cfd4cb17fe6dfec9a12969b))
* Moved ProjectLibrary file into its own classdef + added more file setter methods ([6c8eac3](https://github.com/IEBH/TERA-fy/commit/6c8eac3c9c853f5f5cf367dea82062b236163f9f))
* Stash + retrieve login data from LocalStorage when using embed + popup window workaround method ([e9ec32c](https://github.com/IEBH/TERA-fy/commit/e9ec32c253c2cb3bd7c8312cd2ad61432b24542a))



## [1.0.20](https://github.com/IEBH/TERA-fy/compare/v1.0.19...v1.0.20) (2024-04-02)


### Bug Fixes

* Yet more $auth screw-around with window.opener magic ([d140da1](https://github.com/IEBH/TERA-fy/commit/d140da1d7760713b35ffca58a688c638f094869e))



## [1.0.19](https://github.com/IEBH/TERA-fy/compare/v1.0.18...v1.0.19) (2024-04-02)


### Features

* Start on <tera-library-select/> Vue component ([aa42855](https://github.com/IEBH/TERA-fy/commit/aa42855df0b4e32b0b3a08e4e86021faf3ac8ca6))



## [1.0.18](https://github.com/IEBH/TERA-fy/compare/v1.0.17...v1.0.18) (2024-04-02)


### Bug Fixes

* Auto call to requireProject() in Vue2 mode ([f592cfb](https://github.com/IEBH/TERA-fy/commit/f592cfbd0c2f9373b1fb95203684ebb3b2acf81b))
* Dont rely on server auth populating $auth.user.id ([73f8c85](https://github.com/IEBH/TERA-fy/commit/73f8c85c17d6e79184ecc5b9929739da33b57786))
* Logic error when setting project state ([7fcd826](https://github.com/IEBH/TERA-fy/commit/7fcd8265d2f15f28df99b0271396e9467ab91a20))
* Subclass _pathSet() when in Vue2 mode ([ea5537e](https://github.com/IEBH/TERA-fy/commit/ea5537e34d11170b3296d75861425a0db162f0ba))


### Features

* Added method to try authenticating locally via a popup when in embedded mode ([7286958](https://github.com/IEBH/TERA-fy/commit/72869585c7f203f330815c9dba5f4b0f36a350e8))
* Added prototype window mode for client ([9241854](https://github.com/IEBH/TERA-fy/commit/92418548dfd213396acb082acf9dae08b441a374))
* Added subclassable {has,get,set}Path methods to client for state setting ([a4acedf](https://github.com/IEBH/TERA-fy/commit/a4acedf214af3cc612b2a1a1975070dc6ee87015))
* Button selection when using uiAlert() ([118223f](https://github.com/IEBH/TERA-fy/commit/118223fb3407b5c58c79aeeb37053b4fab9a6d0f))
* getUser({forceRetry:Boolean}) ([15b8efd](https://github.com/IEBH/TERA-fy/commit/15b8efd521486326652afb692dd816f10a30940b))
* uiSplat() + uiWindow() ([a72fc33](https://github.com/IEBH/TERA-fy/commit/a72fc33e05c64d4428ef4c747684504edc51bd09))



## [1.0.17](https://github.com/IEBH/TERA-fy/compare/v1.0.16...v1.0.17) (2024-03-14)


### Bug Fixes

* Typo ([98fad09](https://github.com/IEBH/TERA-fy/commit/98fad09c2c875b2b6b7158afb5d77ae41ecb6e65))


### Features

* Filled out stubs for {get,set,select}ProjectLibrary() ([0bdbfd9](https://github.com/IEBH/TERA-fy/commit/0bdbfd943e2613d917be8c64e22893ab8fcb1b86))



## [1.0.16](https://github.com/IEBH/TERA-fy/compare/v1.0.15...v1.0.16) (2024-03-06)


### Bug Fixes

* Dont try to inject undef values when devmode is enabled but the site URL isnt a string ([47598b2](https://github.com/IEBH/TERA-fy/commit/47598b25ad82e6e7cd9eb11fa304bce94595073f))


### Features

* getLibraryFile() now supports multiple file transforms before handing contents to requester ([e413bd9](https://github.com/IEBH/TERA-fy/commit/e413bd9e91f3e152ecf334f96d276d6a89d6ea66))



## [1.0.15](https://github.com/IEBH/TERA-fy/compare/v1.0.14...v1.0.15) (2024-02-29)


### Features

* requireUser() + call to it from requireProject() ([d4eedfa](https://github.com/IEBH/TERA-fy/commit/d4eedfa97fb744298db9c8c04fcb79834c86ad4d))
* uiAlert() ([09da928](https://github.com/IEBH/TERA-fy/commit/09da9282beb00fc644bcde34a583b4b16f9f2854))



## [1.0.14](https://github.com/IEBH/TERA-fy/compare/v1.0.13...v1.0.14) (2024-02-27)


### Bug Fixes

* yet more fixes to Live version of TERA-fy deployed to Live TERA ([f72fb8d](https://github.com/IEBH/TERA-fy/commit/f72fb8de2329d63aa1cacc2e6c962f9370a2c75a))



## [1.0.13](https://github.com/IEBH/TERA-fy/compare/v1.0.12...v1.0.13) (2024-02-27)


### Bug Fixes

* Wrong DOM reference when searching for external iFrame from top-level TERA window ([51a0ab8](https://github.com/IEBH/TERA-fy/commit/51a0ab8df52de8a4822dc62e3b3318187cd94dcb))
* Wrong external referencing for Vue2 plugin ([ddd7068](https://github.com/IEBH/TERA-fy/commit/ddd7068fb0e00fa6d203cf5d4650f4138595aaa6))


### Features

* Added @vue/cli-service compatible version (ESM + ES2019 spec) ([56501c9](https://github.com/IEBH/TERA-fy/commit/56501c97d4f2f30d908d2d1db7d847495183bf99))
* TERA-fy client can now opt-in to sandbox overrides in dev mode ([550ac9c](https://github.com/IEBH/TERA-fy/commit/550ac9c953cdcf1b47c834dcd9b59de3235663d6))



## [1.0.12](https://github.com/IEBH/TERA-fy/compare/v1.0.11...v1.0.12) (2024-02-22)


### Bug Fixes

* Tweaks to what is included in the NPM tarball ([e2cf7e0](https://github.com/IEBH/TERA-fy/commit/e2cf7e0cf8c23c55cf7b02c209046e368efa88c5))


### Features

* Added setProjectStateDefaults() to make priming defaults easier ([55a6ce8](https://github.com/IEBH/TERA-fy/commit/55a6ce8ecad1ed43a27bd41664ad031e1fc62997))



## [1.0.11](https://github.com/IEBH/TERA-fy/compare/v1.0.10...v1.0.11) (2024-02-21)


### Bug Fixes

* Added @mfdc/supabase-reactive as a dep for the Vue plugins ([2f7900d](https://github.com/IEBH/TERA-fy/commit/2f7900d86bc45c556b383756a0b1af30d35d43e5))


### Features

* Added events / EventEmitter pattern to accept flushed updates from server ([458ce79](https://github.com/IEBH/TERA-fy/commit/458ce799ad9acf68732489efed56da5a0917cd95))
* Client can now tell server where its loaded from via setServerMode() ([b7c5fc0](https://github.com/IEBH/TERA-fy/commit/b7c5fc0cb18df2c9d39a4f63a32dd93da28e89fa))
* Updated Vue plugins (2+3) to handle remote project state changes ([0abf7b4](https://github.com/IEBH/TERA-fy/commit/0abf7b44fff25530af6430856850c5743172df2e))



## [1.0.10](https://github.com/IEBH/TERA-fy/compare/v1.0.9...v1.0.10) (2024-02-18)


### Bug Fixes

* Better reaction when there is no active user login ([48bd61f](https://github.com/IEBH/TERA-fy/commit/48bd61fe71509e6c68ea8fcba90f6f2297b721bf))
* Debugging artefacts ([61d559b](https://github.com/IEBH/TERA-fy/commit/61d559b62f1d9cbc1d12ff4b9f65b71af7d48429))
* Dont allow plugins to override the main init() function - instead call them after that function has done its work ([7db3ba0](https://github.com/IEBH/TERA-fy/commit/7db3ba09a13dc87b70df192f55585d2fc09a3931))
* Plugins init() functions are now called AFTER all other init functionaly has finished + they are called with the outer object context ([4757597](https://github.com/IEBH/TERA-fy/commit/4757597324873c953e4d93994776eff4030b985c))
* **plugins/vue2:** Handle Vue2 giving us a broken diff on Observable write ([d72a143](https://github.com/IEBH/TERA-fy/commit/d72a143cda01478d46a86a0bf9863cf9203b903a))


### Features

* createProjectStatePatch() to avoid having to do this manually in each plugin ([5414a22](https://github.com/IEBH/TERA-fy/commit/5414a227bba8968108f0b6d65c766dc2a642acc9))
* init() can now accept an options object ([0ee55b7](https://github.com/IEBH/TERA-fy/commit/0ee55b77ff1178b73c4d749db509d06315da1afc))
* Prototype project subscription process (untested) ([f13b957](https://github.com/IEBH/TERA-fy/commit/f13b9578d9e725b3d4d886120d28365893da9bcb))
* Various project-state patch handling functionality now implemented ([8260808](https://github.com/IEBH/TERA-fy/commit/8260808f67c1c3149db487ce61edb4e75d9a3661))
* **vue2:** Largish refactor to support Vue2 + Vue3 plugins ([2abcecc](https://github.com/IEBH/TERA-fy/commit/2abcecc1c95e68a7680a13ae54bebcb70d61d930))



## [1.0.9](https://github.com/IEBH/TERA-fy/compare/v1.0.8...v1.0.9) (2023-11-09)


### Features

* **getProjectFiles:** Added getProjectFiles() ([b3804a5](https://github.com/IEBH/TERA-fy/commit/b3804a5433610943cc46b1e5fba68558bbed77b9))
* getProjectLibrary() now working ([019dacd](https://github.com/IEBH/TERA-fy/commit/019dacd1c677564e66688acf0b6bea2d39dca5e3))



## [1.0.8](https://github.com/IEBH/TERA-fy/compare/v1.0.7...v1.0.8) (2023-11-02)


### Bug Fixes

* **plugins/vue:** Various load race conditions for the Vue loader ([aa9c77c](https://github.com/IEBH/TERA-fy/commit/aa9c77cb896d5cba70a59295796b10d6b27cb52e))


### Features

* Tera-Fy can now communicate upwards (window.parent) or downwards (via iFrame) depending on its active context ([0c8d30d](https://github.com/IEBH/TERA-fy/commit/0c8d30dcf6398578a535a04e70ff2c481683ff46))



## [1.0.7](https://github.com/IEBH/TERA-fy/compare/v1.0.6...v1.0.7) (2023-11-02)


### Bug Fixes

* Misc fixes ([2bd5e03](https://github.com/IEBH/TERA-fy/commit/2bd5e035dd861e7baa8203d3dc5fb206b78aefbc))


### Features

* **plugins/vue:** Better project + project list binding ([2d46189](https://github.com/IEBH/TERA-fy/commit/2d4618956cf8c7201a8e39f8bf0dc33513f726a5))



## [1.0.6](https://github.com/IEBH/TERA-fy/compare/v1.0.5...v1.0.6) (2023-11-01)


### Bug Fixes

* Better error tracking methods with CLIENT|SERVER.debug() + try barriers around sendRaw() ([b4062b3](https://github.com/IEBH/TERA-fy/commit/b4062b30075403708427b1c58d308d34777997e9))
* client.init() now returns its own instance in the promise payload so it can be awaited ([05d6611](https://github.com/IEBH/TERA-fy/commit/05d66117bf7578f076472bc4d59be1df10e85cb3))
* Minor typo in package when generating docs ([626a7fc](https://github.com/IEBH/TERA-fy/commit/626a7fc6f3867f95dd7efa4cf1ca6875ae25c1f6))
* Placehoder in Vue plugin to load basic project skeleton ([f530e51](https://github.com/IEBH/TERA-fy/commit/f530e5116e1a51652038df3a81a1e629d84755f7))



## [1.0.5](https://github.com/IEBH/TERA-fy/compare/v1.0.4...v1.0.5) (2023-10-31)


### Bug Fixes

* Change default tera-tools endpoint to live site ([ca4a595](https://github.com/IEBH/TERA-fy/commit/ca4a59548751f1afdb1a6309868de73b2dda81d6))
* Various fixes to the mixin infrastructure ([27ce126](https://github.com/IEBH/TERA-fy/commit/27ce126225f3b5faa06700efa9e6c87b38da33ef))



## [1.0.4](https://github.com/IEBH/TERA-fy/compare/v1.0.3...v1.0.4) (2023-10-27)


### Features

* Added TeraFy.set() + minor fixes ([ccf2221](https://github.com/IEBH/TERA-fy/commit/ccf222160aeb23b98c619f75da31099026df8544))
* Implemented prototype plugin structure ([4a35743](https://github.com/IEBH/TERA-fy/commit/4a357434606e0491b3626eacfbd3ff2307a341f0))



## [1.0.3](https://github.com/IEBH/TERA-fy/compare/v1.0.2...v1.0.3) (2023-10-26)


### Bug Fixes

* getProjectStateSnapshot() wasnt actually returning a result ([db1c572](https://github.com/IEBH/TERA-fy/commit/db1c572116c73f8dfdff8ace23f486afb9b8953c))



## [1.0.2](https://github.com/IEBH/TERA-fy/compare/v1.0.1...v1.0.2) (2023-10-26)


### Features

* Ping-pong RPC support with server<->client, added support for contexts to carry messages on server side ([15b970d](https://github.com/IEBH/TERA-fy/commit/15b970d0fa187c935f0dd7c2aba2d630e9e59b98))
* setActiveProject() ([c24158a](https://github.com/IEBH/TERA-fy/commit/c24158acca0cb7fc9e50b817e60a0644bbadf16e))



## [1.0.1](https://github.com/IEBH/TERA-fy/compare/74610c8b8347cb9e5e9b198d2caa0e9b1c6259f4...v1.0.1) (2023-10-26)


### Bug Fixes

* Comms now working ([74610c8](https://github.com/IEBH/TERA-fy/commit/74610c8b8347cb9e5e9b198d2caa0e9b1c6259f4))
* Misc fixes ([8826eb4](https://github.com/IEBH/TERA-fy/commit/8826eb4f134ed921becdeb6fdc48a9d5b1cb716e))


### Features

* DevMode toggling + better stylesheet handling + toggleFullscreen() ([cc96e76](https://github.com/IEBH/TERA-fy/commit/cc96e7659e02bee4410a07f319d34a1acdb001ec))
