import { useCallback, useEffect } from 'react'
import { RequestHandlerFn, SyncHandlerFn } from '../wrappers/wrapperTypes'
import { registerHandler, unregisterHandler } from '../wrappers/registerHandler'

export const useConnectorFn = (
  requestHandler: RequestHandlerFn,
  syncHandler: SyncHandlerFn,
) => {
  useEffect(() => {
    const fnRef = registerHandler(requestHandler, syncHandler)
    return () => unregisterHandler(fnRef)
  }, [requestHandler])
}

/**
 * @deprecated
 */
export const useConnectorStore = (store: Record<string, any>) => {
  const requestHandler: RequestHandlerFn = useCallback(
    (data, reply, reject) => {
      if (data && Object(store).hasOwnProperty(data.requestKey)) {
        reply(store[data.requestKey].data)
      } else {
        reject()
      }
    },
    [store],
  )

  useEffect(() => {
    const fnRef = registerHandler(requestHandler)
    return () => unregisterHandler(fnRef)
  }, [requestHandler])
}
