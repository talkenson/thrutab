# ThruTab

This module is designed to simplify communication between tabs in the browser, for example to avoid loading some information twice, or to synchronize the results of your requests in time.
In real-world tasks it is very useful to combine with `Redux` storage, but nobody can forbid you to use it for `localStorage`.

Works on **Vanilla**, **React Hooks**, **Vue 3** _(testing)_!

**This module has an exposed callback, which will need to be added to a message event in the `Service Worker`**
So `Service Worker` is required!

## Basic Usage

There's a list of basic functions:

- [getTypedSwTunnel()](#getTypedSwTunnel)
- [manageSubscription(signature: string)](#manageSubscription)
- [registerHandler(requestHandler, syncHandler)](#registerHandler)
- [unregisterHandler()](#unregisterHandler)
- [requestData({...requestOptions})](#requestData)
- [syncData(key, data)](#syncData)

Usage with frameworks:

**React**
- [useConnectorFn(requestHandler, syncHandler)](#useConnectorFn)
- [useSharedData()](#useSharedData)


## Implementations

<a name="#getTypedSwTunnel"></a>
#### getTypedSwTunnel()
Used in Service Worker
```ts
// Returns Typed SW Tunnel for managing messages
getTypedSwTunnel() 

// Usage in service-worker.ts
self.addEventListener('message', getTypedSwTunnel<any>())
// NOTE: self is ServiceWorkerGlobalScope
```


<a name="#manageSubscription"></a>
#### manageSubscription()
Used in Service Worker registration
```ts
// Will add your signature to SW Tunnel clientStore
manageSubscription(ONLOAD_GENERATED_SIGNATURE)

// Somewhere in registration Service Worker with Workbox Window
// For example you can use this in your index.tsx
...
const localSign = crypto.randomBytes(10).toString('hex')

wb.register()
.then((reg) => {
  manageSubscription(localSign)
})
...
```


<a name="#requestData"></a>
#### requestData()
```ts
// Request key someKey in other tabs
requestData({
    requestKey:'someKey', 
    timeout: CUSTOM_TIMEOUT_IN_MS
    })
  .then((result) => {
    setData(result)
  })
  .catch((e) => console.log('Rejected by timeout, probably', e))
  
```


<a name="#syncData"></a>
#### syncData()
```ts
// Patch someKey value in all tabs (besides the current)
syncData('someKey', cachedData)
```


<a name="#registerHandler"></a>
#### registerHandler()
Used in a module that has access to the cache (for example with `@redux/toolkit`)
See also in [React.js](#useConnectorFn) section
```ts
const handleRequests: RequestHandlerFn = useCallback(
(data, reply, reject) => {
  console.log('Got to handle', data)
  if (data && Object(cache).hasOwnProperty(data.requestKey)) {
    console.log('request is going to be fulfilled')
    reply(cache[data.requestKey].data)
  } else {
    reject()
  }
},
[cache],
)

const handleSync: SyncHandlerFn = useCallback(
(data) => {
  dispatch(
    save({
      key: data.key,
      data: data.data,
    }),
  )
},
[dispatch],
)

const handlersRef = registerHandler(handleRequests, handleSync)

...

// Do not forget to unregister handler before page closes
unregisterHandler(handlersRef)
```

<a name="#unregisterHandler"></a>
#### unregisterHandler()
Check last lines of the previous section

### As React Hooks

<a name="#useConnectorFn"></a>
#### useConnectorFn(requestHandler, syncHandler)
```ts
const handleRequests: RequestHandlerFn = useCallback(
(data, reply, reject) => {
  console.log('Got to handle', data)
  if (data && Object(cache).hasOwnProperty(data.requestKey)) {
    console.log('request is going to be fulfilled')
    reply(cache[data.requestKey].data)
  } else {
    reject()
  }
},
[cache],
)

const handleSync: SyncHandlerFn = useCallback(
(data) => {
  dispatch(
    save({
      key: data.key,
      data: data.data,
    }),
  )
},
[dispatch],
)

useConnectorFn(handleRequests, handleSync)
```

<a name="#useSharedData"></a>
#### useSharedData()
```ts
const { requestData, syncData } = useSharedData()

// Request key someKey in other tabs
requestData('someKey', CUSTOM_TIMEOUT_IN_MS)
  .then((result) => {
    setData(result)
  })
  .catch((e) => console.log('Rejected by timeout, probably', e))
  
// Patch someKey value in all tabs (besides the current)
syncData('someKey', cachedData)
```