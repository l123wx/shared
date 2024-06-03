import { watch } from 'vue'
import { useRoute } from 'vue-router'
import _ from 'lodash-es'

import type { LocationQuery } from 'vue-router'

/**
 * 监听路由 query 参数是否改变，在改变时触发回调
 * @param callback
 * @param options.immediate 在第一次加载时是否执行回调
 * @param options.dependencies 指定需要监听的具体 query
 *
 * @example
 *  // 只有在 time 变化的时候才会回调
 *  onRouteQueryChange(query => {
 *      console.log(query.time)
 *  }, {
 *      dependencies: ['time']
 *  })
 */

export function onRouteQueryChange(callback: (query: LocationQuery) => any, options: {
  immediate?: boolean
  dependencies?: string[]
} = {
  immediate: false,
}) {
  const route = useRoute()
  const path = route.path
  let _query = _.cloneDeep(route.query)

  options.immediate && callback(_query)

  watch(() => route.query, () => {
    if (route.path !== path)
      return

    const isQueryChange = !_.isEqualWith(
      _query,
      route.query,
      (options.dependencies && _.isArray(options.dependencies))
        ? (value, other) => {
            return !options.dependencies?.some(key => value[key] !== other[key])
          }
        : undefined,
    )

    if (isQueryChange) {
      _query = _.cloneDeep(route.query)
      callback(_query)
    }
  }, {
    deep: true,
  })
}
