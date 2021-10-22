import { MessageModel, RegisterMessage } from '../types'
import { NoWorkerAvailableError } from '../errors'

export const dispatchMessage = <T = any>(data: MessageModel<T>) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(data)
  } else {
    throw new NoWorkerAvailableError()
  }
}

export const registerClient = (sign: RegisterMessage) => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      broadcast: sign.broadcast,
    })
  } else {
    throw new NoWorkerAvailableError()
  }
}

export const unregisterClient = () => {
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      broadcast: { type: 'unregister' },
    })
  } else {
    throw new NoWorkerAvailableError()
  }
}

export const addClientToSubscribers = (sign: string) => {
  registerClient({
    broadcast: { sign: sign, type: 'register' },
  })
}

export const cancelSubscriptionOnLeave = () => {
  window.addEventListener('beforeunload', (event) => {
    unregisterClient()
  })
}

export const manageSubscription = (sign: string) => {
  addClientToSubscribers(sign)
  cancelSubscriptionOnLeave()
}
