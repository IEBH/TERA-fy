# Changelog

# [1.15.0](https://github.com/IEBH/TERA-fy/compare/v1.14.2...v1.15.0) (2024-11-13)


### feat

* Added write throttle to bindProjectState() ([a86afc0](https://github.com/IEBH/TERA-fy/commit/a86afc0a397682e28e5a9c658e06cc827f9986db))
* All clients now have a unique session ID ([5c4d24d](https://github.com/IEBH/TERA-fy/commit/5c4d24db0a54392ee165594f09cd4b0a214015df))
* Transmit session ID with project state patches ([f31f52a](https://github.com/IEBH/TERA-fy/commit/f31f52a2eaef30e9a4d5dcfad5d08ae7a9b43c60))
* uiDie() ([bc144c4](https://github.com/IEBH/TERA-fy/commit/bc144c4288bb3b1fd01f3cc10e88b9884b981539))

### fix

* Always return a promise for handshakeLoop() ([cab3e60](https://github.com/IEBH/TERA-fy/commit/cab3e60e2ba34db148dcdbb6fc127d0d9da0d0df))
* Better handling for modeOverrides - dont stomp on URL if the user has already overriden it ([e5d847b](https://github.com/IEBH/TERA-fy/commit/e5d847b0b60a84766460496f7b38c28d21c5f729))
* Local dev mode fixes for TERA-fy client mode ([e9c0697](https://github.com/IEBH/TERA-fy/commit/e9c06977b434ff6c2e9ac305301cc5d9e85c7bd3))

### refactor

* Move from a ignoreCount model to a did-i-do-that model for state patching ([1f560ac](https://github.com/IEBH/TERA-fy/commit/1f560acced09f0296bf7c17766f0c4085a57ee95))

## [1.14.2](https://github.com/IEBH/TERA-fy/compare/v1.14.1...v1.14.2) (2024-11-01)


### fix

* Wrong body text binding with UIConfirm ([ecd870c](https://github.com/IEBH/TERA-fy/commit/ecd870c4460a7021853220a6bc34756a9f425430))

## [1.14.1](https://github.com/IEBH/TERA-fy/compare/v1.14.0...v1.14.1) (2024-10-17)


### docs

* Stale docs for setProjectFileContents() ([e9e8867](https://github.com/IEBH/TERA-fy/commit/e9e8867db3d23415ecfa6f6daf7f15ed98ab5954))

# [1.14.0](https://github.com/IEBH/TERA-fy/compare/v1.13.4...v1.14.0) (2024-10-17)


### devops

* Changed CHANGELOG format angular -> eslint ([9461445](https://github.com/IEBH/TERA-fy/commit/946144560893d9bb738f4aacb0b9f4c3cee5cf77))

### docs

* Nicer TOC for the documentation structure ([5aa6088](https://github.com/IEBH/TERA-fy/commit/5aa6088bf720022dac134099c69b2e81a1c38dd2))
* Removed outdated Playground links ([cafe9a5](https://github.com/IEBH/TERA-fy/commit/cafe9a5699a6e67dfe992c642921cc562ccfe23c))

### fix

* Typos and missing function headers ([34b1267](https://github.com/IEBH/TERA-fy/commit/34b1267735c2c1849a98ed11aca2c70c5bc9635e))

### refactor

* setProjectFile() -> setProjectFileContents() inline with naming convention ([0a45f44](https://github.com/IEBH/TERA-fy/commit/0a45f44f02394c40e0d9d9a014431af5dcd55f13))

## [1.13.5](https://github.com/IEBH/TERA-fy/compare/v1.13.4...v1.13.5) (2024-10-17)


### devops

* Changed CHANGELOG format angular -> eslint ([9461445](https://github.com/IEBH/TERA-fy/commit/946144560893d9bb738f4aacb0b9f4c3cee5cf77))

### docs

* Nicer TOC for the documentation structure ([5aa6088](https://github.com/IEBH/TERA-fy/commit/5aa6088bf720022dac134099c69b2e81a1c38dd2))
* Removed outdated Playground links ([cafe9a5](https://github.com/IEBH/TERA-fy/commit/cafe9a5699a6e67dfe992c642921cc562ccfe23c))

### fix

* Typos and missing function headers ([34b1267](https://github.com/IEBH/TERA-fy/commit/34b1267735c2c1849a98ed11aca2c70c5bc9635e))

### refactor

* setProjectFile() -> setProjectFileContents() inline with naming convention ([0a45f44](https://github.com/IEBH/TERA-fy/commit/0a45f44f02394c40e0d9d9a014431af5dcd55f13))

## [1.13.4](https://github.com/IEBH/TERA-fy/compare/v1.13.3...v1.13.4) (2024-07-24)


### chore

* Bump @mfdc/eslint-config ([57f2d4a](https://github.com/IEBH/TERA-fy/commit/57f2d4aa28f78b30effd18574488e782ca9eab5b))
* Bump various NPMs ([82dc091](https://github.com/IEBH/TERA-fy/commit/82dc0912217523d5acf36f3efe99642f92d606ca))
* release v1.13.4 ([07e3914](https://github.com/IEBH/TERA-fy/commit/07e3914ae9a11292c0cfc3a1070553bd0a45e041))

### fix

* ProjectFile.teraUrl should never assume we are using the base tera-tools.com domain - accept any source ([87f417b](https://github.com/IEBH/TERA-fy/commit/87f417ba9b186e822a0045911011ffd4eb15e171))

### refactor

* Eslint comment level fixups ([7db5e3c](https://github.com/IEBH/TERA-fy/commit/7db5e3c030e26764bf91f9c8920805f81e579212))



## [1.13.3](https://github.com/IEBH/TERA-fy/compare/v1.13.2...v1.13.3) (2024-07-13)


### chore

* release v1.13.3 ([952ef4d](https://github.com/IEBH/TERA-fy/commit/952ef4d01d4b93c062205de7612e73cef78a668e))

### devops

* Move proxy destination to dev.tera-tools.com ([57eb2ad](https://github.com/IEBH/TERA-fy/commit/57eb2ad209e2d1cc28e3046f8f3d1229bbfb3f6a))

### refactor

* $tera.setPage{Url,Title} -> .setPage({path:String, title:String}) ([4d4efc5](https://github.com/IEBH/TERA-fy/commit/4d4efc5df3ae07ef5da2867895dbb50d4de5022b))
* Redirect client-mode Tera instances to dev.tera-tools.com + allow restrictOrigin policy ([cac14eb](https://github.com/IEBH/TERA-fy/commit/cac14eb1f79000dedf27ea216b8b848ef012ff65))



## [1.13.2](https://github.com/IEBH/TERA-fy/compare/v1.13.1...v1.13.2) (2024-07-11)


### chore

* release v1.13.2 ([8cbe700](https://github.com/IEBH/TERA-fy/commit/8cbe700b4c151cabad34107019f5d84e9415958e))

### refactor

* Be less fussy when trying to emit to clients that dont exist ([b0f4d12](https://github.com/IEBH/TERA-fy/commit/b0f4d1264898133e58d025d2a3ae107869b560b6))



## [1.13.1](https://github.com/IEBH/TERA-fy/compare/v1.13.0...v1.13.1) (2024-07-10)


### chore

* release v1.13.1 ([a029fd5](https://github.com/IEBH/TERA-fy/commit/a029fd5628edbfd1c65bd6b1abe587716169d686))

### refactor

* More consistant argument pattern for ui* functions ([5faa0f2](https://github.com/IEBH/TERA-fy/commit/5faa0f2ede48f4ec87baf41cc7a604a9ee81030f))



# [1.13.0](https://github.com/IEBH/TERA-fy/compare/v1.12.0...v1.13.0) (2024-07-09)


### chore

* Bump eslint to latest ([e864ff2](https://github.com/IEBH/TERA-fy/commit/e864ff21d7ba1b0a7489ca5288c4406961e07edc))
* release v1.13.0 ([08045a2](https://github.com/IEBH/TERA-fy/commit/08045a2463d1afbaf1eb124bee2e10119dcb8f74))
* Various NPM updates ([fa1ffc1](https://github.com/IEBH/TERA-fy/commit/fa1ffc12f50bb1c9741835be704c22e7be67089c))

### feat

* Debugging functionality to watch patch paths via `{debugPaths: Array<String|Array>}` ([23003bc](https://github.com/IEBH/TERA-fy/commit/23003bcbf248a72c872fc1c504b552df6868a3a3))
* uiConfirm(), uiPrompt() & uiThrow() ([32f4378](https://github.com/IEBH/TERA-fy/commit/32f4378ea686cf89f2a36256bcc9d35d8ac2b23a))

### fix

* Issue where minimize/maximize screwed around with local dev mode focusRequest() state ([68d547c](https://github.com/IEBH/TERA-fy/commit/68d547c48c9cdee6aa2a018d8d8372c336ffdb69))
* Stop trying to handshake after timeout has tripped ([cc11595](https://github.com/IEBH/TERA-fy/commit/cc11595b7a2e057b5bd8715dc762b0e7b56f3d86))



# [1.12.0](https://github.com/IEBH/TERA-fy/compare/v1.11.5...v1.12.0) (2024-07-04)


### chore

* release v1.12.0 ([284ec76](https://github.com/IEBH/TERA-fy/commit/284ec76a5d12e7132c92f3e0990f892aac0f18ed))

### fix

* Better handling of TERA-fy server running in top-level mode and no iframes being present on the page ([31d2785](https://github.com/IEBH/TERA-fy/commit/31d2785344e525f4dd561cbc3e0b6b9696058f70))
* Dead code ([6c84c51](https://github.com/IEBH/TERA-fy/commit/6c84c51292ee55d6896d5eb61809332f1924b08f))
* Dont use the faulty jsonpatch.com standard as object keys dont get correctly escaped ([949cb14](https://github.com/IEBH/TERA-fy/commit/949cb14c01039c9c1e33baf9fd8742a14ee18a74))



## [1.11.5](https://github.com/IEBH/TERA-fy/compare/v1.11.4...v1.11.5) (2024-07-03)


### chore

* release v1.11.5 ([42e43b3](https://github.com/IEBH/TERA-fy/commit/42e43b38a921bbb90d85d29f1bd46eea16cd8ee7))

### fix

* Idiot level typo caused state to always revert back to baseline for Vue@3 plugins ([e237a68](https://github.com/IEBH/TERA-fy/commit/e237a680ade686efd0e1bdee930ce9e5d77690d6))



## [1.11.4](https://github.com/IEBH/TERA-fy/compare/v1.11.0...v1.11.4) (2024-07-02)


### chore

* Bump release-it to latest ([c9d947d](https://github.com/IEBH/TERA-fy/commit/c9d947db342547cdd1ee62e1fd460968d333b323))
* release v1.11.4 ([1fab0e5](https://github.com/IEBH/TERA-fy/commit/1fab0e5ccc60bc1adf62ff56211593803910c520))
* Version bump ([c54de66](https://github.com/IEBH/TERA-fy/commit/c54de6645fb2364820493f0f55f1e5a1862edfb9))
* Version bump ([099a1d4](https://github.com/IEBH/TERA-fy/commit/099a1d48a1ea48e30fdc6899d4dfc48e917f4412))

### fix

* Attempting to apply defaults to a path that doesnt exist resulted in a dangling-pointer ([b98aec8](https://github.com/IEBH/TERA-fy/commit/b98aec8f91d0f14899184d05fe7248d35e2b631b))
* Typo ([cfbdc08](https://github.com/IEBH/TERA-fy/commit/cfbdc087267626d4ef70f0d976c9b4338d732d23))

### ux

* More patch information when debug mode is enabled ([c0508a6](https://github.com/IEBH/TERA-fy/commit/c0508a6d747c752a0f86322b8eabed7fbb69fa5c))
* Start tera debug mode minimized + provide toggle support ([d9ecdab](https://github.com/IEBH/TERA-fy/commit/d9ecdab196d721cc5a62bc2735bc3e7cd0e4aace))



# [1.11.0](https://github.com/IEBH/TERA-fy/compare/v1.10.0...v1.11.0) (2024-06-25)


### chore

* release v1.11.0 ([d8dbf6c](https://github.com/IEBH/TERA-fy/commit/d8dbf6c354d5de26e547976f8dae7c80aabbc399))

### feat

* Much better handshake handling for the various initComms() profiles ([6de5e9b](https://github.com/IEBH/TERA-fy/commit/6de5e9bc15b2df89942d82f782fc7123eea6fb13))



# [1.10.0](https://github.com/IEBH/TERA-fy/compare/v1.9.1...v1.10.0) (2024-06-08)


### chore

* release v1.10.0 ([65a0ceb](https://github.com/IEBH/TERA-fy/commit/65a0cebd06595add2149d1b11b5e619efcdc2bde))

### feat

* Added uiProgress() functionality ([371094d](https://github.com/IEBH/TERA-fy/commit/371094d598161b7eecbf61c4295d8c26d527d449))

### fix

* More file content handling functionality ([ca96f04](https://github.com/IEBH/TERA-fy/commit/ca96f045ecc4551f58ed6512485c97bc6a2f7878))
* Use correct dialog title when handling files ([0d261e7](https://github.com/IEBH/TERA-fy/commit/0d261e72fc992a5d8e6a18ba9b024e8d1cf37984))



## [1.9.1](https://github.com/IEBH/TERA-fy/compare/v1.9.0...v1.9.1) (2024-06-06)


### chore

* release v1.9.1 ([5fc37dd](https://github.com/IEBH/TERA-fy/commit/5fc37dd44fa96335779467d63b7942f132c5a4b8))

### fix

* Debugging artefacts ([5642606](https://github.com/IEBH/TERA-fy/commit/56426062d7184bfe898527adab75ecc71cf31ab8))
* Spelling errors ([ce96424](https://github.com/IEBH/TERA-fy/commit/ce96424e83f689d5c5203a80140801c0115546e5))



# [1.9.0](https://github.com/IEBH/TERA-fy/compare/v1.8.0...v1.9.0) (2024-06-06)


### chore

* release v1.9.0 ([949cc61](https://github.com/IEBH/TERA-fy/commit/949cc618b1b0a88945d1722de0d555b70faada39))



# [1.8.0](https://github.com/IEBH/TERA-fy/compare/v1.7.4...v1.8.0) (2024-06-04)


### chore

* release v1.8.0 ([34d4076](https://github.com/IEBH/TERA-fy/commit/34d40769da484ca381e86c8293a2f0807a6cea4a))

### docs

* Added stubs for some plugins + vite config ([ca7cbeb](https://github.com/IEBH/TERA-fy/commit/ca7cbeba8ee36afd27925fcbab26a2a5e4cac760))
* Minor doc update for lazy file fetching ([3c8535d](https://github.com/IEBH/TERA-fy/commit/3c8535d23006bc264913eef11c3e6cad6e6f5ba0))

### feat

* Add stub for uiProgress (unfinished implementation) ([402d181](https://github.com/IEBH/TERA-fy/commit/402d1810fb679782088728958140304cb0eba9c9))
* Added plugins/vite ([3d48f3b](https://github.com/IEBH/TERA-fy/commit/3d48f3b7a2c52648f5757d267606dec9800d08a0))
* More init debug steps + transmit server verbosity as first action ([8cb6e52](https://github.com/IEBH/TERA-fy/commit/8cb6e5221883079158af508be552eea7055fedc2))
* setServerVerbosity() ([a0f7f77](https://github.com/IEBH/TERA-fy/commit/a0f7f77d7c95e43a1cea0f73fb199a513a561b55))
* toggleDevMode() now also accepts the "proxy" meta value to switch to local proxy-forwarding mode ([d2fa61d](https://github.com/IEBH/TERA-fy/commit/d2fa61d6c584a7489ea18b3f48d28e5ab91cf682))

### fix

* Remove secondary /project path segment when computing ProjectFile.teraUrl ([18ad085](https://github.com/IEBH/TERA-fy/commit/18ad085e77df9e9c1e5deb4a84f5d888df6255c3))
* Updated default port to match TERA proxy deployment ([6904dfc](https://github.com/IEBH/TERA-fy/commit/6904dfcf4505a2989733e5a46537ef140aedadea))

### refactor

* Change behaviour of set{,IfDev}() to ignore nullish values ([e24e4de](https://github.com/IEBH/TERA-fy/commit/e24e4defddf70e5b0d63418ee9204647364cd25e))
* Moved proxy functionality into a universal module ([0e80fbc](https://github.com/IEBH/TERA-fy/commit/0e80fbc66b06d58bd032150a66d60f2ac758cafa))

### task

* Add export for proxy library ([0c891aa](https://github.com/IEBH/TERA-fy/commit/0c891aaf1a2d7d328a446f5d1d4b44346de8fd11))



## [1.7.4](https://github.com/IEBH/TERA-fy/compare/v1.7.3...v1.7.4) (2024-05-31)


### chore

* release v1.7.4 ([1dd8cce](https://github.com/IEBH/TERA-fy/commit/1dd8cce3562e4f49d2b7f40831dbd0af623c0407))

### fix

* Route file fetching through the TERA $project service instead of the raw $supabase feed ([2e0ef7f](https://github.com/IEBH/TERA-fy/commit/2e0ef7f254d7b46315447788104fd4b773c54507))

### refactor

* Change from using private properties to old-style underscore + defineProperties to get non-enumerable functionality ([431a34b](https://github.com/IEBH/TERA-fy/commit/431a34b154b41ebdc83c64695e2eddb9cf1e6695))



## [1.7.3](https://github.com/IEBH/TERA-fy/compare/v1.7.2...v1.7.3) (2024-05-31)


### chore

* release v1.7.3 ([66937f0](https://github.com/IEBH/TERA-fy/commit/66937f029b39b8dd9f83f2381da825db7c463364))

### fix

* Wrong entity when debugging in Vue3 plugin ([1e6bbed](https://github.com/IEBH/TERA-fy/commit/1e6bbed893f3df41e10f52f4a61bfa34a7dbc965))



## [1.7.2](https://github.com/IEBH/TERA-fy/compare/v1.7.1...v1.7.2) (2024-05-31)


### chore

* release v1.7.2 ([be5d19d](https://github.com/IEBH/TERA-fy/commit/be5d19d9df8d490b98e0a5f30117e3e74f6c2f7f))

### fix

* Stupid typo upsets some build resolution systems ([c62a4a3](https://github.com/IEBH/TERA-fy/commit/c62a4a322be1d646b9b235073f97736ab0bc614f))



## [1.7.1](https://github.com/IEBH/TERA-fy/compare/v1.7.0...v1.7.1) (2024-05-31)


### chore

* release v1.7.1 ([0fed293](https://github.com/IEBH/TERA-fy/commit/0fed293ab5faed53db4fe570ada55428cb4893c3))

### fix

* Stupid typo upsets some build resolution systems ([9b2aa1f](https://github.com/IEBH/TERA-fy/commit/9b2aa1f8a1b640b59a08eb78671e30c2e8fae29d))



# [1.7.0](https://github.com/IEBH/TERA-fy/compare/v1.6.1...v1.7.0) (2024-05-28)


### chore

* release v1.7.0 ([4d4b1f3](https://github.com/IEBH/TERA-fy/commit/4d4b1f3984d814e554424dd9d10b008eabaa2351))

### feat

* Added more file operation - creation of stubs + file removal + nicer getProjectFile() handling ([ec68885](https://github.com/IEBH/TERA-fy/commit/ec6888540bdecbf077cedccad55be46a78a09993))

### fix

* Actually write the file when using setProjectLibrary() ([282e710](https://github.com/IEBH/TERA-fy/commit/282e710197320f10264d7a13b45ba4c62f7f0594))
* Used wrong filename when passing output to RefLib for file write ([e9d36d8](https://github.com/IEBH/TERA-fy/commit/e9d36d857a17a88f05db42a5d4c13ed409adb4d0))



## [1.6.1](https://github.com/IEBH/TERA-fy/compare/v1.6.0...v1.6.1) (2024-05-27)


### chore

* release v1.6.1 ([ba64589](https://github.com/IEBH/TERA-fy/commit/ba64589f5577c4d855184181b91696400f267ca9))

### docs

* Missing labels + whitespace ([ad433a6](https://github.com/IEBH/TERA-fy/commit/ad433a6d0053fc5a9cd1bdc5c857a90e8a28c1d5))

### refactor

* Move from annoying Supabase absolute URLs to using a new file ID based system for file handling ([0328e96](https://github.com/IEBH/TERA-fy/commit/0328e969a00b7670e4cc0b28d3a1e218c80a80a0))



# [1.6.0](https://github.com/IEBH/TERA-fy/compare/v1.5.0...v1.6.0) (2024-05-23)


### chore

* release v1.6.0 ([6afdefb](https://github.com/IEBH/TERA-fy/commit/6afdefbc754f92778a1dcfe6e3d3b12a962fc32c))

### feat

* Much more verbosity during init() if its called for ([1a56267](https://github.com/IEBH/TERA-fy/commit/1a562671cd559948fa7b89fa40da2ee040990e58))
* setProjectState{Flush,Refresh}() ([c404a3d](https://github.com/IEBH/TERA-fy/commit/c404a3d63e1e40ebc9277c34b7e30f295d83fcb2))
* Yet more error reporting during client init() ([930e8cb](https://github.com/IEBH/TERA-fy/commit/930e8cbb4dec5d69e2593f7fb3401f8146cc8cb4))

### fix

* Also watch plugins/ with `npm run watch` ([30b0f2f](https://github.com/IEBH/TERA-fy/commit/30b0f2f9121b7224ae2c8434ce0d1db62245978d))
* Better is-pojo detection when deep merging with Vue2 / $set ([6f14991](https://github.com/IEBH/TERA-fy/commit/6f149915e9fa995c99aa2406b57c5f6ac8ef87f9))
* Less noisy errors when trying to set the URL on an inactive tool session / embedded TERA iframe ([7a73e32](https://github.com/IEBH/TERA-fy/commit/7a73e329563338f9c4f40b7d77e4dc03fed0f5b3))
* Slight fixes for release-it scripting ([2a1c0b1](https://github.com/IEBH/TERA-fy/commit/2a1c0b120295a1c953ed676fed65d7e4988f7d54))
* Typo when syncing local->remote writes ([aed4511](https://github.com/IEBH/TERA-fy/commit/aed4511f901f3d589cf52603166c9e8adcbb1fc6))
* Vue2 handling for Array syncing ([6449261](https://github.com/IEBH/TERA-fy/commit/6449261aa0e6859aa7963c27ca899be1c31c740f))

### refactor

* More verbose output for plugins/vue2 ([07e5072](https://github.com/IEBH/TERA-fy/commit/07e50720238f0f852f2ffb47ec089e5c6456b9cd))



# [1.5.0](https://github.com/IEBH/TERA-fy/compare/v1.4.4...v1.5.0) (2024-05-07)


### chore

* release v1.5.0 ([fdf89d3](https://github.com/IEBH/TERA-fy/commit/fdf89d35a154493a11baa7d56f88725edfe9d7b2))

### feat

* setPage{Url,Title}() functionality ([bc6d00f](https://github.com/IEBH/TERA-fy/commit/bc6d00f0ea7212587248b49ecefe839c9637ea33))



## [1.4.4](https://github.com/IEBH/TERA-fy/compare/v1.4.3...v1.4.4) (2024-05-07)


### chore

* release v1.4.4 ([c26b34a](https://github.com/IEBH/TERA-fy/commit/c26b34a7d6c0ea4e691959b05bf6131e489e0e4e))

### fix

* Allow raw access to the /dist/ directory for weirder imports ([42a3a85](https://github.com/IEBH/TERA-fy/commit/42a3a8535980efbed44b25460b37b271be3b818e))
* Mark setPageUrl as fixme ([f481e08](https://github.com/IEBH/TERA-fy/commit/f481e08d2ad3e4c8e78504ca9fa4c54b13ce23f0))



## [1.4.3](https://github.com/IEBH/TERA-fy/compare/v1.4.2...v1.4.3) (2024-05-07)


### chore

* release v1.4.3 ([10cff71](https://github.com/IEBH/TERA-fy/commit/10cff71e537a008e26ae07471200033a9734c5f7))

### task

* Stub function for setPageUrl() ([eb2ca9a](https://github.com/IEBH/TERA-fy/commit/eb2ca9a009b65136f54ab4d503582f3fd76af954))



## [1.4.2](https://github.com/IEBH/TERA-fy/compare/v1.4.1...v1.4.2) (2024-05-02)


### chore

* release v1.4.2 ([3788cfa](https://github.com/IEBH/TERA-fy/commit/3788cfa688cefae5d0025c91800b46a6e7c3dfa8))



## [1.4.1](https://github.com/IEBH/TERA-fy/compare/v1.4.0...v1.4.1) (2024-05-02)


### chore

* release v1.4.1 ([19c3d29](https://github.com/IEBH/TERA-fy/commit/19c3d298cb77476d38ac244a25c5eb442ee88d42))

### refactor

* Added debugging verbosity levels + refacroted all calls to be less chatty ([081964c](https://github.com/IEBH/TERA-fy/commit/081964cd4fdc319acdde7ddf03fa34a32b144bf4))



# [1.4.0](https://github.com/IEBH/TERA-fy/compare/v1.3.2...v1.4.0) (2024-04-26)


### chore

* release v1.4.0 ([e3ed2e2](https://github.com/IEBH/TERA-fy/commit/e3ed2e229d7c755d66af8cfad024ae0a1cb8e56a))

### docs

* Missing need provide {tera:TeraFyClient} during ProjectFile constructor ([cdf26cc](https://github.com/IEBH/TERA-fy/commit/cdf26ccdc187bedc3bcd5b0c2a41ad398ea9639e))

### feat

* TeraFy.projectLog() ([6207188](https://github.com/IEBH/TERA-fy/commit/6207188af85b481d020f57b50b103b1785094c10))

### fix

* Let release-it figure out the release increment ([a2be698](https://github.com/IEBH/TERA-fy/commit/a2be698edf902e61139864405fda1a55b764fa34))
* merge() subclassed method should take an iterative, not a single object ([4a33aca](https://github.com/IEBH/TERA-fy/commit/4a33aca4d39191249b7dca3a0a80b65ebdb2a7d2))

### refactor

* Bind ProjectFile.tera -> #tera so that outsiders cant access the parent property and it doesnt show up as enumerable ([b00619d](https://github.com/IEBH/TERA-fy/commit/b00619d9dcb2a8997177ccdab184f116a3c45067))



## [1.3.2](https://github.com/IEBH/TERA-fy/compare/v1.3.1...v1.3.2) (2024-04-18)


### chore

* release v1.3.2 ([6c5a6a2](https://github.com/IEBH/TERA-fy/commit/6c5a6a2b1833007002663f5288303cb14394db54))

### fix

* Various minor tweaks to keep ESLint happy ([c7e7f0d](https://github.com/IEBH/TERA-fy/commit/c7e7f0d26aff283acc85dd9f42f24015194f369d))
* Wrong API endpoint when setting file Blobs ([45aa6df](https://github.com/IEBH/TERA-fy/commit/45aa6df2bc3dafe056dfd9591c8b770bf0f66835))



## [1.3.1](https://github.com/IEBH/TERA-fy/compare/v1.3.0...v1.3.1) (2024-04-16)


### chore

* release v1.3.1 ([6e431fd](https://github.com/IEBH/TERA-fy/commit/6e431fdf8933d52c71b0762cb42bc9d398e7ed43))

### feat

* setProjectStateDefaults() can now accept an entire object to default-merge ([5d9a1f5](https://github.com/IEBH/TERA-fy/commit/5d9a1f5383c2d6de9ffa818b380c9cc669d42b85))

### fix

* Various missing fields for the ProjectFile interface ([8858a9f](https://github.com/IEBH/TERA-fy/commit/8858a9f1a523a9bb86b74e831b752f3fd562f02a))

### refactor

* Moved all path state functionality into its own utility library ([25f63df](https://github.com/IEBH/TERA-fy/commit/25f63df575508aa43b00394946fd51c556d380fe))
* Set default release increment as patch ([ab90c11](https://github.com/IEBH/TERA-fy/commit/ab90c11c34adf6caa386b89e6670f5392bbc05d6))



# [1.3.0](https://github.com/IEBH/TERA-fy/compare/v1.2.2...v1.3.0) (2024-04-15)


### chore

* release v1.3.0 ([0caf39c](https://github.com/IEBH/TERA-fy/commit/0caf39c64eb636dcdc3e5e8793d35f43131b43f3))

### docs

* Typo ([b0b3765](https://github.com/IEBH/TERA-fy/commit/b0b376576eeb88d8950911cd978b0691cf6cd439))

### feat

* ProjectFile.{serialize,deserialize}() functions ([d6c69f5](https://github.com/IEBH/TERA-fy/commit/d6c69f5a225b819d6fd63e7fc13670cadc8478e9))

### fix

* Export projectFile ([d4940f3](https://github.com/IEBH/TERA-fy/commit/d4940f3dfcb7c5da5b9a6fbfb2a600be60703ed8))

### refator

* Double-check all docuemnted promise-return functions actually return promises ([d951b43](https://github.com/IEBH/TERA-fy/commit/d951b4313e253d0e0a12b2ea480b2e4dd4dc5a0d))



## [1.2.2](https://github.com/IEBH/TERA-fy/compare/v1.2.1...v1.2.2) (2024-04-11)


### chore

* release v1.2.2 ([82e307a](https://github.com/IEBH/TERA-fy/commit/82e307a30a4616a912f578a89fb712d715392a4d))

### docs

* Rebuild CHANGELOG from start of project ([f559d76](https://github.com/IEBH/TERA-fy/commit/f559d7646a761b69c066cb3e3600bc71432516e8))

### refactor

* Change behaviour of setProjectStateDefaults() to return the input value rather than whether the value actually changed (_pathHas() can be used for this anyway ([34e8529](https://github.com/IEBH/TERA-fy/commit/34e852964ac32e73e42acaf7305db6562d24b622))



## [1.2.1](https://github.com/IEBH/TERA-fy/compare/v1.2.0...v1.2.1) (2024-04-11)


### chore

* release v1.2.1 ([b228454](https://github.com/IEBH/TERA-fy/commit/b22845430897ebde86cbc03b67eee1cb1dba0394))

### devops

* Fix release script to bump patch level ([6393c20](https://github.com/IEBH/TERA-fy/commit/6393c20f756666c5bcc268aabe553962c0cd4a9b))

### docs

* Recompile docs ([2a77afe](https://github.com/IEBH/TERA-fy/commit/2a77afec475557166e2da3e76183e356c2dba806))

### fix

* Handle file meta data where created/modified/accessed dates are omitted for some reason ([1544723](https://github.com/IEBH/TERA-fy/commit/1544723ec6ce4478541a07baa0e44cb120f7e929))
* Handle nullish errors on RPC calls ([f873029](https://github.com/IEBH/TERA-fy/commit/f8730294e8a7dbf08602edf87ce2926695238592))



# [1.2.0](https://github.com/IEBH/TERA-fy/compare/v1.1.0...v1.2.0) (2024-04-11)


### docs

* Deferred hints documentation into main TERA-Tools.com project ([abb44d5](https://github.com/IEBH/TERA-fy/commit/abb44d544ae2f8fd2872781e73b044d89bd54408))
* Duplicate function definition ([2946fad](https://github.com/IEBH/TERA-fy/commit/2946fadba57f666ed8520fe8df58f76b26964847))
* Typo ([8e8ab94](https://github.com/IEBH/TERA-fy/commit/8e8ab945a8952331d8dbb2847156fa43c0ee2bd0))

### feat

* <tera-file-select> now supports save functionality ([e60b63e](https://github.com/IEBH/TERA-fy/commit/e60b63e36a5f757fec74922577ec701ae2f42d5e))
* More fixes and UX for file saving UI/UX ([7c4e1af](https://github.com/IEBH/TERA-fy/commit/7c4e1af0b5569af7a1c1aa1df29f47b24d464dc8))
* setProjectLibrary() can now prompt for a file path if none is specified ([62a5f03](https://github.com/IEBH/TERA-fy/commit/62a5f031c0b6ef9f8b72dfee335e4fa79fdffdfb))

### fix

* Wrong inherited argument when running setProjectLibrary() ([aaaca64](https://github.com/IEBH/TERA-fy/commit/aaaca641847aae9e7a72b4423282002e3b125e70))

### refactor

* parseProjectLibrary() -> getProjectLibrary() ([f265624](https://github.com/IEBH/TERA-fy/commit/f2656243941f7754f462bb2bae36cceff5a24605))



# [1.1.0](https://github.com/IEBH/TERA-fy/compare/v1.0.24...v1.1.0) (2024-04-09)


### docs

* Rebuild ([c2cbd3f](https://github.com/IEBH/TERA-fy/commit/c2cbd3f1b038b6fbc3be588eacf206c5ef7b03fe))

### feat

* File saving UI ([b2f8809](https://github.com/IEBH/TERA-fy/commit/b2f8809a960880b951072127d7492b31aa29b03a))

### fix

* Yet more files added to prerelease step ([399c6f8](https://github.com/IEBH/TERA-fy/commit/399c6f8d6c5080238c079c12b16add7eebeb1d7e))



## [1.0.24](https://github.com/IEBH/TERA-fy/compare/v1.0.23...v1.0.24) (2024-04-05)


### devops

* Added changelog + release infrastructure ([d2ced34](https://github.com/IEBH/TERA-fy/commit/d2ced348f9b7e09b80672abf93bd7348fc3277cb))

### fix

* Yet another fix for setProjectState() throwing when trying to save + remove defunct {sync:Boolean} option ([4e320ec](https://github.com/IEBH/TERA-fy/commit/4e320ec8f171237387db7404a7209b4ca51898c8))

### task

* Add NPM publish as post-bump step ([51d5ea5](https://github.com/IEBH/TERA-fy/commit/51d5ea538123509abd4e1e002c05bd1713f77c5b))
* postbump -> postcommit ([75ea50a](https://github.com/IEBH/TERA-fy/commit/75ea50a408004b60a90accf349cd4f17b01d9caf))



## [1.0.23](https://github.com/IEBH/TERA-fy/compare/v1.0.22...v1.0.23) (2024-04-04)




## [1.0.22](https://github.com/IEBH/TERA-fy/compare/v1.0.21...v1.0.22) (2024-04-04)


### fix

* Missing Promise chain response during setProjectState() ([1fb7f29](https://github.com/IEBH/TERA-fy/commit/1fb7f29d01103f2396f89dd31928dabb48150328))



## [1.0.21](https://github.com/IEBH/TERA-fy/compare/v1.0.20...v1.0.21) (2024-04-03)


### docs

* Rebuild ([080a0d2](https://github.com/IEBH/TERA-fy/commit/080a0d2df14740b4ba946a6424ced5e9987dca1f))

### feat

* More edits to <tera-file-select/> ([efc49f7](https://github.com/IEBH/TERA-fy/commit/efc49f7fc81d02081cfd4cb17fe6dfec9a12969b))
* Moved ProjectLibrary file into its own classdef + added more file setter methods ([6c8eac3](https://github.com/IEBH/TERA-fy/commit/6c8eac3c9c853f5f5cf367dea82062b236163f9f))
* Stash + retrieve login data from LocalStorage when using embed + popup window workaround method ([e9ec32c](https://github.com/IEBH/TERA-fy/commit/e9ec32c253c2cb3bd7c8312cd2ad61432b24542a))

### fix

* Added projectFile class build to frontend scripts ([b21fe29](https://github.com/IEBH/TERA-fy/commit/b21fe29cdb20c67307e0c5cd6d4d73d945a33b8e))
* Missing dep ([9bf58e4](https://github.com/IEBH/TERA-fy/commit/9bf58e467a89886ca5c17c3209a503df2c7dba26))

### refactor

* Seperate Embed workaround code into its own function ([984c37a](https://github.com/IEBH/TERA-fy/commit/984c37a705108e0efd9ad77a812b9454d75961f9))



## [1.0.20](https://github.com/IEBH/TERA-fy/compare/v1.0.19...v1.0.20) (2024-04-02)


### docs

* Doc rebuild ([841f04f](https://github.com/IEBH/TERA-fy/commit/841f04f29d3ca8e5e8b9a53746d8465b4da41a29))

### fix

* Yet more $auth screw-around with window.opener magic ([d140da1](https://github.com/IEBH/TERA-fy/commit/d140da1d7760713b35ffca58a688c638f094869e))



## [1.0.19](https://github.com/IEBH/TERA-fy/compare/v1.0.18...v1.0.19) (2024-04-02)


### devops

* Added sanity check for $auth sticking in a loop on the server ([23f197d](https://github.com/IEBH/TERA-fy/commit/23f197dc14204187fb9bea0efc916fd659729304))
* Disabled sourcemapping as its too much of a headfuck when its not mapping correctly ([f9f6b76](https://github.com/IEBH/TERA-fy/commit/f9f6b76bc359fd627b86799a8c6b415f8802b7a8))

### docs

* Docs rebuild ([0c39fa2](https://github.com/IEBH/TERA-fy/commit/0c39fa238dad8bd67aa96058d97db78ddf2da545))

### feat

* Start on <tera-library-select/> Vue component ([aa42855](https://github.com/IEBH/TERA-fy/commit/aa42855df0b4e32b0b3a08e4e86021faf3ac8ca6))



## [1.0.18](https://github.com/IEBH/TERA-fy/compare/v1.0.17...v1.0.18) (2024-04-02)


### devops

* Added `npm run watch` script to main to rebuild client libraries on change ([48fa42a](https://github.com/IEBH/TERA-fy/commit/48fa42adbbf69aa8fae5bccf2cb4f714f7de2762))

### docs

* Misc comment / code cleanup ([b1e0e38](https://github.com/IEBH/TERA-fy/commit/b1e0e38cbd38b10f35498eaa3370592ce2bbe9c1))
* Rebuild all files + docs ([a73a69a](https://github.com/IEBH/TERA-fy/commit/a73a69ad6e9331ca07a1f2b354e837657ce7ce74))
* Rebuild docs ([623c4e4](https://github.com/IEBH/TERA-fy/commit/623c4e4646a34b7cee5b92d22129ee9acf7a1bbf))

### feat

* Added method to try authenticating locally via a popup when in embedded mode ([7286958](https://github.com/IEBH/TERA-fy/commit/72869585c7f203f330815c9dba5f4b0f36a350e8))
* Added prototype window mode for client ([9241854](https://github.com/IEBH/TERA-fy/commit/92418548dfd213396acb082acf9dae08b441a374))
* Added subclassable {has,get,set}Path methods to client for state setting ([a4acedf](https://github.com/IEBH/TERA-fy/commit/a4acedf214af3cc612b2a1a1975070dc6ee87015))
* Button selection when using uiAlert() ([118223f](https://github.com/IEBH/TERA-fy/commit/118223fb3407b5c58c79aeeb37053b4fab9a6d0f))
* getUser({forceRetry:Boolean}) ([15b8efd](https://github.com/IEBH/TERA-fy/commit/15b8efd521486326652afb692dd816f10a30940b))
* uiSplat() + uiWindow() ([a72fc33](https://github.com/IEBH/TERA-fy/commit/a72fc33e05c64d4428ef4c747684504edc51bd09))

### fix

* Auto call to requireProject() in Vue2 mode ([f592cfb](https://github.com/IEBH/TERA-fy/commit/f592cfbd0c2f9373b1fb95203684ebb3b2acf81b))
* Dont rely on server auth populating $auth.user.id ([73f8c85](https://github.com/IEBH/TERA-fy/commit/73f8c85c17d6e79184ecc5b9929739da33b57786))
* Logic error when setting project state ([7fcd826](https://github.com/IEBH/TERA-fy/commit/7fcd8265d2f15f28df99b0271396e9467ab91a20))
* Subclass _pathSet() when in Vue2 mode ([ea5537e](https://github.com/IEBH/TERA-fy/commit/ea5537e34d11170b3296d75861425a0db162f0ba))

### refactor

* Juggle various {,peer,optional}depedencies config ([aee116a](https://github.com/IEBH/TERA-fy/commit/aee116a665c79518793a47195788474bb2857ea3))
* Promise Deferred util ([8e4f1a8](https://github.com/IEBH/TERA-fy/commit/8e4f1a8589a599152c151da1319623598dde7c04))
* Stepped auth when calling requireUser() ([562798a](https://github.com/IEBH/TERA-fy/commit/562798a2171d3fcb93f44b7885dc04b3e13d3fb3))



## [1.0.17](https://github.com/IEBH/TERA-fy/compare/v1.0.16...v1.0.17) (2024-03-14)


### docs

* Added File Hints reference ([bfbeb24](https://github.com/IEBH/TERA-fy/commit/bfbeb2465329ff2ce693982ec7fc9d61bf97e1c2))
* Rebuild docs ([954d7b9](https://github.com/IEBH/TERA-fy/commit/954d7b912d8aa296baa721f5a56272156fb1f5c0))

### feat

* Filled out stubs for {get,set,select}ProjectLibrary() ([0bdbfd9](https://github.com/IEBH/TERA-fy/commit/0bdbfd943e2613d917be8c64e22893ab8fcb1b86))

### fix

* Typo ([98fad09](https://github.com/IEBH/TERA-fy/commit/98fad09c2c875b2b6b7158afb5d77ae41ecb6e65))

### refactor

* getProjectLibrary() -> parseProjectLibrary() ([f477c9d](https://github.com/IEBH/TERA-fy/commit/f477c9d13601894e491f6258eb558472a7f65204))
* Split selectProjectLibrary() -> selectProjectFile() + selectProjectLibrary() + added stub for file filtering ([1e3d517](https://github.com/IEBH/TERA-fy/commit/1e3d5171fd03eb95c332b6440e4eaccbca77e58e))



## [1.0.16](https://github.com/IEBH/TERA-fy/compare/v1.0.15...v1.0.16) (2024-03-06)


### feat

* getLibraryFile() now supports multiple file transforms before handing contents to requester ([e413bd9](https://github.com/IEBH/TERA-fy/commit/e413bd9e91f3e152ecf334f96d276d6a89d6ea66))

### fix

* Dont try to inject undef values when devmode is enabled but the site URL isnt a string ([47598b2](https://github.com/IEBH/TERA-fy/commit/47598b25ad82e6e7cd9eb11fa304bce94595073f))



## [1.0.15](https://github.com/IEBH/TERA-fy/compare/v1.0.14...v1.0.15) (2024-02-29)


### docs

* Rebuild docs ([83e9ddc](https://github.com/IEBH/TERA-fy/commit/83e9ddce0f4a3a2a990d226c3c3766e5da0fb162))

### feat

* requireUser() + call to it from requireProject() ([d4eedfa](https://github.com/IEBH/TERA-fy/commit/d4eedfa97fb744298db9c8c04fcb79834c86ad4d))
* uiAlert() ([09da928](https://github.com/IEBH/TERA-fy/commit/09da9282beb00fc644bcde34a583b4b16f9f2854))

### ux

* Bypass requestFocus() actions when already operating as top-level TERA ([9e2515d](https://github.com/IEBH/TERA-fy/commit/9e2515dc25e4a489724ed275c2703c9d8a5a4316))



## [1.0.14](https://github.com/IEBH/TERA-fy/compare/v1.0.13...v1.0.14) (2024-02-27)


### fix

* yet more fixes to Live version of TERA-fy deployed to Live TERA ([f72fb8d](https://github.com/IEBH/TERA-fy/commit/f72fb8de2329d63aa1cacc2e6c962f9370a2c75a))



## [1.0.13](https://github.com/IEBH/TERA-fy/compare/v1.0.12...v1.0.13) (2024-02-27)


### feat

* Added @vue/cli-service compatible version (ESM + ES2019 spec) ([56501c9](https://github.com/IEBH/TERA-fy/commit/56501c97d4f2f30d908d2d1db7d847495183bf99))
* TERA-fy client can now opt-in to sandbox overrides in dev mode ([550ac9c](https://github.com/IEBH/TERA-fy/commit/550ac9c953cdcf1b47c834dcd9b59de3235663d6))

### fix

* Wrong DOM reference when searching for external iFrame from top-level TERA window ([51a0ab8](https://github.com/IEBH/TERA-fy/commit/51a0ab8df52de8a4822dc62e3b3318187cd94dcb))
* Wrong external referencing for Vue2 plugin ([ddd7068](https://github.com/IEBH/TERA-fy/commit/ddd7068fb0e00fa6d203cf5d4650f4138595aaa6))

### task

* Rebuild /dist ([09fa084](https://github.com/IEBH/TERA-fy/commit/09fa084192326065db3181774b1ebe12c0d10243))

### ux

* Provide each plugin with a copy of the TERA-fy client settings during init ([705ac7b](https://github.com/IEBH/TERA-fy/commit/705ac7be897c0bb11e5b170be0b2954237dda399))



## [1.0.12](https://github.com/IEBH/TERA-fy/compare/v1.0.11...v1.0.12) (2024-02-22)


### docs

* Docs rebuild ([ac52784](https://github.com/IEBH/TERA-fy/commit/ac52784e240967225947d2add240a387fdc5b4c4))
* Rebuild docs ([b95d407](https://github.com/IEBH/TERA-fy/commit/b95d4071025b7c080ac7c1d2bd136d5f88cda4f3))

### feat

* Added setProjectStateDefaults() to make priming defaults easier ([55a6ce8](https://github.com/IEBH/TERA-fy/commit/55a6ce8ecad1ed43a27bd41664ad031e1fc62997))

### fix

* Tweaks to what is included in the NPM tarball ([e2cf7e0](https://github.com/IEBH/TERA-fy/commit/e2cf7e0cf8c23c55cf7b02c209046e368efa88c5))

### refactor

* Various misc cleanup ([7c19c26](https://github.com/IEBH/TERA-fy/commit/7c19c262df8741de91be86d1282826727eb2c9c2))

### test

* Dropped the defunct terafy.subscribeProjectState demo ([01e585b](https://github.com/IEBH/TERA-fy/commit/01e585b9576928f2a8393ca886412286e837e5ee))



## [1.0.11](https://github.com/IEBH/TERA-fy/compare/v1.0.10...v1.0.11) (2024-02-21)


### docs

* Updated function signatures between client & server ([dc1117a](https://github.com/IEBH/TERA-fy/commit/dc1117a3c9982bfff74db00c28595480754f4b42))

### feat

* Added events / EventEmitter pattern to accept flushed updates from server ([458ce79](https://github.com/IEBH/TERA-fy/commit/458ce799ad9acf68732489efed56da5a0917cd95))
* Client can now tell server where its loaded from via setServerMode() ([b7c5fc0](https://github.com/IEBH/TERA-fy/commit/b7c5fc0cb18df2c9d39a4f63a32dd93da28e89fa))
* Updated Vue plugins (2+3) to handle remote project state changes ([0abf7b4](https://github.com/IEBH/TERA-fy/commit/0abf7b44fff25530af6430856850c5743172df2e))

### fix

* Added @mfdc/supabase-reactive as a dep for the Vue plugins ([2f7900d](https://github.com/IEBH/TERA-fy/commit/2f7900d86bc45c556b383756a0b1af30d35d43e5))

### refactor

* Move horrible mixin() handler into its own utility library ([713e26b](https://github.com/IEBH/TERA-fy/commit/713e26b9184b3633e887b4b59e8d56e629617b22))



## [1.0.10](https://github.com/IEBH/TERA-fy/compare/v1.0.9...v1.0.10) (2024-02-18)


### docs

* Added API docs for TERA-fy client ([ca34abf](https://github.com/IEBH/TERA-fy/commit/ca34abf1dd7a5fc8adcc44b6508c74b74d8aff47))
* Added example invocation for Vue plugins ([5205235](https://github.com/IEBH/TERA-fy/commit/5205235905f14378e39ea6e04ad0b1fcc4844845))
* Added header area to playground + fixed TeraFy JS url ([2fdd565](https://github.com/IEBH/TERA-fy/commit/2fdd5658dbe200b6e62e431889dba20a1530237d))
* Added link to generated docs pages ([7670ff9](https://github.com/IEBH/TERA-fy/commit/7670ff925686890672f445b0165a38b68a7874c1))
* Added stub functions to client so that JSDoc can pick them up ([371a18e](https://github.com/IEBH/TERA-fy/commit/371a18e433cc70e7978d03b0b264d1efdd344a34))
* API doc build process + first generation build ([81c7ff4](https://github.com/IEBH/TERA-fy/commit/81c7ff47e44b9879c3900c4806194954bcbfea2c))
* Documentation compiler is now more specific about doc listing order ([6353f15](https://github.com/IEBH/TERA-fy/commit/6353f1541bab4233868542073e8038474647266a))
* Dont allow project changing if there are no projects listed ([3aff5dc](https://github.com/IEBH/TERA-fy/commit/3aff5dca7631320d8e54444c4f32886f424eb227))
* More API adjustment options ([1cd8a1d](https://github.com/IEBH/TERA-fy/commit/1cd8a1d921573ff22f8268fb13822f7713f6679f))
* More docs tidying ([1d2911f](https://github.com/IEBH/TERA-fy/commit/1d2911f374bf070988420ba434d76980d8d2a340))
* More links in README + small cleanup ([6729637](https://github.com/IEBH/TERA-fy/commit/672963774a197a9b2f6d490275e9810a0d51f7a0))
* Move playground into docs folder ([07d5d45](https://github.com/IEBH/TERA-fy/commit/07d5d459a9037a63342ec78e8eec0a9505855cdc))
* Rebuild docs ([709241c](https://github.com/IEBH/TERA-fy/commit/709241c7c9655b613a4150c0bf037101a4085456))
* Reformat links to TERA-Explorer ([8d2242a](https://github.com/IEBH/TERA-fy/commit/8d2242a69548b6043a79e5572f7a2812ad2d607c))
* Various docs fixups ([4add13a](https://github.com/IEBH/TERA-fy/commit/4add13af2e1370497c728426d004c58f548c9b85))
* Yet more import nonsense with ESM files ([5c41b6b](https://github.com/IEBH/TERA-fy/commit/5c41b6be0ba5feb10e4073c079761b80d1d73a7b))

### feat

* createProjectStatePatch() to avoid having to do this manually in each plugin ([5414a22](https://github.com/IEBH/TERA-fy/commit/5414a227bba8968108f0b6d65c766dc2a642acc9))
* init() can now accept an options object ([0ee55b7](https://github.com/IEBH/TERA-fy/commit/0ee55b77ff1178b73c4d749db509d06315da1afc))
* Prototype project subscription process (untested) ([f13b957](https://github.com/IEBH/TERA-fy/commit/f13b9578d9e725b3d4d886120d28365893da9bcb))
* Various project-state patch handling functionality now implemented ([8260808](https://github.com/IEBH/TERA-fy/commit/8260808f67c1c3149db487ce61edb4e75d9a3661))

### fix

* Better reaction when there is no active user login ([48bd61f](https://github.com/IEBH/TERA-fy/commit/48bd61fe71509e6c68ea8fcba90f6f2297b721bf))
* Debugging artefacts ([61d559b](https://github.com/IEBH/TERA-fy/commit/61d559b62f1d9cbc1d12ff4b9f65b71af7d48429))
* Dont allow plugins to override the main init() function - instead call them after that function has done its work ([7db3ba0](https://github.com/IEBH/TERA-fy/commit/7db3ba09a13dc87b70df192f55585d2fc09a3931))
* Plugins init() functions are now called AFTER all other init functionaly has finished + they are called with the outer object context ([4757597](https://github.com/IEBH/TERA-fy/commit/4757597324873c953e4d93994776eff4030b985c))

### refactor

* Swap NPM:jsdoc -> NPM:documentation ([212ed1a](https://github.com/IEBH/TERA-fy/commit/212ed1a9e95eba47beb6bcdd7ee83163788c4f07))

### task

* Rebuild ([19766d7](https://github.com/IEBH/TERA-fy/commit/19766d7761855fd0be6349c1a7a264197bd4ef2e))
* Rebuild package-lock ([a83e654](https://github.com/IEBH/TERA-fy/commit/a83e6541d4a7b81c7f33deb0db567823275cda8d))
* Update API playground to match API signatures ([d483ec3](https://github.com/IEBH/TERA-fy/commit/d483ec3676378043104d84b7a9d1de51cd728313))



## [1.0.9](https://github.com/IEBH/TERA-fy/compare/v1.0.8...v1.0.9) (2023-11-09)


### feat

* getProjectLibrary() now working ([019dacd](https://github.com/IEBH/TERA-fy/commit/019dacd1c677564e66688acf0b6bea2d39dca5e3))



## [1.0.8](https://github.com/IEBH/TERA-fy/compare/v1.0.7...v1.0.8) (2023-11-02)


### feat

* Tera-Fy can now communicate upwards (window.parent) or downwards (via iFrame) depending on its active context ([0c8d30d](https://github.com/IEBH/TERA-fy/commit/0c8d30dcf6398578a535a04e70ff2c481683ff46))



## [1.0.7](https://github.com/IEBH/TERA-fy/compare/v1.0.6...v1.0.7) (2023-11-02)


### fix

* Misc fixes ([2bd5e03](https://github.com/IEBH/TERA-fy/commit/2bd5e035dd861e7baa8203d3dc5fb206b78aefbc))



## [1.0.6](https://github.com/IEBH/TERA-fy/compare/v1.0.5...v1.0.6) (2023-11-01)


### docs

* Added example to README ([40a564b](https://github.com/IEBH/TERA-fy/commit/40a564b6fcca6f3bbbf168780c602fa5ffc56ce9))

### fix

* Better error tracking methods with CLIENT|SERVER.debug() + try barriers around sendRaw() ([b4062b3](https://github.com/IEBH/TERA-fy/commit/b4062b30075403708427b1c58d308d34777997e9))
* client.init() now returns its own instance in the promise payload so it can be awaited ([05d6611](https://github.com/IEBH/TERA-fy/commit/05d66117bf7578f076472bc4d59be1df10e85cb3))
* Minor typo in package when generating docs ([626a7fc](https://github.com/IEBH/TERA-fy/commit/626a7fc6f3867f95dd7efa4cf1ca6875ae25c1f6))
* Placehoder in Vue plugin to load basic project skeleton ([f530e51](https://github.com/IEBH/TERA-fy/commit/f530e5116e1a51652038df3a81a1e629d84755f7))

### refactor

* Code tidy + injectComms() now waits o the frame responding ([14491d3](https://github.com/IEBH/TERA-fy/commit/14491d317ff764bb38e2e6b1948d5189e8b1f72f))



## [1.0.5](https://github.com/IEBH/TERA-fy/compare/v1.0.4...v1.0.5) (2023-10-31)


### fix

* Change default tera-tools endpoint to live site ([ca4a595](https://github.com/IEBH/TERA-fy/commit/ca4a59548751f1afdb1a6309868de73b2dda81d6))
* Various fixes to the mixin infrastructure ([27ce126](https://github.com/IEBH/TERA-fy/commit/27ce126225f3b5faa06700efa9e6c87b38da33ef))

### refactor

* Moved plugins to a more logical location ([67821c5](https://github.com/IEBH/TERA-fy/commit/67821c5e89da63cf2ac07b9a93c9719188a0db12))
* Reuse this.set() in constructor if handed options ([c02a51b](https://github.com/IEBH/TERA-fy/commit/c02a51b64c74f678008e9b8d4b74fb07b48999a1))



## [1.0.4](https://github.com/IEBH/TERA-fy/compare/v1.0.3...v1.0.4) (2023-10-27)


### devops

* Ignore dist/ when tooling/grepping ([d303385](https://github.com/IEBH/TERA-fy/commit/d303385cb1f872cfdeb2c660bac060297be4f731))

### docs

* Updated API docs ([ed2d934](https://github.com/IEBH/TERA-fy/commit/ed2d9349f8654ad613f2a0356af9c61324c90297))

### feat

* Added TeraFy.set() + minor fixes ([ccf2221](https://github.com/IEBH/TERA-fy/commit/ccf222160aeb23b98c619f75da31099026df8544))
* Implemented prototype plugin structure ([4a35743](https://github.com/IEBH/TERA-fy/commit/4a357434606e0491b3626eacfbd3ff2307a341f0))

### refactor

* getProjectStateSnapshot() -> getProjectState() ([5939df2](https://github.com/IEBH/TERA-fy/commit/5939df2290a7fb9697e9a0feb1803ed67d5b5bfd))
* Move API generation to a single file ([5039530](https://github.com/IEBH/TERA-fy/commit/5039530527b5bb610b9e6ca6dcdd3e46959a4813))
* Moved NPM:just-diff back to peerDeps as its likely to be needed anyway ([37e1235](https://github.com/IEBH/TERA-fy/commit/37e1235ca9f9619ecd6ad48b3527cc511c17b7f8))

### task

* rebuild ([e4fc5b8](https://github.com/IEBH/TERA-fy/commit/e4fc5b88fba041e9ba2d6e24baa5cffcb12ab0f2))



## [1.0.3](https://github.com/IEBH/TERA-fy/compare/v1.0.2...v1.0.3) (2023-10-26)


### fix

* getProjectStateSnapshot() wasnt actually returning a result ([db1c572](https://github.com/IEBH/TERA-fy/commit/db1c572116c73f8dfdff8ace23f486afb9b8953c))



## [1.0.2](https://github.com/IEBH/TERA-fy/compare/v1.0.1...v1.0.2) (2023-10-26)


### feat

* Ping-pong RPC support with server<->client, added support for contexts to carry messages on server side ([15b970d](https://github.com/IEBH/TERA-fy/commit/15b970d0fa187c935f0dd7c2aba2d630e9e59b98))
* setActiveProject() ([c24158a](https://github.com/IEBH/TERA-fy/commit/c24158acca0cb7fc9e50b817e60a0644bbadf16e))

### task

* Rebuild ([4d8dda2](https://github.com/IEBH/TERA-fy/commit/4d8dda2eebb18af3bee83420450829157bde3ee6))



## [1.0.1](https://github.com/IEBH/TERA-fy/compare/b9559b5fd00693049399a8709d0be0430a051281...v1.0.1) (2023-10-26)


### docs

* Added LICENSE file ([5fa0933](https://github.com/IEBH/TERA-fy/commit/5fa0933a068001b3f84f891faa96afb8484ec778))
* Basic README ([749d8d6](https://github.com/IEBH/TERA-fy/commit/749d8d62412f686d649e003e943de156b304e9c5))
* Misc package.json fix ([c5b4ae4](https://github.com/IEBH/TERA-fy/commit/c5b4ae463f56a303fd03c72d086dc49194c28d04))

### feat

* DevMode toggling + better stylesheet handling + toggleFullscreen() ([cc96e76](https://github.com/IEBH/TERA-fy/commit/cc96e7659e02bee4410a07f319d34a1acdb001ec))

### fix

* Comms now working ([74610c8](https://github.com/IEBH/TERA-fy/commit/74610c8b8347cb9e5e9b198d2caa0e9b1c6259f4))
* Misc fixes ([8826eb4](https://github.com/IEBH/TERA-fy/commit/8826eb4f134ed921becdeb6fdc48a9d5b1cb716e))

### refactor

* File rename ([79ab1cc](https://github.com/IEBH/TERA-fy/commit/79ab1ccf6919c2fcaa63348d72a8dfeff74687d9))

### task

* Added dist + docs auto-gen ([af4b6c1](https://github.com/IEBH/TERA-fy/commit/af4b6c16de615205026e28817d20162c069720b5))
* Basic proof-of-concept ([835e175](https://github.com/IEBH/TERA-fy/commit/835e175a9c3b7f8bce17b44e2148de4e7523a4ce))
* Cleanup package*.json ([9c3732c](https://github.com/IEBH/TERA-fy/commit/9c3732ccb8270262b27f2588783edd8f10403020))
* iFrame example (non-functional) ([d0b3b36](https://github.com/IEBH/TERA-fy/commit/d0b3b3638ac92618911352768af0606b8e63c408))
* Initial commit + hello world demo ([b9559b5](https://github.com/IEBH/TERA-fy/commit/b9559b5fd00693049399a8709d0be0430a051281))
* Proof-of-concept using iFrame + postMessage ([47c9af8](https://github.com/IEBH/TERA-fy/commit/47c9af8b8d18aaf38ed37e5d7367dd193136bc07))
* Prototype app ([69b14c2](https://github.com/IEBH/TERA-fy/commit/69b14c2d01083da52a4a522a3024f7c166cf2f1e))
* Various cleanups now the solution has settled ([52fcc61](https://github.com/IEBH/TERA-fy/commit/52fcc61e7ec5f6d2489a7be8e83660a19ae827d7))
