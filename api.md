<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [TeraFy][1]
    *   [settings][2]
        *   [Properties][3]
    *   [events][4]
    *   [dom][5]
        *   [Properties][6]
    *   [methods][7]
    *   [plugins][8]
    *   [send][9]
        *   [Parameters][10]
    *   [sendRaw][11]
        *   [Parameters][12]
    *   [rpc][13]
        *   [Parameters][14]
    *   [acceptMessage][15]
        *   [Parameters][16]
    *   [acceptPostboxes][17]
    *   [createProjectStatePatch][18]
        *   [Parameters][19]
    *   [applyProjectStatePatchLocal][20]
        *   [Parameters][21]
    *   [init][22]
        *   [Parameters][23]
    *   [detectMode][24]
    *   [injectComms][25]
    *   [injectStylesheet][26]
    *   [injectMethods][27]
    *   [debug][28]
        *   [Parameters][29]
    *   [set][30]
        *   [Parameters][31]
    *   [setIfDev][32]
        *   [Parameters][33]
    *   [use][34]
        *   [Parameters][35]
    *   [mixin][36]
        *   [Parameters][37]
    *   [toggleDevMode][38]
        *   [Parameters][39]
    *   [toggleFocus][40]
        *   [Parameters][41]
*   [handshake][42]
    *   [Properties][43]
*   [User][44]
    *   [Properties][45]
*   [getUser][46]
*   [requireUser][47]
*   [][48]
*   [Project][49]
*   [getProject][50]
*   [getProjects][51]
*   [setActiveProject][52]
    *   [Parameters][53]
*   [requireProject][54]
    *   [Parameters][55]
*   [selectProject][56]
    *   [Parameters][57]
*   [getProjectState][58]
    *   [Parameters][59]
*   [setProjectState][60]
    *   [Parameters][61]
*   [setProjectStateDefaults][62]
    *   [Parameters][63]
*   [saveProjectState][64]
*   [replaceProjectState][65]
    *   [Parameters][66]
*   [applyProjectStatePatch][67]
    *   [Parameters][68]
*   [subscribeProjectState][69]
*   [ProjectFile][70]
    *   [Properties][71]
*   [FileFilters][72]
    *   [Properties][73]
*   [selectProjectFile][74]
    *   [Parameters][75]
*   [getProjectFiles][76]
    *   [Parameters][77]
*   [selectProjectLibrary][78]
    *   [Parameters][79]
*   [parseProjectLibrary][80]
    *   [Parameters][81]
*   [setProjectLibrary][82]
    *   [Parameters][83]
*   [setProjectLibrary][84]
    *   [Parameters][85]
*   [uiAlert][86]
    *   [Parameters][87]

## TeraFy

Main Tera-Fy Client (class singleton) to be used in a frontend browser

### settings

Various settings to configure behaviour

Type: [Object][88]

#### Properties

*   `devMode` **[Boolean][89]** Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance
*   `How` **(`"detect"` | `"parent"` | `"child"`)** to communicate with TERA. 'parent' assumes that the parent of the current document is TERA, 'child' spawns an iFrame and uses TERA there, 'detect' tries parent and fallsback to 'child'
*   `modeTimeout` **[Number][90]** How long entities have in 'detect' mode to identify themselves
*   `siteUrl` **[String][91]** The TERA URL to connect to
*   `restrictOrigin` **[String][91]** URL to restrict communications to
*   `List` **[Array][92]<[String][91]>** of sandbox allowables for the embedded if in embed mode

### events

Event emitter subscription endpoint

Type: Mitt

### dom

DOMElements for this TeraFy instance

Type: [Object][88]

#### Properties

*   `el` **DOMElement** The main tera-fy div wrapper
*   `iframe` **DOMElement** The internal iFrame element
*   `stylesheet` **DOMElement** The corresponding stylesheet

### methods

List of function stubs mapped here from the server
This array is forms the reference of `TeraFy.METHOD()` objects to provide locally which will be mapped via `TeraFy.rpc(METHOD, ...args)`

Type: [Array][92]<[String][91]>

### plugins

Loaded plugins via Use()

Type: [Array][92]\<TeraFyPlugin>

### send

Send a message + wait for a response object

#### Parameters

*   `message` **[Object][88]** Message object to send

Returns **[Promise][93]\<any>** A promise which resolves when the operation has completed with the remote reply

### sendRaw

Send raw message content to the server
This function does not return or wait for a reply - use `send()` for that

#### Parameters

*   `message` **[Object][88]** Message object to send

### rpc

Call an RPC function in the server instance

#### Parameters

*   `method` **[String][91]** The method name to call
*   `args` **...any**&#x20;

Returns **[Promise][93]\<any>** The resolved output of the server function

### acceptMessage

Accept an incoming message

#### Parameters

*   `rawMessage` &#x20;
*   `Raw` **[MessageEvent][94]** message event to process

### acceptPostboxes

Listening postboxes, these correspond to outgoing message IDs that expect a response

### createProjectStatePatch

Create + transmit a new project state patch base on the current and previous states
The transmitted patch follows the [JSPatch][95] standard
This function accepts an entire projectState instance, computes the delta and transmits that to the server for merging

#### Parameters

*   `newState` **[Object][88]** The local projectState to accept
*   `oldState` **[Object][88]** The previous projectState to examine against

Returns **[Promise][93]** A promise which will resolve when the operation has completed

### applyProjectStatePatchLocal

Client function which accepts a patch from the server and applies it to local project state
The patch should follow the [JSPatch][95] standard
This function is expected to be sub-classed by a plugin

#### Parameters

*   `patch` **[Array][92]** A JSPatch patch to apply

Returns **[Promise][93]** A promise which will resolve when the operation has completed

### init

Initalize the TERA client singleton
This function can only be called once and will return the existing init() worker Promise if its called againt

#### Parameters

*   `options` **[Object][88]?** Additional options to merge into `settings` via `set`

Returns **[Promise][93]<[TeraFy][1]>** An eventual promise which will resovle with this terafy instance

### detectMode

Populate `settings.mode`
Try to communicate with a parent frame, if none assume we need to fallback to child mode

Returns **[Promise][93]<[String][91]>** A promise which will resolve with the detected mode to use

### injectComms

Find an existing active TERA server OR initalize one

Returns **[Promise][93]** A promise which will resolve when the loading has completed and we have found a parent TERA instance or initiallized a child

### injectStylesheet

Inject a local stylesheet to handle TERA server functionality

### injectMethods

Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function

### debug

Debugging output function
This function will only act if `settings.devMode` is truthy

#### Parameters

*   `msg` **...any**&#x20;
*   `status` **(`"VERBOSE"` | `"INFO"` | `"LOG"` | `"WARN"` | `"ERROR"`)?** Optional prefixing level to mark the message as. 'WARN' and 'ERROR' will always show reguardless of devMode being enabled

### set

Set or merge settings
This function also routes 'special' keys like `devMode` to their internal handlers

#### Parameters

*   `key` **([String][91] | [Object][88])** Either a single setting key to set or an object to merge
*   `value` **any** The value to set if `key` is a string

Returns **[TeraFy][1]** This chainable terafy instance

### setIfDev

*   **See**: set()

Set or merge settings - but only in dev mode and only if the value is not undefined

#### Parameters

*   `key` **([String][91] | [Object][88])** Either a single setting key to set or an object to merge
*   `value` **any** The value to set if `key` is a string

Returns **[TeraFy][1]** This chainable terafy instance

### use

Include a TeraFy client plugin

#### Parameters

*   `mod` &#x20;
*   `options` **[Object][88]?** Additional options to mutate behaviour during construction (pass options to init() to intialize later options)
*   `The` **[Object][88]** module function to include. Invoked as `(teraClient:TeraFy, options:Object)`

Returns **[TeraFy][1]** This chainable terafy instance

### mixin

Internal function used by use() to merge an external declared singleton against this object

#### Parameters

*   `target` **[Object][88]** Initalied class instance to extend
*   `source` **[Object][88]** Initalized source object to extend from

### toggleDevMode

Set or toggle devMode

#### Parameters

*   `devModeEnabled` **([String][91] | [Boolean][89])** Optional boolean to force dev mode (optional, default `'toggle'`)

Returns **[TeraFy][1]** This chainable terafy instance

### toggleFocus

Fit the nested TERA server to a full-screen
This is usually because the server component wants to perform some user activity like calling $prompt

#### Parameters

*   `isFocused` **([String][91] | [Boolean][89])** Whether to fullscreen the embedded component (optional, default `'toggle'`)

## handshake

Return basic server information as a form of validation

### Properties

*   `date` **[Date][96]** Server date

Returns **[Promise][93]<[Object][88]>** Basic promise result

## User

User / active session within TERA

### Properties

*   `id` **[String][91]** Unique identifier of the user
*   `email` **[String][91]** The email address of the current user
*   `name` **[String][91]** The provided full name of the user
*   `isSubscribed` **[Boolean][89]** Whether the active user has a TERA subscription

## getUser

Fetch the current session user

Returns **[Promise][93]<[User][44]>** The current logged in user or null if none

## requireUser

Require a user login to TERA
If there is no user OR they are not logged in a prompt is shown to go and do so
This is an pre-requisite step for requireProject()

Returns **[Promise][93]** A promise which will resolve if the there is a user and they are logged in

##

Require a user login to TERA
If there is no user OR they are not logged in a prompt is shown to go and do so
This is an pre-requisite step for requireProject()

Returns **[Promise][93]** A promise which will resolve if the there is a user and they are logged in

## Project

Project entry within TERA

## getProject

Get the currently active project, if any

Returns **[Promise][93]<([Project][49] | null)>** The currently active project, if any

## getProjects

Get a list of projects the current session user has access to

Returns **[Promise][93]<[Array][92]<[Project][49]>>** Collection of projects the user has access to

## setActiveProject

Set the currently active project within TERA

### Parameters

*   `project` **([Object][88] | [String][91])** The project to set as active - either the full Project object or its ID

## requireProject

Ask the user to select a project from those available - if one isn't already active
Note that this function will percist in asking the uesr even if they try to cancel

### Parameters

*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.autoSetActiveProject` **[Boolean][89]** After selecting a project set that project as active in TERA (optional, default `true`)
    *   `options.title` **[String][91]** The title of the dialog to display (optional, default `"Select a project to work with"`)
    *   `options.noSelectTitle` **[String][91]** Dialog title when warning the user they need to select something (optional, default `'Select project'`)
    *   `options.noSelectBody` **[String][91]** Dialog body when warning the user they need to select something (optional, default `'A project needs to be selected to continue'`)

Returns **[Promise][93]<[Project][49]>** The active project

## selectProject

Prompt the user to select a project from those available

### Parameters

*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.title` **[String][91]** The title of the dialog to display (optional, default `"Select a project to work with"`)
    *   `options.allowCancel` **[Boolean][89]** Advertise cancelling the operation, the dialog can still be cancelled by closing it (optional, default `true`)
    *   `options.setActive` **[Boolean][89]** Also set the project as active when selected (optional, default `false`)

Returns **[Promise][93]<[Project][49]>** The active project

## getProjectState

Return the current, full snapshot state of the active project

### Parameters

*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
*   `Paths` **[Array][92]<[String][91]>** to subscribe to e.g. \['/users/'],

Returns **[Promise][93]<[Object][88]>** The current project state snapshot

## setProjectState

Set a nested value within the project state
Paths can be any valid Lodash.set() value such as:

    - Dotted notation - e.g. `foo.bar.1.baz`
    - Array path segments e.g. `['foo', 'bar', 1, 'baz']`

### Parameters

*   `path` **([String][91] | [Array][92]<[String][91]>)** The sub-path within the project state to set
*   `value` **any** The value to set
*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.save` **[Boolean][89]** Save the changes to the server immediately, disable to queue up multiple writes (optional, default `true`)
    *   `options.sync` **[Boolean][89]** Wait for the server to acknowledge the write, you almost never need to do this (optional, default `false`)

Returns **[Promise][93]** A promise which resolves when the operation has synced with the server

## setProjectStateDefaults

*   **See**: setProjectState()

Set a nested value within the project state - just like `setProjectState()` - but only if no value for that path exists

### Parameters

*   `path` **([String][91] | [Array][92]<[String][91]>)** The sub-path within the project state to set
*   `value` **any** The value to set
*   `options` **[Object][88]?** Additional options to mutate behaviour, see setProjectState() for the full list of supported options

Returns **[Promise][93]<[Boolean][89]>** A promise which resolves to whether any changes were made - True if defaults were applied, false otherwise

## saveProjectState

Force-Save the currently active project state

Returns **[Promise][93]** A promise which resolves when the operation has completed

## replaceProjectState

*   **See**: setProjectState()

Overwrite the entire project state with a new object
You almost never want to use this function directly, see `setProjectState(path, value)` for a nicer wrapper

### Parameters

*   `newState` **[Object][88]** The new state to replace the current state with

Returns **[Promise][93]** A promise which resolves when the operation has completed

## applyProjectStatePatch

Apply a computed `just-diff` patch to the current project state

### Parameters

*   `Patch` **[Object][88]** to apply

Returns **[Promise][93]** A promise which resolves when the operation has completed

## subscribeProjectState

Subscribe to project state changes
This will dispatch an RPC call to the source object `applyProjectStatePatchLocal()` function with the patch
If the above call fails the subscriber is assumed as dead and unsubscribed from the polling list

Returns **[Promise][93]<[Function][97]>** A promise which resolves when a subscription has been created, call the resulting function to unsubscribe

## ProjectFile

Data structure for a project file

### Properties

*   `id` **[String][91]** A UUID string representing the unique ID of the file
*   `name` **[String][91]** Relative name path (can contain prefix directories) for the human readable file name
*   `parsedName` **[Object][88]** An object representing meta file parts of a file name

    *   `parsedName.basename` **[String][91]** The filename + extention (i.e. everything without directory name)
    *   `parsedName.filename` **[String][91]** The file portion of the name (basename without the extension)
    *   `parsedName.ext` **[String][91]** The extension portion of the name (always lower case)
    *   `parsedName.dirName` **[String][91]** The directory path portion of the name
*   `created` **[Date][96]** A date representing when the file was created
*   `modified` **[Date][96]** A date representing when the file was created
*   `accessed` **[Date][96]** A date representing when the file was last accessed
*   `size` **[Number][90]** Size, in bytes, of the file
*   `mime` **[String][91]** The associated mime type for the file

## FileFilters

Data structure for a file filter

### Properties

*   `library` **[Boolean][89]?** Restrict to library files only
*   `filename` **[String][91]?** CSV of @momsfriendlydevco/match expressions to filter the filename by (filenames are the basename sans extension)
*   `basename` **[String][91]?** CSV of @momsfriendlydevco/match expressions to filter the basename by
*   `ext` **[String][91]?** CSV of @momsfriendlydevco/match expressions to filter the file extension by

## selectProjectFile

Prompt the user to select a library to operate on

### Parameters

*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.title` **[String][91]** The title of the dialog to display (optional, default `"Select a file"`)
    *   `options.hint` **([String][91] | [Array][92]<[String][91]>)?** Hints to identify the file to select in array order of preference
    *   `options.filters` **[FileFilters][72]?** Optional file filters
    *   `options.allowUpload` **[Boolean][89]** Allow uploading new files (optional, default `true`)
    *   `options.allowRefresh` **[Boolean][89]** Allow the user to manually refresh the file list (optional, default `true`)
    *   `options.allowDownloadZip` **[Boolean][89]** Allow the user to download a Zip of all files (optional, default `true`)
    *   `options.allowCancel` **[Boolean][89]** Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed (optional, default `true`)
    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
    *   `options.filter` **[FileFilters][72]?** Optional file filters

Returns **[Promise][93]<[ProjectFile][70]>** The eventually selected file

## getProjectFiles

Fetch the files associated with a given project

### Parameters

*   `options` **[Object][88]** Options which mutate behaviour

    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
    *   `options.meta` **[Boolean][89]** Pull meta information for each file entity (optional, default `true`)

Returns **[Promise][93]<[Array][92]<[ProjectFile][70]>>** A collection of project files for the given project

## selectProjectLibrary

Prompt the user to select a library to operate on and return a array of references in a given format

### Parameters

*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.title` **[String][91]** The title of the dialog to display (optional, default `"Select a citation library"`)
    *   `options.hint` **([String][91] | [Array][92]<[String][91]>)?** Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed'
    *   `options.allowUpload` **[Boolean][89]** Allow uploading new files (optional, default `true`)
    *   `options.allowRefresh` **[Boolean][89]** Allow the user to manually refresh the file list (optional, default `true`)
    *   `options.allowDownloadZip` **[Boolean][89]** Allow the user to download a Zip of all files (optional, default `true`)
    *   `options.allowCancel` **[Boolean][89]** Allow cancelling the operation. Will throw `'CANCEL'` as the promise rejection if acationed (optional, default `true`)
    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
    *   `options.filters` **[FileFilters][72]?** Optional file filters, defaults to citation library selection only

Returns **[Promise][93]<[Array][92]\<Ref>>** A collection of references from the selected file

## parseProjectLibrary

Convert a project file into a library of citations

### Parameters

*   `path` **[String][91]** File path to read, if omitted the contents of `options` are used to guess at a suitable file
*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.format` **[String][91]** Format for the file. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object) (optional, default `'json'`)
    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
    *   `options.filter` **[Function][97]?** Optional async file filter, called each time as `(File:ProjectFile)`
    *   `options.find` **[Function][97]?** Optional async final stage file filter to reduce all candidates down to one subject file

Returns **([Promise][93]<[Array][92]\<Ref>> | [Promise][93]\<any>)** A collection of references (default bevahiour) or a whatever format was requested

## setProjectLibrary

Save back a citation library from some input

### Parameters

*   `path` **[String][91]?** File path to save back to
*   `Collection` **[Array][92]\<RefLibRef>** of references for the selected library
*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.format` **[String][91]** Input format used. ENUM: 'pojo' (return a parsed JS collection), 'blob' (raw JS Blob object), 'file' (named JS File object) (optional, default `'json'`)
    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
    *   `options.hint` **[String][91]?** Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'
    *   `options.overwrite` **[Boolean][89]** Allow existing file upsert (optional, default `true`)
    *   `options.meta` **[Object][88]?** Optional meta data to merge into the file data

Returns **[Promise][93]** A promise which resolves when the save operation has completed

## setProjectLibrary

Save back a projects citation library

### Parameters

*   `Collection` **[Array][92]\<RefLibRef>** of references for the selected library
*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.autoRequire` **[Boolean][89]** Run `requireProject()` automatically before continuing (optional, default `true`)
    *   `options.hint` **[String][91]?** Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped'

Returns **[Promise][93]** A promise which resolves when the save operation has completed

## uiAlert

Display simple text within TERA

### Parameters

*   `text` **[String][91]** The text to display
*   `options` **[Object][88]?** Additional options to mutate behaviour

    *   `options.title` **[String][91]** The title of the alert box (optional, default `'TERA'`)
    *   `options.isHtml` **[Boolean][89]** If falsy the text is rendered as plain-text otherwise it will be assumed as HTML content (optional, default `false`)

Returns **[Promise][93]** A promise which resolves when the alert has been dismissed

[1]: #terafy

[2]: #settings

[3]: #properties

[4]: #events

[5]: #dom

[6]: #properties-1

[7]: #methods

[8]: #plugins

[9]: #send

[10]: #parameters

[11]: #sendraw

[12]: #parameters-1

[13]: #rpc

[14]: #parameters-2

[15]: #acceptmessage

[16]: #parameters-3

[17]: #acceptpostboxes

[18]: #createprojectstatepatch

[19]: #parameters-4

[20]: #applyprojectstatepatchlocal

[21]: #parameters-5

[22]: #init

[23]: #parameters-6

[24]: #detectmode

[25]: #injectcomms

[26]: #injectstylesheet

[27]: #injectmethods

[28]: #debug

[29]: #parameters-7

[30]: #set

[31]: #parameters-8

[32]: #setifdev

[33]: #parameters-9

[34]: #use

[35]: #parameters-10

[36]: #mixin

[37]: #parameters-11

[38]: #toggledevmode

[39]: #parameters-12

[40]: #togglefocus

[41]: #parameters-13

[42]: #handshake

[43]: #properties-2

[44]: #user

[45]: #properties-3

[46]: #getuser

[47]: #requireuser

[48]: #

[49]: #project

[50]: #getproject

[51]: #getprojects

[52]: #setactiveproject

[53]: #parameters-14

[54]: #requireproject

[55]: #parameters-15

[56]: #selectproject

[57]: #parameters-16

[58]: #getprojectstate

[59]: #parameters-17

[60]: #setprojectstate

[61]: #parameters-18

[62]: #setprojectstatedefaults

[63]: #parameters-19

[64]: #saveprojectstate

[65]: #replaceprojectstate

[66]: #parameters-20

[67]: #applyprojectstatepatch

[68]: #parameters-21

[69]: #subscribeprojectstate

[70]: #projectfile

[71]: #properties-4

[72]: #filefilters

[73]: #properties-5

[74]: #selectprojectfile

[75]: #parameters-22

[76]: #getprojectfiles

[77]: #parameters-23

[78]: #selectprojectlibrary

[79]: #parameters-24

[80]: #parseprojectlibrary

[81]: #parameters-25

[82]: #setprojectlibrary

[83]: #parameters-26

[84]: #setprojectlibrary-1

[85]: #parameters-27

[86]: #uialert

[87]: #parameters-28

[88]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[89]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[90]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[91]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[92]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array

[93]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[94]: https://developer.mozilla.org/docs/Web/API/MessageEvent

[95]: http://jsonpatch.com

[96]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date

[97]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
