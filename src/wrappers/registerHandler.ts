import { RequestHandlerFn, SyncHandlerFn } from './wrapperTypes'
import { MessageModel, RequestBasedMessage, TunnelEvent } from '../types'
import { isRequestBasedMessage, isSyncBasedMessage } from '../modules/typeCheck'
import { replyOnDataRequest, resolveDataRequest } from './requestData'

const getReplyFn =
  (
    to: MessageModel<any>['to'],
    requestId: RequestBasedMessage['requestId'],
    requestKey: RequestBasedMessage['requestKey'],
  ) =>
  (data: any) =>
    replyOnDataRequest(to, requestId, requestKey, data)

export const registerHandler = (
  requestFn?: RequestHandlerFn,
  syncFn?: SyncHandlerFn,
) => {
  const builtFn = (event: MessageEvent<TunnelEvent<RequestBasedMessage>>) => {
    if (isRequestBasedMessage(event.data.broadcast)) {
      if (!event.data.broadcast.answer && requestFn) {
        requestFn(
          event.data.broadcast,
          getReplyFn(
            event.data.from,
            event.data.broadcast.requestId,
            event.data.broadcast.requestKey,
          ),
          () => {},
        )
      } else {
        resolveDataRequest(
          event.data.broadcast.requestId,
          event.data.broadcast.answer,
        )
      }
    } else if (isSyncBasedMessage(event.data.broadcast)) {
      if (syncFn) {
        syncFn(event.data.broadcast)
      }
    }
  }
  navigator.serviceWorker.addEventListener('message', builtFn)
  window.addEventListener('beforeunload', (event) => {
    navigator.serviceWorker.removeEventListener('message', builtFn)
  })
  return builtFn
}

export const unregisterHandler = (builtFn: (event: MessageEvent) => void) => {
  navigator.serviceWorker.removeEventListener('message', builtFn)
}
