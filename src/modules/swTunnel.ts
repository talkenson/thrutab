import { DefaultMessageTypes, ThruTabTemplatedEventType } from '../types'
import {
  isRequestBasedMessage,
  isServiceMessage,
  isSyncBasedMessage,
} from './typeCheck'

export async function swTunnel<T = DefaultMessageTypes>(
  this: ServiceWorkerGlobalScope,
  event: ThruTabTemplatedEventType<T>,
) {
  const data: ThruTabTemplatedEventType<T>['data'] = {
    ...event.data,
    from: (event.source as Client).id,
  }
  if ('broadcast' in data) {
    if (isServiceMessage(data.broadcast)) {
      switch (data.broadcast.type) {
        case 'register':
          break
        case 'unregister':
          break
      }
    } else if (isRequestBasedMessage(data.broadcast)) {
      const allClients = await this.clients.matchAll()
      for (const client of allClients) {
        if (client.id !== data.from && (!data.to || data.to === client.id)) {
          client.postMessage({
            broadcast: data.broadcast,
            from: data.from,
            to: data.to,
          })
        }
      }
    } else if (isSyncBasedMessage(data.broadcast)) {
      const allClients = await this.clients.matchAll()
      for (const client of allClients) {
        if (client.id !== data.from) {
          client.postMessage({
            broadcast: data.broadcast,
            from: data.from,
            to: data.to,
          })
        }
      }
    }
  }
}

export function getTypedSwTunnel<T = DefaultMessageTypes>() {
  return function (
    this: ServiceWorkerGlobalScope,
    ev: ThruTabTemplatedEventType<T>,
  ) {
    return swTunnel.bind(this)(ev)
  }
}
