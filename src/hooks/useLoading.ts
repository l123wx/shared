import { ref } from 'vue'
import { isFunction } from 'lodash-es'

const Message = {
  success(msg: string) {
    alert(msg)
  },
  error(msg: string) {
    alert(msg)
  },
}

export function setMessageFn(options: {
  success: (msg: string) => void
  error: (msg: string) => void
}) {
  Object.assign(Message, options)
}

interface Options {
  withSuccessMsg?: boolean
  withErrorMsg?: boolean
  successMsg?: string | ((msg: any) => string)
  errorMsg?: string | ((err: any) => string)
}

/**
 * useLoading
 * @example
 *
 * ```js
 * const [isLoading, run] = useLoading()
 *
 * // 第一个参数传入一个 boolean 可以设置 isLoading 默认值
 * const [isLoading, run] = useLoading(true)
 * const [isLoading, run] = useLoading(true, {})
 *
 * // 开启信息提示，需要通过 setMessageFn 方法配置消息 ui 实现
 * // 如使用 Element Plus
 *
 * import { Message } from 'element-plus'
 * setMessageFn({
 *    success: Message.success,
 *    error: Message.error
 * })
 *
 * // 成功信息提示
 * const [isLoading, run] = useLoading({
 *    withSuccessMsg: true
 * })
 *
 * const [isLoading, run] = useLoading({
 *    withSuccessMsg: true,
 *    successMsg: '操作成功'
 * })
 *
 * const [isLoading, run] = useLoading({
 *    withSuccessMsg: true,
 *    successMsg: res => res.message
 * })
 *
 * // 失败消息提示
 * const [isLoading, run] = useLoading({
 *    withErrorMsg: true
 * })
 *
 * const [isLoading, run] = useLoading({
 *    withErrorMsg: true,
 *    errorMsg: '操作失败'
 * })
 *
 * const [isLoading, run] = useLoading({
 *    withErrorMsg: true,
 *    errorMsg: err => err.message
 * })
 * ```
 */
export function useLoading(initValOrOptions: boolean | Options = false, _options: Options = {}) {
  let _loading = false
  if (typeof initValOrOptions === 'object') {
    _options = initValOrOptions
  }
  else {
    _loading = initValOrOptions
  }

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
            Message.error(errorMsg || e?.message || e?.msg || 'Error')
        }
        throw e
      })
  }

  return [isLoading, run] as const
}

export default useLoading
