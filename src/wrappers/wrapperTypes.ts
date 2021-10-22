import { MessageModel, RequestBasedMessage, SyncBasedMessage } from '../types'

export interface RequestDataProps {
  to?: MessageModel<any>['to']
  requestKey: string
  timeout?: number
}

export type RequestHandlerFn = (
  data: RequestBasedMessage,
  reply: (data: RequestBasedMessage['answer']) => void,
  reject: () => void,
) => void

export type SyncHandlerFn = (data: SyncBasedMessage) => void
