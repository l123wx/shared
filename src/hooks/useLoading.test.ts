import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import useLoading, { setMessageFn } from './useLoading'

const successCallback = vi.fn()
const errorCallback = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()

  setMessageFn({
    success: successCallback,
    error: errorCallback,
  })
})

it('使用 useLoading 会返回一个 Ref 和一个方法', () => {
  const [isLoading, run] = useLoading()

  expectTypeOf(isLoading).toBeObject()
  expect(isLoading.value).not.toBeUndefined()
  expectTypeOf(run).toBeFunction()
})

it('初始化 useLoading 时传入一个 boolean，可以设置 loading 的初始状态', () => {
  const [isLoading] = useLoading(true)

  expect(isLoading.value).toBe(true)
})

describe('若未设置 loading 初始值，默认为 false，isLoading 的状态会根据 run 传入的 promise 变化', () => {
  it('promise resolve', async () => {
    const [isLoading, run] = useLoading()

    expect(isLoading.value).toBe(false)
    run(Promise.resolve()).finally(() => {
      expect(isLoading.value).toBe(false)
    })
    expect(isLoading.value).toBe(true)
  })

  it('promise reject', async () => {
    const [isLoading, run] = useLoading()

    expect(isLoading.value).toBe(false)
    run(Promise.reject()).catch(err => err).finally(() => {
      expect(isLoading.value).toBe(false)
    })
    expect(isLoading.value).toBe(true)
  })
})

describe('success Message', () => {
  it('设置 withSuccessMsg: true 开启成功消息提示，当 Promise resolve 时会调用 Message.success，Promise reject 时不会调用', async () => {
    const [_isLoading, run] = useLoading({
      withSuccessMsg: true,
    })

    await run(Promise.reject()).catch(err => err)
    expect(successCallback).toHaveBeenCalledTimes(0)
    await run(Promise.resolve())
    expect(successCallback).toHaveBeenCalledTimes(1)
  })

  describe('successMsg', () => {
    it('默认值文案为 "Success"', async () => {
      const [_isLoading, run] = useLoading({
        withSuccessMsg: true,
      })

      await run(Promise.resolve())
      expect(successCallback).toHaveBeenCalledWith('Success')
    })

    it('自定义文案', async () => {
      const [_isLoading, run] = useLoading({
        withSuccessMsg: true,
        successMsg: 'Success Message',
      })

      await run(Promise.resolve())
      expect(successCallback).toHaveBeenCalledWith('Success Message')
    })

    it('可设置为一个方法，方法的形参会返回 Promise resolve 的参数，方法需要返回一个 string 作为 successMsg', async () => {
      const createSuccessMsgFn1 = vi.fn((msg: string) => msg)
      const createSuccessMsgFn2 = vi.fn((res: { msg: string }) => res.msg)

      const [_isLoading1, run1] = useLoading({
        withSuccessMsg: true,
        successMsg: createSuccessMsgFn1,
      })
      const [_isLoading2, run2] = useLoading({
        withSuccessMsg: true,
        successMsg: createSuccessMsgFn2,
      })

      await run1(Promise.resolve('message1'))
      expect(createSuccessMsgFn1).toHaveBeenLastCalledWith('message1')
      expect(successCallback).toHaveBeenLastCalledWith('message1')

      const result = {
        msg: 'message2',
      }
      await run2(Promise.resolve(result))
      expect(createSuccessMsgFn2).toHaveBeenLastCalledWith(result)
      expect(successCallback).toHaveBeenLastCalledWith('message2')
    })
  })
})

describe('error Message', () => {
  it('设置 withErrorMsg: true 开启失败消息提示，当 Promise reject 时会调用 Message.error，Promise resolve 时不会调用', async () => {
    const [_isLoading, run] = useLoading({
      withErrorMsg: true,
    })

    await run(Promise.resolve())
    expect(errorCallback).toHaveBeenCalledTimes(0)
    await expect(run(Promise.reject('error'))).rejects.toThrowError('error')
    expect(errorCallback).toHaveBeenCalledTimes(1)
    await expect(run(Promise.reject(new Error('error')))).rejects.toThrowError('error')
    expect(errorCallback).toHaveBeenCalledTimes(2)
  })

  describe('errorMsg', () => {
    it('默认值文案为 "Error"', async () => {
      const [_isLoading, run] = useLoading({
        withErrorMsg: true,
      })

      await expect(run(Promise.reject('error'))).rejects.toThrowError()
      expect(errorCallback).toHaveBeenCalledWith('Error')
    })

    it('自定义文案', async () => {
      const [_isLoading, run] = useLoading({
        withErrorMsg: true,
        errorMsg: 'Error Message',
      })

      await expect(run(Promise.reject('error'))).rejects.toThrowError()
      expect(errorCallback).toHaveBeenCalledWith('Error Message')
    })

    it('可设置为一个方法，方法的形参会返回 Promise reject 的参数，方法需要返回一个 string 作为 errorMsg', async () => {
      const createErrorMsgFn1 = vi.fn((msg: string) => msg)
      const createErrorMsgFn2 = vi.fn((error: Error) => error.message)

      const [_isLoading1, run1] = useLoading({
        withErrorMsg: true,
        errorMsg: createErrorMsgFn1,
      })
      const [_isLoading2, run2] = useLoading({
        withErrorMsg: true,
        errorMsg: createErrorMsgFn2,
      })

      await expect(run1(Promise.reject('message'))).rejects.toThrowError()
      expect(createErrorMsgFn1).toHaveBeenLastCalledWith('message')
      expect(errorCallback).toHaveBeenLastCalledWith('message')

      await expect(run2(Promise.reject(new Error('error')))).rejects.toThrowError()
      expect(createErrorMsgFn2).toHaveBeenLastCalledWith(new Error('error'))
      expect(errorCallback).toHaveBeenLastCalledWith('error')
    })
  })
})
