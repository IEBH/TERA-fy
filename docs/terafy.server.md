## Classes

<dl>
<dt><a href="#TeraFyServer">TeraFyServer</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#Project">Project</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
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
<dt><a href="#sendRaw">sendRaw(message)</a></dt>
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
<dt><a href="#getProjectStateSnapshot">getProjectStateSnapshot([options], Paths)</a> ⇒ <code>Promise.&lt;Object&gt;</code></dt>
<dd><p>Return the current, full snapshot state of the active project</p>
</dd>
<dt><a href="#applyProjectStatePatch">applyProjectStatePatch()</a></dt>
<dd><p>Apply a computed <code>just-diff</code> patch to the current project state</p>
</dd>
<dt><a href="#getProjectLibrary">getProjectLibrary([options])</a> ⇒ <code>Promise.&lt;Array.&lt;RefLibRef&gt;&gt;</code></dt>
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
</dl>

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

<a name="new_Project_new"></a>

### new Project()
Project entry within TERA

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

## sendRaw(message)
Send raw message content to the client

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

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

<a name="getProjectStateSnapshot"></a>

## getProjectStateSnapshot([options], Paths) ⇒ <code>Promise.&lt;Object&gt;</code>
Return the current, full snapshot state of the active project

**Kind**: global function  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The current project state snapshot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

<a name="applyProjectStatePatch"></a>

## applyProjectStatePatch()
Apply a computed `just-diff` patch to the current project state

**Kind**: global function  
<a name="getProjectLibrary"></a>

## getProjectLibrary([options]) ⇒ <code>Promise.&lt;Array.&lt;RefLibRef&gt;&gt;</code>
Fetch the active projects citation library

**Kind**: global function  
**Returns**: <code>Promise.&lt;Array.&lt;RefLibRef&gt;&gt;</code> - Collection of references for the selected library  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.multiple] | <code>Boolean</code> | <code>false</code> | Allow selection of multiple libraries |
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

