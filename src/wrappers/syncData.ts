import { dispatchMessage } from '../modules/dispatch'
import { SyncBasedMessage } from '../types'

export const syncData = <T = any>(key: SyncBasedMessage['key'], data: T) => {
  dispatchMessage<SyncBasedMessage>({
    broadcast: {
      key: key,
      data: data,
    },
  })
}
