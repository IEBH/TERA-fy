## Classes

<dl>
<dt><a href="#TeraFy">TeraFy</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#Project">Project</a></dt>
<dd></dd>
<dt><a href="#ProjectFile">ProjectFile</a></dt>
<dd></dd>
<dt><a href="#TeraFyServer">TeraFyServer</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#Project">Project</a></dt>
<dd></dd>
<dt><a href="#ProjectFile">ProjectFile</a></dt>
<dd></dd>
<dt><a href="#TeraFyPlugin">TeraFyPlugin</a></dt>
<dd></dd>
<dt><a href="#TeraFyPluginVue">TeraFyPluginVue</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#send">send(message)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Send a message + wait for a response object</p>
</dd>
<dt><a href="#sendRaw">sendRaw(message)</a></dt>
<dd><p>Send raw message content to the server
This function does not return or wait for a reply - use <code>send()</code> for that</p>
</dd>
<dt><a href="#rpc">rpc(method)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Call an RPC function in the server instance</p>
</dd>
<dt><a href="#acceptMessage">acceptMessage(Raw)</a></dt>
<dd><p>Accept an incoming message</p>
</dd>
<dt><a href="#applyProjectStatePatchLocal">applyProjectStatePatchLocal(patch)</a> ⇒ <code>Promise</code></dt>
<dd><p>Client function which accepts a patch from the server and applies it to local project state
This function is expected to be sub-classed by a plugin</p>
</dd>
<dt><a href="#init">init()</a> ⇒ <code><a href="#TeraFy">Promise.&lt;TeraFy&gt;</a></code></dt>
<dd><p>Initalize the TERA client singleton
This function can only be called once and will return the existing init() worker Promise if its called againt</p>
</dd>
<dt><a href="#detectMode">detectMode()</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Populate <code>settings.mode</code>
Try to communicate with a parent frame, if none assume we need to fallback to child mode</p>
</dd>
<dt><a href="#injectComms">injectComms()</a> ⇒ <code>Promise</code></dt>
<dd><p>Find an existing active TERA server OR initalize one</p>
</dd>
<dt><a href="#injectStylesheet">injectStylesheet()</a></dt>
<dd><p>Inject a local stylesheet to handle TERA server functionality</p>
</dd>
<dt><a href="#injectMethods">injectMethods()</a></dt>
<dd><p>Inject all server methods defined in <code>methods</code> as local functions wrapped in the <code>rpc</code> function</p>
</dd>
<dt><a href="#debug">debug([status])</a></dt>
<dd><p>Debugging output function
This function will only act if <code>settings.devMode</code> is truthy</p>
</dd>
<dt><a href="#set">set(key, value)</a> ⇒ <code><a href="#TeraFy">TeraFy</a></code></dt>
<dd><p>Set or merge settings
This function also routes &#39;special&#39; keys like <code>devMode</code> to their internal handlers</p>
</dd>
<dt><a href="#use">use(The, [options])</a> ⇒ <code><a href="#TeraFy">TeraFy</a></code></dt>
<dd><p>Include a TeraFy client plugin</p>
</dd>
<dt><a href="#mixin">mixin(target, source)</a></dt>
<dd><p>Internal function used by use() to merge an external declared singleton against this object</p>
</dd>
<dt><a href="#toggleDevMode">toggleDevMode([devModeEnabled])</a> ⇒ <code><a href="#TeraFy">TeraFy</a></code></dt>
<dd><p>Set or toggle devMode</p>
</dd>
<dt><a href="#toggleFocus">toggleFocus([isFocused])</a></dt>
<dd><p>Fit the nested TERA server to a full-screen
This is usually because the server component wants to perform some user activity like calling $prompt</p>
</dd>
<dt><a href="#handshake">handshake()</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Return basic server information as a form of validation</p>
</dd>
<dt><a href="#getUser">getUser()</a> ⇒ <code><a href="#User">Promise.&lt;User&gt;</a></code></dt>
<dd><p>Fetch the current session user</p>
</dd>
<dt><a href="#getProject">getProject()</a> ⇒ <code>Promise.&lt;(Project|null)&gt;</code></dt>
<dd><p>Get the currently active project, if any</p>
</dd>
<dt><a href="#getProjects">getProjects()</a> ⇒ <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code></dt>
<dd><p>Get a list of projects the current session user has access to</p>
</dd>
<dt><a href="#setActiveProject">setActiveProject(project)</a></dt>
<dd><p>Set the currently active project within TERA</p>
</dd>
<dt><a href="#requireProject">requireProject([options])</a> ⇒ <code><a href="#Project">Promise.&lt;Project&gt;</a></code></dt>
<dd><p>Ask the user to select a project from those available - if one isn&#39;t already active
Note that this function will percist in asking the uesr even if they try to cancel</p>
</dd>
<dt><a href="#selectProject">selectProject([options])</a> ⇒ <code><a href="#Project">Promise.&lt;Project&gt;</a></code></dt>
<dd><p>Prompt the user to select a project from those available</p>
</dd>
<dt><a href="#getProjectState">getProjectState([options], Paths)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Return the current, full snapshot state of the active project</p>
</dd>
<dt><a href="#applyProjectStatePatch">applyProjectStatePatch(Patch)</a> ⇒ <code>Promise</code></dt>
<dd><p>Apply a computed <code>just-diff</code> patch to the current project state</p>
</dd>
<dt><a href="#subscribeProjectState">subscribeProjectState()</a></dt>
<dd><p>Subscribe to project state changes
This will dispatch an RPC call to the source object <code>applyProjectStatePatchLocal()</code> function with the patch
If the above call fails the subscriber is assumed as dead and unsubscribed from the polling list</p>
</dd>
<dt><a href="#getProjectFiles">getProjectFiles(options)</a> ⇒ <code><a href="#ProjectFile">Promise.&lt;ProjectFile&gt;</a></code></dt>
<dd><p>Fetch the files associated with a given project</p>
</dd>
<dt><a href="#getProjectLibrary">getProjectLibrary([path], [options])</a> ⇒ <code>Promise.&lt;Array.&lt;ProjectFile&gt;&gt;</code></dt>
<dd><p>Fetch the active projects citation library</p>
</dd>
<dt><a href="#setProjectLibrary">setProjectLibrary(Collection, [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Save back a projects citation library</p>
</dd>
<dt><a href="#createContext">createContext(e)</a> ⇒ <code>Object</code></dt>
<dd><p>Create a context based on a shallow copy of this instance + additional functionality for the incoming MessageEvent
This is used by acceptMessage to provide a means to reply / send messages to the originator</p>
</dd>
<dt><a href="#senderRpc">senderRpc(method)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Request an RPC call from the original sender of a mesasge
This function only works if the context was sub-classed via <code>createContext()</code></p>
</dd>
<dt><a href="#handshake">handshake()</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Return basic server information as a form of validation</p>
</dd>
<dt><a href="#send">send(message)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Send a message + wait for a response object</p>
</dd>
<dt><a href="#sendRaw">sendRaw(message, Window)</a></dt>
<dd><p>Send raw message content to the client</p>
</dd>
<dt><a href="#acceptMessage">acceptMessage(Raw)</a></dt>
<dd><p>Accept a message from the parent event listener</p>
</dd>
<dt><a href="#requestFocus">requestFocus(cb)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Wrapper function which runs a callback after the frontend UI has obtained focus
This is to fix the issue where the front-end needs to switch between a regular webpage and a focused TERA iFrame wrapper
Any use of $prompt or other UI calls should be wrapped here</p>
</dd>
<dt><a href="#getUser">getUser()</a> ⇒ <code><a href="#User">Promise.&lt;User&gt;</a></code></dt>
<dd><p>Fetch the current session user</p>
</dd>
<dt><a href="#getProject">getProject()</a> ⇒ <code>Promise.&lt;(Project|null)&gt;</code></dt>
<dd><p>Get the currently active project, if any</p>
</dd>
<dt><a href="#getProjects">getProjects()</a> ⇒ <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code></dt>
<dd><p>Get a list of projects the current session user has access to</p>
</dd>
<dt><a href="#setActiveProject">setActiveProject(project)</a></dt>
<dd><p>Set the currently active project within TERA</p>
</dd>
<dt><a href="#requireProject">requireProject([options])</a> ⇒ <code><a href="#Project">Promise.&lt;Project&gt;</a></code></dt>
<dd><p>Ask the user to select a project from those available - if one isn&#39;t already active
Note that this function will percist in asking the uesr even if they try to cancel</p>
</dd>
<dt><a href="#selectProject">selectProject([options])</a> ⇒ <code><a href="#Project">Promise.&lt;Project&gt;</a></code></dt>
<dd><p>Prompt the user to select a project from those available</p>
</dd>
<dt><a href="#getProjectState">getProjectState([options], Paths)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Return the current, full snapshot state of the active project</p>
</dd>
<dt><a href="#applyProjectStatePatch">applyProjectStatePatch(Patch)</a> ⇒ <code>Promise</code></dt>
<dd><p>Apply a computed <code>just-diff</code> patch to the current project state</p>
</dd>
<dt><a href="#subscribeProjectState">subscribeProjectState()</a></dt>
<dd><p>Subscribe to project state changes
This will dispatch an RPC call to the source object <code>applyProjectStatePatchLocal()</code> function with the patch
If the above call fails the subscriber is assumed as dead and unsubscribed from the polling list</p>
</dd>
<dt><a href="#getProjectFiles">getProjectFiles(options)</a> ⇒ <code><a href="#ProjectFile">Promise.&lt;ProjectFile&gt;</a></code></dt>
<dd><p>Fetch the files associated with a given project</p>
</dd>
<dt><a href="#getProjectLibrary">getProjectLibrary([path], [options])</a> ⇒ <code>Promise.&lt;Array.&lt;ProjectFile&gt;&gt;</code></dt>
<dd><p>Fetch the active projects citation library</p>
</dd>
<dt><a href="#setProjectLibrary">setProjectLibrary(Collection, [options])</a> ⇒ <code>Promise</code></dt>
<dd><p>Save back a projects citation library</p>
</dd>
<dt><a href="#init">init()</a></dt>
<dd><p>Initialize the browser listener</p>
</dd>
<dt><a href="#debug">debug()</a></dt>
<dd><p>Debugging output function
This function will only act if <code>settings.devMode</code> is truthy</p>
</dd>
<dt><a href="#init">init()</a></dt>
<dd><p>Optional function to be included when the main TeraFyClient is initalized</p>
</dd>
<dt><a href="#bindProjectState">bindProjectState([options], Paths)</a> ⇒ <code>Promie.&lt;Reactive.&lt;Object&gt;&gt;</code></dt>
<dd><p>Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance</p>
</dd>
<dt><a href="#statePromise">statePromise()</a></dt>
<dd><p>Utility function which returns an awaitable promise when the state is loading or being refreshed
This is used in place of <code>statePromisable</code> as it has a slightly more logical syntax as a function</p>
</dd>
<dt><a href="#vuePlugin">vuePlugin()</a></dt>
<dd><p>Provide a Vue@3 compatible plugin</p>
</dd>
<dt><a href="#install">install([options])</a> ⇒ <code>VuePlugin</code></dt>
<dd><p>Install into Vue as a generic Vue@3 plugin</p>
</dd>
</dl>

<a name="TeraFy"></a>

## TeraFy
**Kind**: global class  
<a name="new_TeraFy_new"></a>

### new TeraFy()
Main Tera-Fy Client (class singleton) to be used in a frontend browser

<a name="User"></a>

## User
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Unique identifier of the user |
| email | <code>String</code> | The email address of the current user |
| name | <code>String</code> | The provided full name of the user |
| isSubscribed | <code>Boolean</code> | Whether the active user has a TERA subscription |


* [User](#User)
    * [new User()](#new_User_new)
    * [new User()](#new_User_new)

<a name="new_User_new"></a>

### new User()
User / active session within TERA

<a name="new_User_new"></a>

### new User()
User / active session within TERA

<a name="Project"></a>

## Project
**Kind**: global class  
**Url**: https://tera-tools.com/help/api/schema  

* [Project](#Project)
    * [new Project()](#new_Project_new)
    * [new Project()](#new_Project_new)

<a name="new_Project_new"></a>

### new Project()
Project entry within TERA

<a name="new_Project_new"></a>

### new Project()
Project entry within TERA

<a name="ProjectFile"></a>

## ProjectFile
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | A UUID string representing the unique ID of the file |
| name | <code>String</code> | Relative name path (can contain prefix directories) for the human readable file name |
| parsedName | <code>Object</code> | An object representing meta file parts of a file name |
| parsedName.basename | <code>String</code> | The filename + extention (i.e. everything without directory name) |
| parsedName.filename | <code>String</code> | The file portion of the name (basename without the extension) |
| parsedName.ext | <code>String</code> | The extension portion of the name (always lower case) |
| parsedName.dirName | <code>String</code> | The directory path portion of the name |
| created | <code>Date</code> | A date representing when the file was created |
| modified | <code>Date</code> | A date representing when the file was created |
| accessed | <code>Date</code> | A date representing when the file was last accessed |
| size | <code>Number</code> | Size, in bytes, of the file |
| mime | <code>String</code> | The associated mime type for the file |


* [ProjectFile](#ProjectFile)
    * [new ProjectFile()](#new_ProjectFile_new)
    * [new ProjectFile()](#new_ProjectFile_new)

<a name="new_ProjectFile_new"></a>

### new ProjectFile()
Data structure for a project file

<a name="new_ProjectFile_new"></a>

### new ProjectFile()
Data structure for a project file

<a name="TeraFyServer"></a>

## TeraFyServer
**Kind**: global class  
<a name="new_TeraFyServer_new"></a>

### new TeraFyServer()
Server-side functions available to the Tera-Fy client library

<a name="User"></a>

## User
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | Unique identifier of the user |
| email | <code>String</code> | The email address of the current user |
| name | <code>String</code> | The provided full name of the user |
| isSubscribed | <code>Boolean</code> | Whether the active user has a TERA subscription |


* [User](#User)
    * [new User()](#new_User_new)
    * [new User()](#new_User_new)

<a name="new_User_new"></a>

### new User()
User / active session within TERA

<a name="new_User_new"></a>

### new User()
User / active session within TERA

<a name="Project"></a>

## Project
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | The Unique ID of the project |
| name | <code>String</code> | The name of the project |
| created | <code>String</code> | The creation date of the project as an ISO string |
| isOwner | <code>Boolean</code> | Whether the current session user is the owner of the project |


* [Project](#Project)
    * [new Project()](#new_Project_new)
    * [new Project()](#new_Project_new)

<a name="new_Project_new"></a>

### new Project()
Project entry within TERA

<a name="new_Project_new"></a>

### new Project()
Project entry within TERA

<a name="ProjectFile"></a>

## ProjectFile
**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>String</code> | A UUID string representing the unique ID of the file |
| name | <code>String</code> | Relative name path (can contain prefix directories) for the human readable file name |
| parsedName | <code>Object</code> | An object representing meta file parts of a file name |
| parsedName.basename | <code>String</code> | The filename + extention (i.e. everything without directory name) |
| parsedName.filename | <code>String</code> | The file portion of the name (basename without the extension) |
| parsedName.ext | <code>String</code> | The extension portion of the name (always lower case) |
| parsedName.dirName | <code>String</code> | The directory path portion of the name |
| created | <code>Date</code> | A date representing when the file was created |
| modified | <code>Date</code> | A date representing when the file was created |
| accessed | <code>Date</code> | A date representing when the file was last accessed |
| size | <code>Number</code> | Size, in bytes, of the file |
| mime | <code>String</code> | The associated mime type for the file |


* [ProjectFile](#ProjectFile)
    * [new ProjectFile()](#new_ProjectFile_new)
    * [new ProjectFile()](#new_ProjectFile_new)

<a name="new_ProjectFile_new"></a>

### new ProjectFile()
Data structure for a project file

<a name="new_ProjectFile_new"></a>

### new ProjectFile()
Data structure for a project file

<a name="TeraFyPlugin"></a>

## TeraFyPlugin
**Kind**: global class  
<a name="new_TeraFyPlugin_new"></a>

### new TeraFyPlugin()
Base TeraFy plugin interface
This is included as a documentation exanple only

<a name="TeraFyPluginVue"></a>

## TeraFyPluginVue
**Kind**: global class  
<a name="new_TeraFyPluginVue_new"></a>

### new TeraFyPluginVue()
Vue observables plugin
Provides the `bindProjectState()` function for Vue based projects

This function is expected to be included via the `terafy.use(MODULE, OPTIONS)` syntax rather than directly

<a name="send"></a>

## send(message) ⇒ <code>Promise.&lt;\*&gt;</code>
Send a message + wait for a response object

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise which resolves when the operation has completed with the remote reply  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

<a name="sendRaw"></a>

## sendRaw(message)
Send raw message content to the server
This function does not return or wait for a reply - use `send()` for that

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

<a name="rpc"></a>

## rpc(method) ⇒ <code>Promise.&lt;\*&gt;</code>
Call an RPC function in the server instance

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The resolved output of the server function  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | The method name to call |
| [...] | <code>\*</code> | Optional arguments to pass to the function |

<a name="acceptMessage"></a>

## acceptMessage(Raw)
Accept an incoming message

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Raw | <code>MessageEvent</code> | message event to process |

<a name="applyProjectStatePatchLocal"></a>

## applyProjectStatePatchLocal(patch) ⇒ <code>Promise</code>
Client function which accepts a patch from the server and applies it to local project state
This function is expected to be sub-classed by a plugin

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise which will resolve when the operation has completed  

| Param | Type | Description |
| --- | --- | --- |
| patch | <code>Object</code> | A just-diff compatible patch to apply |

<a name="init"></a>

## init() ⇒ [<code>Promise.&lt;TeraFy&gt;</code>](#TeraFy)
Initalize the TERA client singleton
This function can only be called once and will return the existing init() worker Promise if its called againt

**Kind**: global function  
**Returns**: [<code>Promise.&lt;TeraFy&gt;</code>](#TeraFy) - An eventual promise which will resovle with this terafy instance  
<a name="detectMode"></a>

## detectMode() ⇒ <code>Promise.&lt;String&gt;</code>
Populate `settings.mode`
Try to communicate with a parent frame, if none assume we need to fallback to child mode

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise which will resolve with the detected mode to use  
<a name="injectComms"></a>

## injectComms() ⇒ <code>Promise</code>
Find an existing active TERA server OR initalize one

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise which will resolve when the loading has completed and we have found a parent TERA instance or initiallized a child  
<a name="injectStylesheet"></a>

## injectStylesheet()
Inject a local stylesheet to handle TERA server functionality

**Kind**: global function  
<a name="injectMethods"></a>

## injectMethods()
Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function

**Kind**: global function  
<a name="debug"></a>

## debug([status])
Debugging output function
This function will only act if `settings.devMode` is truthy

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [status] | <code>&#x27;VERBOSE&#x27;</code> \| <code>&#x27;INFO&#x27;</code> \| <code>&#x27;LOG&#x27;</code> \| <code>&#x27;WARN&#x27;</code> \| <code>&#x27;ERROR&#x27;</code> | Optional prefixing level to mark the message as. 'WARN' and 'ERROR' will always show reguardless of devMode being enabled |
| [msg...] | <code>String</code> | Output to show |

<a name="set"></a>

## set(key, value) ⇒ [<code>TeraFy</code>](#TeraFy)
Set or merge settings
This function also routes 'special' keys like `devMode` to their internal handlers

**Kind**: global function  
**Returns**: [<code>TeraFy</code>](#TeraFy) - This chainable terafy instance  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> \| <code>Object</code> | Either a single setting key to set or an object to merge |
| value | <code>\*</code> | The value to set if `key` is a string |

<a name="use"></a>

## use(The, [options]) ⇒ [<code>TeraFy</code>](#TeraFy)
Include a TeraFy client plugin

**Kind**: global function  
**Returns**: [<code>TeraFy</code>](#TeraFy) - This chainable terafy instance  

| Param | Type | Description |
| --- | --- | --- |
| The | <code>Object</code> | module function to include. Invoked as `(teraClient:TeraFy, options:Object)` |
| [options] | <code>Object</code> | Additional options to mutate behaviour |

<a name="mixin"></a>

## mixin(target, source)
Internal function used by use() to merge an external declared singleton against this object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>Object</code> | Initalied class instance to extend |
| source | <code>Object</code> | Initalized source object to extend from |

<a name="toggleDevMode"></a>

## toggleDevMode([devModeEnabled]) ⇒ [<code>TeraFy</code>](#TeraFy)
Set or toggle devMode

**Kind**: global function  
**Returns**: [<code>TeraFy</code>](#TeraFy) - This chainable terafy instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [devModeEnabled] | <code>String</code> \| <code>Boolean</code> | <code>&#x27;toggle&#x27;</code> | Optional boolean to force dev mode |

<a name="toggleFocus"></a>

## toggleFocus([isFocused])
Fit the nested TERA server to a full-screen
This is usually because the server component wants to perform some user activity like calling $prompt

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isFocused] | <code>String</code> \| <code>Boolean</code> | <code>&#x27;toggle&#x27;</code> | Whether to fullscreen the embedded component |

<a name="handshake"></a>

## handshake() ⇒ <code>Promise.&lt;Object&gt;</code>
Return basic server information as a form of validation

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Basic promise result  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Server date |

<a name="getUser"></a>

## getUser() ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Fetch the current session user

**Kind**: global function  
**Returns**: [<code>Promise.&lt;User&gt;</code>](#User) - The current logged in user or null if none  
<a name="getProject"></a>

## getProject() ⇒ <code>Promise.&lt;(Project\|null)&gt;</code>
Get the currently active project, if any

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Project\|null)&gt;</code> - The currently active project, if any  
<a name="getProjects"></a>

## getProjects() ⇒ <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code>
Get a list of projects the current session user has access to

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code> - Collection of projects the user has access to  
<a name="setActiveProject"></a>

## setActiveProject(project)
Set the currently active project within TERA

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>Object</code> \| <code>String</code> | The project to set as active - either the full Project object or its ID |

<a name="requireProject"></a>

## requireProject([options]) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
Ask the user to select a project from those available - if one isn't already active
Note that this function will percist in asking the uesr even if they try to cancel

**Kind**: global function  
**Returns**: [<code>Promise.&lt;Project&gt;</code>](#Project) - The active project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoSetActiveProject] | <code>Boolean</code> | <code>true</code> | After selecting a project set that project as active in TERA |
| [options.title] | <code>String</code> | <code>&quot;Select a project to work with&quot;</code> | The title of the dialog to display |
| [options.noSelectTitle] | <code>String</code> | <code>&#x27;Select project&#x27;</code> | Dialog title when warning the user they need to select something |
| [options.noSelectBody] | <code>String</code> | <code>&#x27;A project needs to be selected to continue&#x27;</code> | Dialog body when warning the user they need to select something |

<a name="selectProject"></a>

## selectProject([options]) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
Prompt the user to select a project from those available

**Kind**: global function  
**Returns**: [<code>Promise.&lt;Project&gt;</code>](#Project) - The active project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.title] | <code>String</code> | <code>&quot;Select a project to work with&quot;</code> | The title of the dialog to display |
| [options.allowCancel] | <code>Boolean</code> | <code>true</code> | Advertise cancelling the operation, the dialog can still be cancelled by closing it |
| [options.setActive] | <code>Boolean</code> | <code>false</code> | Also set the project as active when selected |

<a name="getProjectState"></a>

## getProjectState([options], Paths) ⇒ <code>Promise.&lt;Object&gt;</code>
Return the current, full snapshot state of the active project

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The current project state snapshot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

<a name="applyProjectStatePatch"></a>

## applyProjectStatePatch(Patch) ⇒ <code>Promise</code>
Apply a computed `just-diff` patch to the current project state

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise which resolves when the operation has completed  

| Param | Type | Description |
| --- | --- | --- |
| Patch | <code>Object</code> | to apply |

<a name="subscribeProjectState"></a>

## subscribeProjectState()
Subscribe to project state changes
This will dispatch an RPC call to the source object `applyProjectStatePatchLocal()` function with the patch
If the above call fails the subscriber is assumed as dead and unsubscribed from the polling list

**Kind**: global function  
<a name="getProjectFiles"></a>

## getProjectFiles(options) ⇒ [<code>Promise.&lt;ProjectFile&gt;</code>](#ProjectFile)
Fetch the files associated with a given project

**Kind**: global function  
**Returns**: [<code>Promise.&lt;ProjectFile&gt;</code>](#ProjectFile) - A collection of project files for the given project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options which mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.meta] | <code>Boolean</code> | <code>true</code> | Pull meta information for each file entity |

<a name="getProjectLibrary"></a>

## getProjectLibrary([path], [options]) ⇒ <code>Promise.&lt;Array.&lt;ProjectFile&gt;&gt;</code>
Fetch the active projects citation library

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;ProjectFile&gt;&gt;</code> - Collection of references for the selected library matching the given hint + filter, this could be a zero length array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [path] | <code>String</code> |  | Optional file path to use, if omitted the contents of `options` are used to guess at a suitable file |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.multiple] | <code>Boolean</code> | <code>false</code> | Allow selection of multiple libraries |
| [options.filter] | <code>function</code> |  | Optional async file filter, called each time as `(File:ProjectFile)` |
| [options.find] | <code>function</code> |  | Optional async final stage file filter to reduce all candidates down to one subject file |
| [options.hint] | <code>String</code> \| <code>Array.&lt;String&gt;</code> |  | Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed' |

<a name="setProjectLibrary"></a>

## setProjectLibrary(Collection, [options]) ⇒ <code>Promise</code>
Save back a projects citation library

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise which resolves when the save operation has completed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| Collection | <code>Array.&lt;RefLibRef&gt;</code> |  | of references for the selected library |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.hint] | <code>String</code> |  | Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped' |

<a name="createContext"></a>

## createContext(e) ⇒ <code>Object</code>
Create a context based on a shallow copy of this instance + additional functionality for the incoming MessageEvent
This is used by acceptMessage to provide a means to reply / send messages to the originator

**Kind**: global function  
**Returns**: <code>Object</code> - A context, which is this instance extended with additional properties  

| Param | Type | Description |
| --- | --- | --- |
| e | <code>MessageEvent</code> | Original message event to base the new context on |

<a name="senderRpc"></a>

## senderRpc(method) ⇒ <code>Promise.&lt;\*&gt;</code>
Request an RPC call from the original sender of a mesasge
This function only works if the context was sub-classed via `createContext()`

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The resolved output of the server function  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | The method name to call |
| [...] | <code>\*</code> | Optional arguments to pass to the function |

<a name="handshake"></a>

## handshake() ⇒ <code>Promise.&lt;Object&gt;</code>
Return basic server information as a form of validation

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Basic promise result  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Server date |

<a name="send"></a>

## send(message) ⇒ <code>Promise.&lt;\*&gt;</code>
Send a message + wait for a response object

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise which resolves when the operation has completed with the remote reply  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

<a name="sendRaw"></a>

## sendRaw(message, Window)
Send raw message content to the client

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |
| Window | <code>Window</code> | context to dispatch the message via if its not the same as the regular window |

<a name="acceptMessage"></a>

## acceptMessage(Raw)
Accept a message from the parent event listener

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| Raw | <code>MessageEvent</code> | message event to process |

<a name="requestFocus"></a>

## requestFocus(cb) ⇒ <code>Promise.&lt;\*&gt;</code>
Wrapper function which runs a callback after the frontend UI has obtained focus
This is to fix the issue where the front-end needs to switch between a regular webpage and a focused TERA iFrame wrapper
Any use of $prompt or other UI calls should be wrapped here

**Kind**: global function  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise which resolves with the resulting inner callback payload  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Async function to run in focused mode |

<a name="getUser"></a>

## getUser() ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Fetch the current session user

**Kind**: global function  
**Returns**: [<code>Promise.&lt;User&gt;</code>](#User) - The current logged in user or null if none  
<a name="getProject"></a>

## getProject() ⇒ <code>Promise.&lt;(Project\|null)&gt;</code>
Get the currently active project, if any

**Kind**: global function  
**Returns**: <code>Promise.&lt;(Project\|null)&gt;</code> - The currently active project, if any  
<a name="getProjects"></a>

## getProjects() ⇒ <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code>
Get a list of projects the current session user has access to

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code> - Collection of projects the user has access to  
<a name="setActiveProject"></a>

## setActiveProject(project)
Set the currently active project within TERA

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>Object</code> \| <code>String</code> | The project to set as active - either the full Project object or its ID |

<a name="requireProject"></a>

## requireProject([options]) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
Ask the user to select a project from those available - if one isn't already active
Note that this function will percist in asking the uesr even if they try to cancel

**Kind**: global function  
**Returns**: [<code>Promise.&lt;Project&gt;</code>](#Project) - The active project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoSetActiveProject] | <code>Boolean</code> | <code>true</code> | After selecting a project set that project as active in TERA |
| [options.title] | <code>String</code> | <code>&quot;Select a project to work with&quot;</code> | The title of the dialog to display |
| [options.noSelectTitle] | <code>String</code> | <code>&#x27;Select project&#x27;</code> | Dialog title when warning the user they need to select something |
| [options.noSelectBody] | <code>String</code> | <code>&#x27;A project needs to be selected to continue&#x27;</code> | Dialog body when warning the user they need to select something |

<a name="selectProject"></a>

## selectProject([options]) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
Prompt the user to select a project from those available

**Kind**: global function  
**Returns**: [<code>Promise.&lt;Project&gt;</code>](#Project) - The active project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.title] | <code>String</code> | <code>&quot;Select a project to work with&quot;</code> | The title of the dialog to display |
| [options.allowCancel] | <code>Boolean</code> | <code>true</code> | Advertise cancelling the operation, the dialog can still be cancelled by closing it |
| [options.setActive] | <code>Boolean</code> | <code>false</code> | Also set the project as active when selected |

<a name="getProjectState"></a>

## getProjectState([options], Paths) ⇒ <code>Promise.&lt;Object&gt;</code>
Return the current, full snapshot state of the active project

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The current project state snapshot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

<a name="applyProjectStatePatch"></a>

## applyProjectStatePatch(Patch) ⇒ <code>Promise</code>
Apply a computed `just-diff` patch to the current project state

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise which resolves when the operation has completed  

| Param | Type | Description |
| --- | --- | --- |
| Patch | <code>Object</code> | to apply |

<a name="subscribeProjectState"></a>

## subscribeProjectState()
Subscribe to project state changes
This will dispatch an RPC call to the source object `applyProjectStatePatchLocal()` function with the patch
If the above call fails the subscriber is assumed as dead and unsubscribed from the polling list

**Kind**: global function  
<a name="getProjectFiles"></a>

## getProjectFiles(options) ⇒ [<code>Promise.&lt;ProjectFile&gt;</code>](#ProjectFile)
Fetch the files associated with a given project

**Kind**: global function  
**Returns**: [<code>Promise.&lt;ProjectFile&gt;</code>](#ProjectFile) - A collection of project files for the given project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| options | <code>Object</code> |  | Options which mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.meta] | <code>Boolean</code> | <code>true</code> | Pull meta information for each file entity |

<a name="getProjectLibrary"></a>

## getProjectLibrary([path], [options]) ⇒ <code>Promise.&lt;Array.&lt;ProjectFile&gt;&gt;</code>
Fetch the active projects citation library

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;ProjectFile&gt;&gt;</code> - Collection of references for the selected library matching the given hint + filter, this could be a zero length array  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [path] | <code>String</code> |  | Optional file path to use, if omitted the contents of `options` are used to guess at a suitable file |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.multiple] | <code>Boolean</code> | <code>false</code> | Allow selection of multiple libraries |
| [options.filter] | <code>function</code> |  | Optional async file filter, called each time as `(File:ProjectFile)` |
| [options.find] | <code>function</code> |  | Optional async final stage file filter to reduce all candidates down to one subject file |
| [options.hint] | <code>String</code> \| <code>Array.&lt;String&gt;</code> |  | Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed' |

<a name="setProjectLibrary"></a>

## setProjectLibrary(Collection, [options]) ⇒ <code>Promise</code>
Save back a projects citation library

**Kind**: global function  
**Returns**: <code>Promise</code> - A promise which resolves when the save operation has completed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| Collection | <code>Array.&lt;RefLibRef&gt;</code> |  | of references for the selected library |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.hint] | <code>String</code> |  | Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped' |

<a name="init"></a>

## init()
Initialize the browser listener

**Kind**: global function  
<a name="debug"></a>

## debug()
Debugging output function
This function will only act if `settings.devMode` is truthy

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [msg...] | <code>String</code> | Output to show |

<a name="init"></a>

## init()
Optional function to be included when the main TeraFyClient is initalized

**Kind**: global function  
<a name="bindProjectState"></a>

## bindProjectState([options], Paths) ⇒ <code>Promie.&lt;Reactive.&lt;Object&gt;&gt;</code>
Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance

**Kind**: global function  
**Returns**: <code>Promie.&lt;Reactive.&lt;Object&gt;&gt;</code> - A reactive object representing the project state  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.write] | <code>Boolean</code> | <code>true</code> | Allow local reactivity to writes - send these to the server |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

<a name="statePromise"></a>

## statePromise()
Utility function which returns an awaitable promise when the state is loading or being refreshed
This is used in place of `statePromisable` as it has a slightly more logical syntax as a function

**Kind**: global function  
**Example**  
```js
Await the state loading
await $tera.statePromise();
```
<a name="vuePlugin"></a>

## vuePlugin()
Provide a Vue@3 compatible plugin

**Kind**: global function  
<a name="install"></a>

## install([options]) ⇒ <code>VuePlugin</code>
Install into Vue as a generic Vue@3 plugin

**Kind**: global function  
**Returns**: <code>VuePlugin</code> - A plugin matching the Vue@3 spec  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoInit] | <code>Boolean</code> | <code>true</code> | Call Init() during the `statePromiseable` cycle if its not already been called |
| [options.globalName] | <code>String</code> | <code>&#x27;$tera&#x27;</code> | Globa property to allocate this service as |
| [options.bindOptions] | <code>Objecct</code> |  | Options passed to `bindProjectState()` |

