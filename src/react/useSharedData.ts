import { useCallback } from 'react'
import { requestData as request } from '../wrappers/requestData'
import { syncData as sync } from '../wrappers/syncData'

export const useSharedData = () => {
  const requestData = useCallback(
    (key: string, timeout?: number) =>
      request({
        requestKey: key,
        timeout: timeout,
      }),
    [],
  )

  const syncData = useCallback(
    <T = any>(key: string, data: T) => sync(key, data),
    [],
  )

  return {
    requestData,
    syncData,
  }
}
