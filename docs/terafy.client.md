<a name="TeraFy"></a>

## TeraFy
**Kind**: global class  

* [TeraFy](#TeraFy)
    * [new TeraFy()](#new_TeraFy_new)
    * [.settings](#TeraFy+settings) : <code>Object</code>
    * [.dom](#TeraFy+dom) : <code>Object</code>
    * [.methods](#TeraFy+methods) : <code>Array.&lt;String&gt;</code>
    * [.acceptPostboxes](#TeraFy+acceptPostboxes)
    * [.send(message)](#TeraFy+send) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.sendRaw(message)](#TeraFy+sendRaw)
    * [.rpc(method)](#TeraFy+rpc) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.acceptMessage(Raw)](#TeraFy+acceptMessage)
    * [.init()](#TeraFy+init)
    * [.injectMain()](#TeraFy+injectMain)
    * [.injectStylesheet()](#TeraFy+injectStylesheet)
    * [.injectMethods()](#TeraFy+injectMethods)
    * [.bindProjectState([options], Paths)](#TeraFy+bindProjectState) ⇒ <code>Promies.&lt;Reactive.&lt;Object&gt;&gt;</code>

<a name="new_TeraFy_new"></a>

### new TeraFy()
Main Tera-Fy Client (class singleton) to be used in a frontend browser

<a name="TeraFy+settings"></a>

### teraFy.settings : <code>Object</code>
Various settings to configure behaviour

**Kind**: instance property of [<code>TeraFy</code>](#TeraFy)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| devMode | <code>Boolean</code> | Operate in devMode - i.e. force outer refresh when encountering an existing TeraFy instance |
| siteUrl | <code>String</code> | The TERA URL to connect to |
| restrictOrigin | <code>String</code> | URL to restrict communications to |

<a name="TeraFy+dom"></a>

### teraFy.dom : <code>Object</code>
DOMElements for this TeraFy instance

**Kind**: instance property of [<code>TeraFy</code>](#TeraFy)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| el | <code>DOMElement</code> | The main tera-fy div wrapper |
| iframe | <code>DOMElement</code> | The internal iFrame element |
| stylesheet | <code>DOMElement</code> | The corresponding stylesheet |

<a name="TeraFy+methods"></a>

### teraFy.methods : <code>Array.&lt;String&gt;</code>
List of function stubs mapped here from the server
This array is forms the reference of `TeraFy.METHOD()` objects to provide locally which will be mapped via `TeraFy.rpc(METHOD, ...args)`

**Kind**: instance property of [<code>TeraFy</code>](#TeraFy)  
<a name="TeraFy+acceptPostboxes"></a>

### teraFy.acceptPostboxes
Listening postboxes, these correspond to outgoing message IDs that expect a response

**Kind**: instance property of [<code>TeraFy</code>](#TeraFy)  
<a name="TeraFy+send"></a>

### teraFy.send(message) ⇒ <code>Promise.&lt;\*&gt;</code>
Send a message + wait for a response object

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - A promise which resolves when the operation has completed with the remote reply  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

<a name="TeraFy+sendRaw"></a>

### teraFy.sendRaw(message)
Send raw message content to the server
This function does not return or wait for a reply - use `send()` for that

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Object</code> | Message object to send |

<a name="TeraFy+rpc"></a>

### teraFy.rpc(method) ⇒ <code>Promise.&lt;\*&gt;</code>
Call an RPC function in the server instance

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - The resolved output of the server function  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | The method name to call |
| [...] | <code>\*</code> | Optional arguments to pass to the function |

<a name="TeraFy+acceptMessage"></a>

### teraFy.acceptMessage(Raw)
Accept an incoming message

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  

| Param | Type | Description |
| --- | --- | --- |
| Raw | <code>MessageEvent</code> | message event to process |

<a name="TeraFy+init"></a>

### teraFy.init()
Initalize the TERA client singleton

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
<a name="TeraFy+injectMain"></a>

### teraFy.injectMain()
Find an existing active TERA server OR initalize one

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
<a name="TeraFy+injectStylesheet"></a>

### teraFy.injectStylesheet()
Inject a local stylesheet to handle TERA server functionality

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
<a name="TeraFy+injectMethods"></a>

### teraFy.injectMethods()
Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
<a name="TeraFy+bindProjectState"></a>

### teraFy.bindProjectState([options], Paths) ⇒ <code>Promies.&lt;Reactive.&lt;Object&gt;&gt;</code>
Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance

**Kind**: instance method of [<code>TeraFy</code>](#TeraFy)  
**Returns**: <code>Promies.&lt;Reactive.&lt;Object&gt;&gt;</code> - A reactive object representing the project state  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.write] | <code>Boolean</code> | <code>true</code> | Allow local reactivity to writes - send these to the server |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

