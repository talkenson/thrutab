export class NoWorkerAvailableError extends Error {
  name = 'NoWorkerAvailable'
}

export class RequestTimeoutError extends Error {
  name = 'RequestTimeout'
}
