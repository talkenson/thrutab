import {
  RequestBasedMessage,
  ServiceMessage,
  ServiceMessageTypes,
  SyncBasedMessage,
  TunnelData,
} from '../types'

export const isServiceMessage = (
  broadcast: TunnelData<any>['broadcast'],
): broadcast is ServiceMessage => {
  return (
    Object(broadcast).hasOwnProperty('type') &&
    ServiceMessageTypes.includes(broadcast.type)
  )
}

export const isRequestBasedMessage = (
  broadcast: TunnelData<any>['broadcast'],
): broadcast is RequestBasedMessage => {
  return Object(broadcast).hasOwnProperty('requestId')
}

export const isSyncBasedMessage = (
  broadcast: TunnelData<any>['broadcast'],
): broadcast is SyncBasedMessage => {
  return Object(broadcast).hasOwnProperty('key')
}
