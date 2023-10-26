## Classes

<dl>
<dt><a href="#TeraFy">TeraFy</a></dt>
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
<dt><a href="#toggleDevMode">toggleDevMode([devModeEnabled])</a> ⇒ <code><a href="#TeraFy">TeraFy</a></code></dt>
<dd><p>Set or toggle devMode</p>
</dd>
<dt><a href="#init">init()</a></dt>
<dd><p>Initalize the TERA client singleton</p>
</dd>
<dt><a href="#injectMain">injectMain()</a></dt>
<dd><p>Find an existing active TERA server OR initalize one</p>
</dd>
<dt><a href="#injectStylesheet">injectStylesheet()</a></dt>
<dd><p>Inject a local stylesheet to handle TERA server functionality</p>
</dd>
<dt><a href="#injectMethods">injectMethods()</a></dt>
<dd><p>Inject all server methods defined in <code>methods</code> as local functions wrapped in the <code>rpc</code> function</p>
</dd>
<dt><a href="#debug">debug()</a></dt>
<dd><p>Debugging output function
This function will only act if <code>settings.devMode</code> is truthy</p>
</dd>
<dt><a href="#bindProjectState">bindProjectState([options], Paths)</a> ⇒ <code>Promies.&lt;Reactive.&lt;Object&gt;&gt;</code></dt>
<dd><p>Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance</p>
</dd>
<dt><a href="#toggleFocus">toggleFocus([isFocused])</a></dt>
<dd><p>Fit the nested TERA server to a full-screen
This is usually because the server component wants to perform some user activity like calling $prompt</p>
</dd>
</dl>

<a name="TeraFy"></a>

## TeraFy
**Kind**: global class  
<a name="new_TeraFy_new"></a>

### new TeraFy()
Main Tera-Fy Client (class singleton) to be used in a frontend browser

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

<a name="toggleDevMode"></a>

## toggleDevMode([devModeEnabled]) ⇒ [<code>TeraFy</code>](#TeraFy)
Set or toggle devMode

**Kind**: global function  
**Returns**: [<code>TeraFy</code>](#TeraFy) - This chainable terafy instance  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [devModeEnabled] | <code>String</code> \| <code>Boolean</code> | <code>&#x27;toggle&#x27;</code> | Optional boolean to force dev mode |

<a name="init"></a>

## init()
Initalize the TERA client singleton

**Kind**: global function  
<a name="injectMain"></a>

## injectMain()
Find an existing active TERA server OR initalize one

**Kind**: global function  
<a name="injectStylesheet"></a>

## injectStylesheet()
Inject a local stylesheet to handle TERA server functionality

**Kind**: global function  
<a name="injectMethods"></a>

## injectMethods()
Inject all server methods defined in `methods` as local functions wrapped in the `rpc` function

**Kind**: global function  
<a name="debug"></a>

## debug()
Debugging output function
This function will only act if `settings.devMode` is truthy

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| [msg...] | <code>String</code> | Output to show |

<a name="bindProjectState"></a>

## bindProjectState([options], Paths) ⇒ <code>Promies.&lt;Reactive.&lt;Object&gt;&gt;</code>
Return a Vue reactive object that can be read/written which whose changes will transparently be written back to the TERA server instance

**Kind**: global function  
**Returns**: <code>Promies.&lt;Reactive.&lt;Object&gt;&gt;</code> - A reactive object representing the project state  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | Additional options to mutate behaviour |
| [options.autoRequire] | <code>Boolean</code> | <code>true</code> | Run `requireProject()` automatically before continuing |
| [options.write] | <code>Boolean</code> | <code>true</code> | Allow local reactivity to writes - send these to the server |
| Paths | <code>Array.&lt;String&gt;</code> |  | to subscribe to e.g. ['/users/'], |

<a name="toggleFocus"></a>

## toggleFocus([isFocused])
Fit the nested TERA server to a full-screen
This is usually because the server component wants to perform some user activity like calling $prompt

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [isFocused] | <code>String</code> \| <code>Boolean</code> | <code>&#x27;toggle&#x27;</code> | Whether to fullscreen the embedded component |

