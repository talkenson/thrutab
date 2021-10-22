import { RequestDataProps } from './wrapperTypes'
import { dispatchMessage } from '../modules/dispatch'
import {
  DataPromiseBusState,
  MessageModel,
  RequestBasedMessage,
  RequestMessageStatus,
} from '../types'
import crypto from 'crypto'
import { RequestTimeoutError } from '../errors'

const state: DataPromiseBusState[] = []

export const requestData = <ExpectedDataType = any>({
  to,
  timeout,
  ...req
}: RequestDataProps) => {
  let resolve: DataPromiseBusState<ExpectedDataType>['resolve'],
    reject: DataPromiseBusState['reject'],
    timeoutId: DataPromiseBusState['timeoutId']

  const idSignature = crypto.randomBytes(16).toString('hex')

  const promise = new Promise<ExpectedDataType>((_resolve, _reject) => {
    ;[resolve, reject] = [_resolve, _reject]
    timeoutId = setTimeout(
      () => reject(new RequestTimeoutError()),
      timeout || 3000,
    )
  })

  dispatchMessage<RequestBasedMessage>({
    broadcast: {
      status: RequestMessageStatus.Pending,
      requestId: idSignature,
      requestKey: req.requestKey,
    },
  })

  state.push({
    requestId: idSignature,
    resolve: resolve!,
    reject: reject!,
    timeoutId: timeoutId,
  })

  return promise
}

export const replyOnDataRequest = (
  to: MessageModel<any>['to'],
  requestId: RequestBasedMessage['requestId'],
  requestKey: RequestBasedMessage['requestKey'],
  data: any,
) => {
  dispatchMessage<RequestBasedMessage>({
    broadcast: {
      status: RequestMessageStatus.Fulfilled,
      requestId: requestId,
      requestKey: requestKey,
      answer: data,
    },
    to: to,
  })
}

export const resolveDataRequest = (
  id: RequestBasedMessage['requestId'],
  answer: RequestBasedMessage['answer'],
) => {
  const promise = state.find((v) => v.requestId === id)
  if (promise) {
    promise.timeoutId && clearTimeout(promise.timeoutId)
    promise.resolve(answer)
  }
}
