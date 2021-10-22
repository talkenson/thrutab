export enum RequestMessageStatus {
  Pending,
  Fulfilled,
  Rejected,
}

export interface RequestBasedMessage {
  requestKey: string
  answer?: any
  status: RequestMessageStatus
  requestId: string
}

export interface SyncBasedMessage {
  key: string
  data: any
}

export type DefaultMessageTypes = RequestBasedMessage | SyncBasedMessage

export type ThruTabTemplatedEventType<T> = Omit<
  ExtendableMessageEvent,
  'data'
> & {
  data: TunnelEvent<T>
}

export interface TunnelEventMeta {
  from: string
  to?: string
}

export interface TunnelData<T> {
  broadcast: T
}

export interface TunnelEvent<T> extends TunnelEventMeta, TunnelData<T> {}

export interface MessageModel<T> extends TunnelData<T> {
  to?: string
}

export interface ServiceMessage extends Record<string, any> {
  type: 'register' | 'unregister' | string
}

export const ServiceMessageTypes = ['register', 'unregister']

export interface RegisterMessageContent extends ServiceMessage {
  type: 'register'
  sign: string
}

export interface RegisterMessage extends TunnelData<RegisterMessageContent> {}

export interface ClientMap {
  uuid: string
  hash: string
}

export interface DataPromiseBusState<T = any> {
  requestId: RequestBasedMessage['requestId']
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  timeoutId?: ReturnType<typeof setTimeout>
}
