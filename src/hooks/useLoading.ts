import { ref } from 'vue'
import { isFunction } from 'lodash-es'

const Message = {
  // 根据项目实际情况实现弹窗提示逻辑
  success(msg: string) { /** TODO */ },
  error(err: string) { /** TODO */ },
}

interface Options {
  withSuccessMsg?: boolean
  withErrorMsg?: boolean
  successMsg?: string | ((msg: any) => string)
  errorMsg?: string | ((err: Error) => string)
  catchable?: boolean
}

export function useLoading(initValOrOptions: boolean | Options = false, _options: Options = {}) {
  let _loading = false
  if (typeof initValOrOptions === 'object')
    _options = { ...initValOrOptions, ..._options }
  else
    _loading = initValOrOptions

  const isLoading = ref(_loading)

  const run = <T>(promise: Promise<T>, options: Options = {}): Promise<T> => {
    const {
      withSuccessMsg = false,
      withErrorMsg = false,
      successMsg,
      errorMsg,
    } = { ..._options, ...options }
    if (!promise) {
      console.error(`useLoading error: params is not a promise`)
      return Promise.reject(new Error(`Unknown error`))
    }

    isLoading.value = true

    return promise
      .then((val) => {
        isLoading.value = false
        if (withSuccessMsg) {
          if (isFunction(successMsg))
            Message.success(successMsg(val as T))
          else
            Message.success(successMsg || 'Success')
        }
        return val
      })
      .catch((e) => {
        isLoading.value = false
        if (withErrorMsg) {
          if (isFunction(errorMsg))
            Message.error(errorMsg(e))
          else
            Message.error(errorMsg || e.message || e.msg || 'Error')
        }
        throw e
      })
  }

  return [isLoading, run]
}

export default useLoading
