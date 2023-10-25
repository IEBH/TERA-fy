## Classes

<dl>
<dt><a href="#TeraFyServer">TeraFyServer</a></dt>
<dd></dd>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#Project">Project</a></dt>
<dd></dd>
</dl>

<a name="TeraFyServer"></a>

## TeraFyServer
**Kind**: global class  

* [TeraFyServer](#TeraFyServer)
    * [new TeraFyServer()](#new_TeraFyServer_new)
    * [.settings](#TeraFyServer+settings) : <code>Object</code>
    * [.sendRaw(message)](#TeraFyServer+sendRaw)
    * [.acceptMessage(Raw)](#TeraFyServer+acceptMessage)
    * [.handshake()](#TeraFyServer+handshake) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.getUser()](#TeraFyServer+getUser) ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
    * [.getProject()](#TeraFyServer+getProject) ⇒ <code>Promise.&lt;(Project\|null)&gt;</code>
    * [.getProjects()](#TeraFyServer+getProjects) ⇒ <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code>
    * [.requireProject()](#TeraFyServer+requireProject) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
    * [.selectProject([options])](#TeraFyServer+selectProject) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
    * [.getProjectStateSnapshot([options], Paths)](#TeraFyServer+getProjectStateSnapshot) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.applyProjectStatePatch()](#TeraFyServer+applyProjectStatePatch)
    * [.getProjectLibrary([options])](#TeraFyServer+getProjectLibrary) ⇒ <code>Promise.&lt;Array.&lt;RefLibRef&gt;&gt;</code>
    * [.setProjectLibrary(Collection, [options])](#TeraFyServer+setProjectLibrary) ⇒ <code>Promise</code>
    * [.init()](#TeraFyServer+init)

<a name="new_TeraFyServer_new"></a>

### new TeraFyServer()
Server-side functions available to the Tera-Fy client library

<a name="TeraFyServer+settings"></a>

### teraFyServer.settings : <code>Object</code>
Various settings to configure behaviour

**Kind**: instance property of [<code>TeraFyServer</code>](#TeraFyServer)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| devMode | <code>Boolean</code> | Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance |
| restrictOrigin | <code>String</code> | URL to restrict communications to |

<a name="TeraFyServer+sendRaw"></a>

### teraFyServer.sendRaw(message)
Send raw message content to the client

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

<a name="TeraFyServer+acceptMessage"></a>

### teraFyServer.acceptMessage(Raw)
Accept a message from the parent event listener

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  

| Param | Type | Description |
| --- | --- | --- |
| Raw | <code>MessageEvent</code> | message event to process |

<a name="TeraFyServer+handshake"></a>

### teraFyServer.handshake() ⇒ <code>Promise.&lt;Object&gt;</code>
Return basic server information as a form of validation

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - Basic promise result  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| date | <code>Date</code> | Server date |

<a name="TeraFyServer+getUser"></a>

### teraFyServer.getUser() ⇒ [<code>Promise.&lt;User&gt;</code>](#User)
Fetch the current session user

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: [<code>Promise.&lt;User&gt;</code>](#User) - The current logged in user or null if none  
<a name="TeraFyServer+getProject"></a>

### teraFyServer.getProject() ⇒ <code>Promise.&lt;(Project\|null)&gt;</code>
Get the currently active project, if any

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: <code>Promise.&lt;(Project\|null)&gt;</code> - The currently active project, if any  
<a name="TeraFyServer+getProjects"></a>

### teraFyServer.getProjects() ⇒ <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code>
Get a list of projects the current session user has access to

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: <code>Promise.&lt;Array.&lt;Project&gt;&gt;</code> - Collection of projects the user has access to  
<a name="TeraFyServer+requireProject"></a>

### teraFyServer.requireProject() ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
Ask the user to select a project from those available - if one isn't already active
Note that this function will percist in asking the uesr even if they try to cancel

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: [<code>Promise.&lt;Project&gt;</code>](#Project) - The active project  
<a name="TeraFyServer+selectProject"></a>

### teraFyServer.selectProject([options]) ⇒ [<code>Promise.&lt;Project&gt;</code>](#Project)
Prompt the user to select a project from those available

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: [<code>Promise.&lt;Project&gt;</code>](#Project) - The active project  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.title] | <code>String</code> | <code>&quot;Select a project to work with&quot;</code> | The title of the dialog to display |
| [options.allowCancel] | <code>Boolean</code> | <code>true</code> | Advertise cancelling the operation, the dialog can still be cancelled by closing it |

<a name="TeraFyServer+getProjectStateSnapshot"></a>

### teraFyServer.getProjectStateSnapshot([options], Paths) ⇒ <code>Promise.&lt;Object&gt;</code>
Return the current, full snapshot state of the active project

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The current project state snapshot  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

<a name="TeraFyServer+applyProjectStatePatch"></a>

### teraFyServer.applyProjectStatePatch()
Apply a computed `just-diff` patch to the current project state

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
<a name="TeraFyServer+getProjectLibrary"></a>

### teraFyServer.getProjectLibrary([options]) ⇒ <code>Promise.&lt;Array.&lt;RefLibRef&gt;&gt;</code>
Fetch the active projects citation library

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: <code>Promise.&lt;Array.&lt;RefLibRef&gt;&gt;</code> - Collection of references for the selected library  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.multiple] | <code>Boolean</code> | <code>false</code> | Allow selection of multiple libraries |
| [options.hint] | <code>String</code> \| <code>Array.&lt;String&gt;</code> |  | Hints to identify the library to select in array order of preference. Generally corresponds to the previous stage - e.g. 'deduped', 'review1', 'review2', 'dedisputed' |

<a name="TeraFyServer+setProjectLibrary"></a>

### teraFyServer.setProjectLibrary(Collection, [options]) ⇒ <code>Promise</code>
Save back a projects citation library

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
**Returns**: <code>Promise</code> - A promise which resolves when the save operation has completed  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| Collection | <code>Array.&lt;RefLibRef&gt;</code> |  | of references for the selected library |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.hint] | <code>String</code> |  | Hint to store against the library. Generally corresponds to the current operation being performed - e.g. 'deduped' |

<a name="TeraFyServer+init"></a>

### teraFyServer.init()
Initialize the browser listener

**Kind**: instance method of [<code>TeraFyServer</code>](#TeraFyServer)  
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

